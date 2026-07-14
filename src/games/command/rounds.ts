import type { CommandRoundConfig } from './types';

/** handoff §6.10 라운드별 난이도 + §6.11 최소 점수 */
export const COMMAND_ROUNDS: CommandRoundConfig[] = [
  { roundNumber: 1, budget: { power: 4, crew: 2, turns: 3, parts: 2 }, hull: 5, minScore: 500, hasDeadlines: false, hasPrereqs: false, hasEvents: false, hasRiskReward: false, changeNote: '출항 점검' },
  { roundNumber: 2, budget: { power: 4, crew: 2, turns: 4, parts: 2 }, hull: 5, minScore: 800, hasDeadlines: false, hasPrereqs: false, hasEvents: false, hasRiskReward: false, changeNote: '통신 장애' },
  { roundNumber: 3, budget: { power: 5, crew: 2, turns: 4, parts: 2 }, hull: 5, minScore: 1100, hasDeadlines: true, hasPrereqs: false, hasEvents: false, hasRiskReward: false, changeNote: '소행성 지대' },
  { roundNumber: 4, budget: { power: 5, crew: 3, turns: 5, parts: 3 }, hull: 5, minScore: 1400, hasDeadlines: true, hasPrereqs: true, hasEvents: false, hasRiskReward: false, changeNote: '기관실 과열' },
  { roundNumber: 5, budget: { power: 6, crew: 3, turns: 5, parts: 3 }, hull: 5, minScore: 1700, hasDeadlines: true, hasPrereqs: true, hasEvents: true, hasRiskReward: false, changeNote: '우주 폭풍' },
  { roundNumber: 6, budget: { power: 6, crew: 3, turns: 5, parts: 3 }, hull: 5, minScore: 2000, hasDeadlines: true, hasPrereqs: true, hasEvents: true, hasRiskReward: false, changeNote: '승무원 부상' },
  { roundNumber: 7, budget: { power: 6, crew: 4, turns: 6, parts: 3 }, hull: 5, minScore: 2300, hasDeadlines: true, hasPrereqs: true, hasEvents: true, hasRiskReward: true, changeNote: '외계 신호' },
  { roundNumber: 8, budget: { power: 7, crew: 4, turns: 6, parts: 4 }, hull: 5, minScore: 2600, hasDeadlines: true, hasPrereqs: true, hasEvents: true, hasRiskReward: true, changeNote: '항법 시스템 붕괴' },
];
