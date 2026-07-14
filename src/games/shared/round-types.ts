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
  /** result-screen copy, chosen by the game's own logic.ts based on pass/fail + metrics */
  message: string;
}

export function makeSessionId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
