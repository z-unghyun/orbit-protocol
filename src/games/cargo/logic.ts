import type { CargoRoundConfig, CargoRoundItem, CargoZoneId } from './types';

export interface CargoAnswerRecord {
  roundItem: CargoRoundItem;
  chosen: CargoZoneId | null; // null = timeout
  correct: boolean;
  remainingFraction: number; // 0..1, time left when answered
  streakAtAnswer: number;
}

/** handoff §7.13 — 속도 점수는 정답 점수의 최대 30%로 제한 */
export function scoreForAnswer(record: CargoAnswerRecord): number {
  if (record.chosen === null) return -20;
  if (!record.correct) return -40;
  const speedBonus = Math.round(30 * record.remainingFraction);
  const streakBonus = record.streakAtAnswer >= 3 ? 15 : 0;
  const exceptionBonus = record.roundItem.isHazard && record.roundItem.correctZone === 'quarantine' ? 10 : 0;
  return 100 + speedBonus + streakBonus + exceptionBonus;
}

export interface CargoMetrics {
  attempts: number;
  successes: number;
  score: number;
  accuracy: number;
  hazardMisses: number;
}

export function computeMetrics(records: CargoAnswerRecord[]): CargoMetrics {
  const attempts = records.length;
  const successes = records.filter((r) => r.correct).length;
  const score = records.reduce((sum, r) => sum + scoreForAnswer(r), 0);
  const hazardMisses = records.filter((r) => r.roundItem.isHazard && !r.correct).length;
  return {
    attempts,
    successes,
    score,
    accuracy: attempts === 0 ? 0 : successes / attempts,
    hazardMisses,
  };
}

/** handoff §7.14 통과 기준 */
export const PASS_THRESHOLDS = {
  accuracy: 0.7,
  maxHazardMisses: 2,
};

export function checkPass(metrics: CargoMetrics): boolean {
  return metrics.accuracy >= PASS_THRESHOLDS.accuracy && metrics.hazardMisses < PASS_THRESHOLDS.maxHazardMisses;
}

export function pickResultMessage(passed: boolean, metrics: CargoMetrics): string {
  if (passed) {
    return metrics.accuracy >= 0.9 ? '예외 규칙을 정확히 적용했습니다.' : '대체로 규칙을 잘 적용했습니다.';
  }
  if (metrics.hazardMisses >= 2) return '위험 화물을 격리실로 보내지 못한 경우가 많았습니다. 예외 규칙을 다시 확인해 보세요.';
  return '예외 규칙에서 혼동이 있었습니다. 다시 시도해 보세요.';
}

/**
 * 우선순위(특수 > 예외 > 조합 > 일반) 순서 그대로 나열한다.
 * generate.ts의 resolveZone과 반드시 1:1로 대응해야 한다 — 여기 없는 규칙은
 * 화면에도 나타나선 안 되고, resolveZone에 있는 규칙은 반드시 여기 문서화한다.
 */
export function describeCargoRules(config: CargoRoundConfig): string {
  const lines: string[] = [];
  if (config.hasMemoryRule) lines.push('[최우선] 직전 화물과 같은 색상이면 임시 보류 구역으로 보낸다.');
  if (config.hasQuarantineAlert) lines.push('[최우선] 격리 경보 아이콘이 있으면 즉시 격리실로 보낸다.');
  if (config.hasExceptionRule) lines.push('[예외] 위험 등급 4 이상은 다른 규칙보다 먼저 격리실로 보낸다.');
  if (config.hasComboRule) {
    lines.push('[조합] 생체 반응이 있고 동결 표시가 있는 표본은 냉동 보관실로 보낸다.');
    lines.push('[조합] 그 외 생체 반응이 있는 표본은 연구실로 보낸다.');
  }
  lines.push('청색 연료 셀은 동력실로 보낸다.');
  if (config.midRoundRuleSwap) {
    lines.push('흰색 화물은 우주 폐기 구역으로 보낸다. (라운드 후반부에는 임시 보류 구역으로 바뀐다)');
  } else {
    lines.push('흰색 화물은 우주 폐기 구역으로 보낸다.');
  }
  lines.push('위 규칙에 해당하지 않는 화물은 일반 화물칸으로 보낸다.');
  return lines.join('\n');
}
