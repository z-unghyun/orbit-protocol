import { gameConfig } from '../data/games';
import type { LocalSave } from './local-save';
import type { GameId } from '../types';

/** Next round to play: one past the highest passed round, capped at the game's last round. */
export function nextRoundForGame(gameId: GameId, save: LocalSave): number {
  const total = gameConfig[gameId].total;
  const highest = save.progress[gameId].highestRoundPassed;
  return Math.min(highest + 1, total);
}
