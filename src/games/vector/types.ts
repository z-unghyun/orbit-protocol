export type VectorCriterionType = 'color' | 'dangerTier' | 'shape' | 'approach';
export type Direction = 'left' | 'right';
export type SignalColor = 'red' | 'yellow' | 'blue' | 'green';
export type SignalShape = 'angular' | 'round';

export interface VectorSignal {
  color: SignalColor;
  dangerTier: number; // 1-6
  shape: SignalShape;
  approachDirection: Direction; // side the signal is approaching from
}

export interface VectorRoundConfig {
  roundNumber: number;
  signalCount: number;
  transitionCount: number;
  criteriaPool: VectorCriterionType[];
  reversal: boolean;
  hasUnannouncedTransition: boolean;
  changeNote: string;
}

export interface VectorRoundItem {
  signal: VectorSignal;
  criterion: VectorCriterionType;
  correctDirection: Direction;
  isPostTransition: boolean;
  isConflict: boolean;
  isSegmentStart: boolean;
  announced: boolean;
}

export interface VectorRoundContent {
  config: VectorRoundConfig;
  items: VectorRoundItem[];
}
