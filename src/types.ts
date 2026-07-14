export type GameId = 'vector' | 'cargo' | 'command';

export function isGameId(value: string | undefined): value is GameId {
  return value === 'vector' || value === 'cargo' || value === 'command';
}

export interface GameConfig {
  id: GameId;
  nameEn: string;
  nameKo: string;
  accent: string;
  total: number;
  passed: number;
  desc: string;
  tags: string[];
  ruleText: string;
  gradient: string;
}
