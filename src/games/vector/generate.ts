import { mulberry32, pick, type Rng } from '../../lib/rng';
import type {
  Direction,
  SignalColor,
  SignalShape,
  VectorCriterionType,
  VectorRoundConfig,
  VectorRoundContent,
  VectorRoundItem,
  VectorSignal,
} from './types';

const COLORS: SignalColor[] = ['red', 'yellow', 'blue', 'green'];
const SHAPES: SignalShape[] = ['angular', 'round'];
const DIRECTIONS: Direction[] = ['left', 'right'];

function resolveDirection(criterion: VectorCriterionType, signal: VectorSignal): Direction {
  switch (criterion) {
    case 'color':
      return signal.color === 'red' || signal.color === 'yellow' ? 'left' : 'right';
    case 'dangerTier':
      return signal.dangerTier % 2 === 1 ? 'left' : 'right';
    case 'shape':
      return signal.shape === 'angular' ? 'left' : 'right';
    case 'approach':
      return signal.approachDirection === 'left' ? 'right' : 'left';
  }
}

function flip(direction: Direction): Direction {
  return direction === 'left' ? 'right' : 'left';
}

function randomSignal(rng: Rng): VectorSignal {
  return {
    color: pick(rng, COLORS),
    dangerTier: 1 + Math.floor(rng() * 6),
    shape: pick(rng, SHAPES),
    approachDirection: pick(rng, DIRECTIONS),
  };
}

interface Segment {
  criterion: VectorCriterionType;
  length: number;
}

function buildSegments(config: VectorRoundConfig, rng: Rng): Segment[] {
  const segmentCount = config.transitionCount + 1;
  const base = Math.floor(config.signalCount / segmentCount);
  const remainder = config.signalCount - base * segmentCount;
  const lengths = Array.from({ length: segmentCount }, (_, i) => Math.max(1, base + (i < remainder ? 1 : 0)));

  const criteria: VectorCriterionType[] = [];
  let prev: VectorCriterionType | null = null;
  for (let i = 0; i < segmentCount; i++) {
    const pool: VectorCriterionType[] =
      prev && config.criteriaPool.length > 1 ? config.criteriaPool.filter((c) => c !== prev) : config.criteriaPool;
    const next: VectorCriterionType = pick(rng, pool);
    criteria.push(next);
    prev = next;
  }

  return lengths.map((length, i) => ({ criterion: criteria[i], length }));
}

export function generateVectorRound(config: VectorRoundConfig, seed: number): VectorRoundContent {
  const rng = mulberry32(seed);
  const segments = buildSegments(config, rng);

  const unannouncedSegmentIndex =
    config.hasUnannouncedTransition && segments.length > 1 ? 1 + Math.floor(rng() * (segments.length - 1)) : -1;

  const items: VectorRoundItem[] = [];
  segments.forEach((segment, segIndex) => {
    const prevCriterion = segIndex > 0 ? segments[segIndex - 1].criterion : null;
    for (let i = 0; i < segment.length; i++) {
      const signal = randomSignal(rng);
      let correctDirection = resolveDirection(segment.criterion, signal);
      if (config.reversal) correctDirection = flip(correctDirection);

      const isConflict =
        prevCriterion !== null && resolveDirection(prevCriterion, signal) !== resolveDirection(segment.criterion, signal);
      const isSegmentStart = i === 0 && segIndex > 0;
      const isPostTransition = segIndex > 0 && i < 2;
      const announced = !(segIndex === unannouncedSegmentIndex && i === 0);

      items.push({ signal, criterion: segment.criterion, correctDirection, isPostTransition, isConflict, isSegmentStart, announced });
    }
  });

  return { config, items };
}
