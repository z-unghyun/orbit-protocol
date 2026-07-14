export type GameId = 'vector' | 'cargo' | 'command';

export type ScreenId = 'home' | 'select' | 'intro' | 'play' | 'result';

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
