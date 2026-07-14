import type { Direction, VectorCriterionType, VectorRoundConfig, VectorRoundItem } from './types';

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
export function checkPass(metrics: VectorMetrics): boolean {
  return metrics.overallAccuracy >= 0.7 && metrics.postTransitionAccuracy >= 0.5 && metrics.timeoutRatio < 0.3;
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

export const CRITERION_RULES: Record<VectorCriterionType, string> = {
  color: '적색·황색 → 좌측 회피 / 청색·녹색 → 우측 회피',
  dangerTier: '홀수 → 좌측 회피 / 짝수 → 우측 회피',
  shape: '각진 신호 → 좌측 회피 / 둥근 신호 → 우측 회피',
  approach: '좌측 접근 → 우측 회피 / 우측 접근 → 좌측 회피',
};

export function introRuleText(config: VectorRoundConfig): string {
  const lines = config.criteriaPool.map((c) => `${CRITERION_LABELS[c]} 기준\n${CRITERION_RULES[c]}`);
  const base = lines.join('\n\n');
  return config.reversal ? `${base}\n\n중력장 반전 — 좌우 명령이 반대로 적용됩니다` : base;
}
