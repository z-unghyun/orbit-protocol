import type { Direction, VectorCriterionType, VectorRoundItem } from './types';

export interface VectorAnswerRecord {
  item: VectorRoundItem;
  chosen: Direction | null; // null = timeout
  correct: boolean;
}

export function scoreForAnswer(item: VectorRoundItem, correct: boolean): number {
  if (!correct) return -30;
  if (item.isPostTransition && item.isConflict) return 180;
  if (item.isPostTransition) return 140;
  if (item.isConflict) return 130;
  return 100;
}

export interface VectorMetrics {
  attempts: number;
  successes: number;
  score: number;
  overallAccuracy: number;
  postTransitionAccuracy: number;
  timeoutRatio: number;
}

export function computeMetrics(records: VectorAnswerRecord[]): VectorMetrics {
  const attempts = records.length;
  const successes = records.filter((r) => r.correct).length;
  const score = records.reduce((sum, r) => sum + scoreForAnswer(r.item, r.correct), 0);
  const postItems = records.filter((r) => r.item.isPostTransition);
  const postSuccesses = postItems.filter((r) => r.correct).length;
  const timeouts = records.filter((r) => r.chosen === null).length;
  return {
    attempts,
    successes,
    score,
    overallAccuracy: attempts === 0 ? 0 : successes / attempts,
    postTransitionAccuracy: postItems.length === 0 ? 1 : postSuccesses / postItems.length,
    timeoutRatio: attempts === 0 ? 0 : timeouts / attempts,
  };
}

/** handoff §8.12 통과 기준 */
export const PASS_THRESHOLDS = {
  overallAccuracy: 0.7,
  postTransitionAccuracy: 0.5,
  timeoutRatio: 0.3,
};

export function checkPass(metrics: VectorMetrics): boolean {
  return (
    metrics.overallAccuracy >= PASS_THRESHOLDS.overallAccuracy &&
    metrics.postTransitionAccuracy >= PASS_THRESHOLDS.postTransitionAccuracy &&
    metrics.timeoutRatio < PASS_THRESHOLDS.timeoutRatio
  );
}

export function pickResultMessage(passed: boolean, metrics: VectorMetrics): string {
  if (passed) {
    return metrics.postTransitionAccuracy >= 0.8
      ? '규칙 전환 이후에도 반응이 안정적이었습니다.'
      : '전반적으로 무난하게 항로를 유지했습니다.';
  }
  if (metrics.postTransitionAccuracy < 0.5) {
    return '규칙 전환 직후 반응이 늦어졌습니다. 같은 라운드를 다시 시도할 수 있습니다.';
  }
  if (metrics.timeoutRatio >= 0.3) {
    return '제한 시간 내 응답하지 못한 신호가 많았습니다.';
  }
  return '이번 라운드에는 방해 신호가 많았습니다.';
}

export const CRITERION_LABELS: Record<VectorCriterionType, string> = {
  color: '색상',
  dangerTier: '위험 등급',
  shape: '천체 형태',
  approach: '접근 방향',
};

export interface DirectionalRule {
  /** trigger values that mean "evade left" */
  left: string[];
  /** trigger values that mean "evade right" */
  right: string[];
}

export const CRITERION_RULES: Record<VectorCriterionType, DirectionalRule> = {
  color: { left: ['적색', '황색'], right: ['청색', '녹색'] },
  dangerTier: { left: ['홀수'], right: ['짝수'] },
  shape: { left: ['각진 신호'], right: ['둥근 신호'] },
  approach: { left: ['우측 접근'], right: ['좌측 접근'] },
};

/** rule with left/right swapped when the round's reversal modifier is active */
export function effectiveCriterionRule(criterion: VectorCriterionType, reversal: boolean): DirectionalRule {
  const rule = CRITERION_RULES[criterion];
  return reversal ? { left: rule.right, right: rule.left } : rule;
}
