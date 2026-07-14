import { useEffect, useMemo, useState } from 'react';
import { generateCommandRound } from './generate';
import { applyEffect, canAfford, checkPass, deduct, pickResultMessage, scoreForMission } from './logic';
import { missionById } from './mission-catalog';
import type { CommandRoundConfig, MissionTemplate, ResourceBudget } from './types';
import { makeSessionId, type RoundResult } from '../shared/round-types';

interface CommandRoundProps {
  roundNumber: number;
  config: CommandRoundConfig;
  seed: number;
  paused: boolean;
  onScoreChange: (score: number) => void;
  onComplete: (result: RoundResult) => void;
}

type Phase = 'plan' | 'execute' | 'event' | 'settle';

export default function CommandRound({ roundNumber, config, seed, paused, onScoreChange, onComplete }: CommandRoundProps) {
  const content = useMemo(() => generateCommandRound(config, seed), [config, seed]);
  const mandatoryIds = useMemo(() => new Set(content.missions.filter((m) => m.mandatory).map((m) => m.id)), [content]);

  const [phase, setPhase] = useState<Phase>('plan');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [remaining, setRemaining] = useState<ResourceBudget>(config.budget);
  const [hull, setHull] = useState(config.hull);
  const [executeIndex, setExecuteIndex] = useState(0);
  const [completed, setCompleted] = useState<MissionTemplate[]>([]);
  const [eventBonus, setEventBonus] = useState(0);
  const [eventChoiceMade, setEventChoiceMade] = useState<'A' | 'B' | null>(null);
  const roundStartRef = useState(() => Date.now())[0];

  const queue = content.missions.filter((m) => selectedIds.has(m.id));
  const startedAt = roundStartRef;

  // mission id -> names of missions that require it, so a card can say "unlocks X"
  const dependentsOf = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const m of content.missions) {
      if (!m.prereqId) continue;
      map.set(m.prereqId, [...(map.get(m.prereqId) ?? []), m.name]);
    }
    return map;
  }, [content]);

  function sumCosts(missions: MissionTemplate[]): ResourceBudget {
    return missions.reduce(
      (acc, m) => ({
        power: acc.power + (m.cost.power ?? 0),
        crew: acc.crew + (m.cost.crew ?? 0),
        turns: acc.turns + (m.cost.turns ?? 0),
        parts: acc.parts + (m.cost.parts ?? 0),
      }),
      { power: 0, crew: 0, turns: 0, parts: 0 }
    );
  }

  const planRemaining = deduct(config.budget, sumCosts(queue));

  function toggleMission(mission: MissionTemplate) {
    if (paused) return;
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(mission.id)) {
        next.delete(mission.id);
      } else {
        const wouldSpend = sumCosts(content.missions.filter((m) => next.has(m.id) || m.id === mission.id));
        if (!canAfford(config.budget, wouldSpend)) return prev;
        next.add(mission.id);
      }
      return next;
    });
  }

  function isLocked(mission: MissionTemplate): boolean {
    if (!mission.prereqId) return false;
    return !selectedIds.has(mission.prereqId);
  }

  function startExecution() {
    if (paused) return;
    setPhase('execute');
    setExecuteIndex(0);
  }

  useEffect(() => {
    if (phase !== 'execute' || paused) return;
    if (executeIndex >= queue.length) {
      if (content.event) setPhase('event');
      else setPhase('settle');
      return;
    }
    const mission = queue[executeIndex];
    const t = window.setTimeout(() => {
      setRemaining((prev) => {
        if (!canAfford(prev, mission.cost)) return prev;
        setCompleted((c) => [...c, mission]);
        return deduct(prev, mission.cost);
      });
      setExecuteIndex((i) => i + 1);
    }, 550);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, executeIndex, paused]);

  useEffect(() => {
    onScoreChange(completed.reduce((sum, m) => sum + scoreForMission(m), 0) + eventBonus);
  }, [completed, eventBonus, onScoreChange]);

  function resolveEvent(choice?: 'A' | 'B') {
    if (!content.event) return;
    if (content.event.kind === 'choice') {
      const option = choice === 'A' ? content.event.optionA : content.event.optionB;
      if (!option) return;
      setEventChoiceMade(choice ?? 'B');
      setRemaining((prev) => applyEffect(prev, option.effect));
      if (option.effect.hull) setHull((h) => Math.max(0, h + option.effect.hull!));
      if (choice === 'A' && content.event.optionA?.bonusScore) setEventBonus(content.event.optionA.bonusScore);
    } else {
      const effect = content.event.effect ?? {};
      setRemaining((prev) => applyEffect(prev, effect));
      if (effect.hull) setHull((h) => Math.max(0, h + effect.hull!));
    }
    window.setTimeout(() => setPhase('settle'), content.event.kind === 'choice' ? 500 : 900);
  }

  useEffect(() => {
    if (phase !== 'event' || paused || !content.event) return;
    if (content.event.kind !== 'choice') resolveEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, paused]);

  useEffect(() => {
    if (phase !== 'settle') return;
    const mandatoryAllDone = [...mandatoryIds].every((id) => completed.some((m) => m.id === id));
    const score = completed.reduce((sum, m) => sum + scoreForMission(m), 0) + eventBonus;
    const settlement = { completed, score, hull, mandatoryAllDone };
    const passed = checkPass(settlement, config.minScore);
    const message = pickResultMessage(passed, settlement);
    const result: RoundResult = {
      sessionId: makeSessionId(),
      gameId: 'command',
      roundNumber,
      roundSeed: seed,
      attempts: content.missions.length,
      successes: completed.length,
      score,
      passed,
      durationMs: Date.now() - startedAt,
      completedAt: Date.now(),
      message,
    };
    onComplete(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === 'plan') {
    return (
      <>
        <ResourceBar remaining={planRemaining} />
        <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', margin: '4px 0 10px' }}>
          임무를 선택하세요 · 선택할 때마다 위 자원이 즉시 차감됩니다
        </div>
        {content.missions.map((m) => {
          const locked = isLocked(m);
          const selected = selectedIds.has(m.id);
          const isMandatory = mandatoryIds.has(m.id);
          const unlocks = dependentsOf.get(m.id);
          const costText = [
            m.cost.power ? `전력 ${m.cost.power}` : null,
            m.cost.crew ? `승무원 ${m.cost.crew}` : null,
            m.cost.parts ? `부품 ${m.cost.parts}` : null,
            `${m.cost.turns ?? 1}턴 소요`,
          ].filter(Boolean).join(' · ');
          const importanceLabel = m.importance === 3 ? '중요도 높음' : m.importance === 2 ? '중요도 보통' : '중요도 낮음';
          const importanceColor = m.importance === 3 ? '#c23b2e' : m.importance === 2 ? '#a4791f' : '#5b3fae';
          const importanceBg = m.importance === 3 ? '#fdeceb' : m.importance === 2 ? '#f7f0dd' : '#efeaf9';
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => toggleMission(m)}
              disabled={locked || paused}
              style={{
                width: '100%',
                textAlign: 'left',
                background: selected ? '#f7f6f1' : '#fff',
                border: `1px solid ${selected ? '#1a1a1a' : '#eeece5'}`,
                borderRadius: 16,
                padding: '14px 16px',
                marginBottom: 10,
                cursor: locked ? 'default' : 'pointer',
                opacity: locked ? 0.5 : 1,
                fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a1a' }}>
                  {m.name}
                  {isMandatory && <span style={{ color: '#c23b2e' }}> · 필수</span>}
                  {m.deadline && <span style={{ color: '#a4791f' }}> · 마감</span>}
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, color: importanceColor, background: importanceBg, borderRadius: 20, padding: '3px 8px' }}>
                  {importanceLabel}
                </div>
              </div>
              <div style={{ fontSize: 11.5, color: '#9a9789' }}>
                {locked ? `🔗 선행 조건: ${missionById(m.prereqId!).name} 먼저 선택` : costText}
              </div>
              {unlocks && !locked && (
                <div style={{ fontSize: 11, color: '#5b7fd6', marginTop: 4 }}>🔗 선행 임무 · {unlocks.join(', ')} 잠금 해제</div>
              )}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => !paused && startExecution()}
          style={{ background: '#1a1a1a', color: '#fff', textAlign: 'center', padding: 16, borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 8, width: '100%', border: 'none', fontFamily: 'inherit' }}
        >
          임무 실행
        </button>
      </>
    );
  }

  if (phase === 'execute') {
    return (
      <>
        <ResourceBar remaining={remaining} />
        <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', margin: '4px 0 10px' }}>임무 실행 중</div>
        {queue.map((m, i) => {
          const done = i < executeIndex;
          const active = i === executeIndex;
          return (
            <div
              key={m.id}
              style={{
                background: done ? '#eef6e6' : active ? '#f7f6f1' : '#fff',
                border: `1px solid ${done ? '#cfe8c4' : '#eeece5'}`,
                borderRadius: 16,
                padding: '14px 16px',
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 13.5, fontWeight: 700, color: done ? '#3f7d3a' : '#1a1a1a' }}>
                {done ? '✓ ' : active ? '▶ ' : ''}
                {m.name}
              </div>
            </div>
          );
        })}
      </>
    );
  }

  if (phase === 'event' && content.event) {
    const event = content.event;
    return (
      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '20px 18px', textAlign: 'center' }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a1a', marginBottom: 14 }}>{event.text}</div>
        {event.kind === 'choice' && !eventChoiceMade && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button type="button" onClick={() => resolveEvent('A')} style={{ padding: '14px 12px', borderRadius: 14, border: '1px solid #eeece5', background: '#fff', fontFamily: 'inherit', cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{event.optionA?.label}</div>
              <div style={{ fontSize: 11, color: '#9a9789' }}>{event.optionA?.note}</div>
            </button>
            <button type="button" onClick={() => resolveEvent('B')} style={{ padding: '14px 12px', borderRadius: 14, border: '1px solid #eeece5', background: '#fff', fontFamily: 'inherit', cursor: 'pointer' }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{event.optionB?.label}</div>
              <div style={{ fontSize: 11, color: '#9a9789' }}>{event.optionB?.note}</div>
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function ResourceBar({ remaining }: { remaining: ResourceBudget }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 18 }}>
      {[
        ['전력', remaining.power],
        ['승무원', remaining.crew],
        ['시간', remaining.turns],
        ['부품', remaining.parts],
      ].map(([label, value]) => (
        <div key={label as string} style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
          <div style={{ fontSize: 9.5, color: '#9a9789', fontWeight: 600 }}>{label}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: (value as number) < 0 ? '#c23b2e' : '#1a1a1a' }}>{value}</div>
        </div>
      ))}
    </div>
  );
}
