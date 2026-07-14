export interface ResourceBudget {
  power: number;
  crew: number;
  turns: number;
  parts: number;
}

export interface MissionTemplate {
  id: string;
  name: string;
  cost: Partial<ResourceBudget>;
  importance: 1 | 2 | 3; // 낮음/보통/높음, handoff §6.12 가중치
  mandatory?: boolean;
  deadline?: boolean; // 전체 턴의 절반 이전에 실행해야 함
  prereqId?: string;
  riskReward?: boolean;
}

export type EventKind = 'positive' | 'negative' | 'choice';

export interface EventEffect {
  power?: number;
  crew?: number;
  turns?: number;
  parts?: number;
  hull?: number;
}

export interface EventCard {
  id: string;
  kind: EventKind;
  text: string;
  effect?: EventEffect;
  optionA?: { label: string; effect: EventEffect; note: string; bonusScore?: number };
  optionB?: { label: string; effect: EventEffect; note: string };
}

export interface CommandRoundConfig {
  roundNumber: number;
  budget: ResourceBudget;
  hull: number;
  minScore: number;
  hasDeadlines: boolean;
  hasPrereqs: boolean;
  hasEvents: boolean;
  hasRiskReward: boolean;
  changeNote: string;
}

export interface CommandRoundContent {
  config: CommandRoundConfig;
  missions: MissionTemplate[];
  event: EventCard | null;
  eventAfterTurns: number;
}
