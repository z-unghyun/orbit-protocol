import type { GameId } from '../types';
import type { RoundResult } from '../games/shared/round-types';

const STORAGE_KEY = 'orbit-protocol:v1';
const HISTORY_LIMIT = 50;

export interface InProgressRound {
  gameId: GameId;
  roundNumber: number;
  roundSeed: number;
  itemIndex: number;
  score: number;
  successCount: number;
  attemptCount: number;
  remainingTimeMs: number;
  startedAt: number;
}

export interface GameProgress {
  highestRoundPassed: number;
  bestScore: number;
}

export interface LocalSave {
  version: 1;
  settings: { soundOn: boolean; reduceMotion: boolean };
  progress: Record<GameId, GameProgress>;
  history: RoundResult[];
  inProgress: InProgressRound | null;
}

function defaultSave(): LocalSave {
  return {
    version: 1,
    settings: { soundOn: true, reduceMotion: false },
    progress: {
      vector: { highestRoundPassed: 0, bestScore: 0 },
      cargo: { highestRoundPassed: 0, bestScore: 0 },
      command: { highestRoundPassed: 0, bestScore: 0 },
    },
    history: [],
    inProgress: null,
  };
}

let cache: LocalSave | null = null;
const listeners = new Set<() => void>();

function hasStorage(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage;
}

function read(): LocalSave {
  if (cache) return cache;
  if (!hasStorage()) {
    cache = defaultSave();
    return cache;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cache = defaultSave();
      return cache;
    }
    const parsed = JSON.parse(raw);
    cache = parsed?.version === 1 ? (parsed as LocalSave) : defaultSave();
    return cache;
  } catch {
    cache = defaultSave();
    return cache;
  }
}

function write(next: LocalSave) {
  cache = next;
  if (hasStorage()) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // storage unavailable (private mode / quota exceeded) — keep in-memory only
    }
  }
  listeners.forEach((listener) => listener());
}

export function getSnapshot(): LocalSave {
  return read();
}

export function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

export function updateSettings(patch: Partial<LocalSave['settings']>) {
  const cur = read();
  write({ ...cur, settings: { ...cur.settings, ...patch } });
}

export function startRound(inProgress: InProgressRound) {
  write({ ...read(), inProgress });
}

export function checkpointRound(patch: Partial<InProgressRound>) {
  const cur = read();
  if (!cur.inProgress) return;
  write({ ...cur, inProgress: { ...cur.inProgress, ...patch } });
}

export function clearInProgress() {
  const cur = read();
  if (!cur.inProgress) return;
  write({ ...cur, inProgress: null });
}

export function recordRoundResult(result: RoundResult) {
  const cur = read();
  if (cur.history.some((r) => r.sessionId === result.sessionId)) return;

  const history = [...cur.history, result].slice(-HISTORY_LIMIT);
  const prevProgress = cur.progress[result.gameId];
  const highestRoundPassed = result.passed
    ? Math.max(prevProgress.highestRoundPassed, result.roundNumber)
    : prevProgress.highestRoundPassed;
  const bestScore = Math.max(prevProgress.bestScore, result.score);

  write({
    ...cur,
    history,
    inProgress: null,
    progress: { ...cur.progress, [result.gameId]: { highestRoundPassed, bestScore } },
  });
}
