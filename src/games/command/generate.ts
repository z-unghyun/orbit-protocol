import { mulberry32, pick, shuffle } from '../../lib/rng';
import { MISSION_CATALOG, missionById } from './mission-catalog';
import { CHOICE_EVENTS, NEGATIVE_EVENTS, POSITIVE_EVENTS } from './event-catalog';
import type { CommandRoundConfig, CommandRoundContent, EventCard } from './types';

export function generateCommandRound(config: CommandRoundConfig, seed: number): CommandRoundContent {
  const rng = mulberry32(seed);

  const eligible = MISSION_CATALOG.filter((m) => {
    if (m.deadline && !config.hasDeadlines) return false;
    if (m.prereqId && !config.hasPrereqs) return false;
    if (m.riskReward && !config.hasRiskReward) return false;
    return true;
  });
  const mandatory = eligible.filter((m) => m.mandatory);
  const optionalPool = shuffle(rng, eligible.filter((m) => !m.mandatory));
  const optionalCount = Math.min(optionalPool.length, 3 + Math.floor(config.roundNumber / 3));
  const picked = [...mandatory, ...optionalPool.slice(0, optionalCount)];

  // a mission whose prereq didn't make the cut would be permanently unsolvable
  // this round — pull the prereq mission in too whenever that happens
  const pickedIds = new Set(picked.map((m) => m.id));
  for (const m of picked) {
    if (m.prereqId && !pickedIds.has(m.prereqId)) {
      picked.push(missionById(m.prereqId));
      pickedIds.add(m.prereqId);
    }
  }
  const missions = shuffle(rng, picked);

  let event: EventCard | null = null;
  if (config.hasEvents) {
    const pools = [POSITIVE_EVENTS, NEGATIVE_EVENTS, ...(config.hasRiskReward ? [CHOICE_EVENTS] : [])];
    event = pick(rng, pick(rng, pools));
  }
  const eventAfterTurns = Math.max(1, Math.floor(config.budget.turns / 2));

  return { config, missions, event, eventAfterTurns };
}
