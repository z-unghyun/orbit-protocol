import type { GameId } from '../../types';

export interface RoundResult {
  sessionId: string;
  gameId: GameId;
  roundNumber: number;
  roundSeed: number;
  attempts: number;
  successes: number;
  score: number;
  passed: boolean;
  durationMs: number;
  completedAt: number;
  failureMessage?: string;
}
