import type { EventEffect, MissionTemplate, ResourceBudget } from './types';

export function canAfford(remaining: ResourceBudget, cost: Partial<ResourceBudget>): boolean {
  return (
    remaining.power >= (cost.power ?? 0) &&
    remaining.crew >= (cost.crew ?? 0) &&
    remaining.turns >= (cost.turns ?? 0) &&
    remaining.parts >= (cost.parts ?? 0)
  );
}

export function deduct(remaining: ResourceBudget, cost: Partial<ResourceBudget>): ResourceBudget {
  return {
    power: remaining.power - (cost.power ?? 0),
    crew: remaining.crew - (cost.crew ?? 0),
    turns: remaining.turns - (cost.turns ?? 0),
    parts: remaining.parts - (cost.parts ?? 0),
  };
}

export function applyEffect(remaining: ResourceBudget, effect: EventEffect): ResourceBudget {
  return {
    power: remaining.power + (effect.power ?? 0),
    crew: remaining.crew + (effect.crew ?? 0),
    turns: remaining.turns + (effect.turns ?? 0),
    parts: remaining.parts + (effect.parts ?? 0),
  };
}

/** handoff §6.12 — 완료한 임무 중요도 합 / 전체 임무 중요도 합 × 100 */
export function importanceWeightedSuccessRate(completed: MissionTemplate[], all: MissionTemplate[]): number {
  const totalWeight = all.reduce((sum, m) => sum + m.importance, 0);
  if (totalWeight === 0) return 0;
  const completedWeight = completed.reduce((sum, m) => sum + m.importance, 0);
  return (completedWeight / totalWeight) * 100;
}

export function scoreForMission(mission: MissionTemplate): number {
  return mission.importance * 200;
}

export interface CommandSettlement {
  completed: MissionTemplate[];
  score: number;
  hull: number;
  mandatoryAllDone: boolean;
}

/** handoff §6.11 통과 기준: 필수 임무 성공 + 선체 안정도 1 이상 + 라운드별 최소 점수 이상 */
export function checkPass(settlement: CommandSettlement, minScore: number): boolean {
  return settlement.mandatoryAllDone && settlement.hull >= 1 && settlement.score >= minScore;
}

export function pickResultMessage(passed: boolean, settlement: CommandSettlement): string {
  if (passed) return '제한된 자원 안에서 우선순위 임무를 성공적으로 처리했습니다.';
  if (!settlement.mandatoryAllDone) return '필수 임무를 완료하지 못했습니다. 자원 배분을 다시 계획해 보세요.';
  if (settlement.hull < 1) return '선체 손상이 누적되어 항해를 지속할 수 없었습니다.';
  return '이번 라운드에는 방해 신호가 많았습니다. 다시 시도해 보세요.';
}
