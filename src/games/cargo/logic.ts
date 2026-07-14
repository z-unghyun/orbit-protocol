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
export function checkPass(metrics: CargoMetrics): boolean {
  return metrics.accuracy >= 0.7 && metrics.hazardMisses < 2;
}

export function pickResultMessage(passed: boolean, metrics: CargoMetrics): string {
  if (passed) {
    return metrics.accuracy >= 0.9 ? '예외 규칙을 정확히 적용했습니다.' : '대체로 규칙을 잘 적용했습니다.';
  }
  if (metrics.hazardMisses >= 2) return '위험 화물을 격리실로 보내지 못한 경우가 많았습니다. 예외 규칙을 다시 확인해 보세요.';
  return '예외 규칙에서 혼동이 있었습니다. 다시 시도해 보세요.';
}

export function describeCargoRules(config: CargoRoundConfig): string {
  const lines = ['청색 연료 셀은 동력실로 보낸다.'];
  if (config.hasComboRule) lines.push('생체 반응이 있는 표본은 연구실로 보낸다.\n단, 동결 표시가 있는 생체 표본은 냉동 보관실로 보낸다.');
  if (config.hasExceptionRule) lines.push('위험 등급 4 이상은 다른 규칙보다 먼저 격리실로 보낸다.');
  if (config.hasQuarantineAlert) lines.push('격리 경보 아이콘이 있으면 즉시 격리실로 보낸다.');
  if (config.hasMemoryRule) lines.push('직전 화물과 같은 색상이면 임시 보류 구역으로 보낸다.');
  return lines.join('\n\n');
}
