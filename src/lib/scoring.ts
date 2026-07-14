import { GAME_ORDER, gameConfig } from '../data/games';
import type { LocalSave } from './local-save';
import type { GameId } from '../types';

/** handoff §9.2 — 게임별 진척도 = 통과한 최고 라운드 / 전체 라운드 × 100 */
export function gameProgressPercent(gameId: GameId, save: LocalSave): number {
  const total = gameConfig[gameId].total;
  if (total === 0) return 0;
  const highest = save.progress[gameId].highestRoundPassed;
  return (Math.min(highest, total) / total) * 100;
}

/** handoff §9.3/§21 — 전체 진척도 = 세 게임 통과 라운드 합 / 30 × 100 */
export function overallProgressPercent(save: LocalSave): number {
  const totalRounds = GAME_ORDER.reduce((sum, id) => sum + gameConfig[id].total, 0);
  if (totalRounds === 0) return 0;
  const passedRounds = GAME_ORDER.reduce(
    (sum, id) => sum + Math.min(save.progress[id].highestRoundPassed, gameConfig[id].total),
    0
  );
  return (passedRounds / totalRounds) * 100;
}

/** handoff §10.1 — 전체 성공률 = 누적 성공 행동 수 / 누적 전체 행동 수 × 100 */
export function overallSuccessRate(save: LocalSave): number {
  const attempts = save.history.reduce((sum, r) => sum + r.attempts, 0);
  const successes = save.history.reduce((sum, r) => sum + r.successes, 0);
  return attempts === 0 ? 0 : (successes / attempts) * 100;
}

/** handoff §10.2 — 최근 성공률 = 최근 완료한 N개 라운드의 성공/전체 행동 합 × 100 */
export function recentSuccessRate(save: LocalSave, windowSize = 10): number {
  const recent = save.history.slice(-windowSize);
  const attempts = recent.reduce((sum, r) => sum + r.attempts, 0);
  const successes = recent.reduce((sum, r) => sum + r.successes, 0);
  return attempts === 0 ? 0 : (successes / attempts) * 100;
}

/** handoff §11.1 — 랭킹 점수 = 전체 진척도 × 0.6 + 최근 성공률 × 0.4 (서버 없이 클라이언트 미리보기용) */
export function estimatedRankingScore(save: LocalSave): number {
  return overallProgressPercent(save) * 0.6 + recentSuccessRate(save) * 0.4;
}
