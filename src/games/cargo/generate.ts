import { mulberry32, pick, type Rng } from '../../lib/rng';
import type { CargoColor, CargoItem, CargoRoundConfig, CargoRoundContent, CargoRoundItem, CargoZoneId } from './types';

const COLORS: CargoColor[] = ['blue', 'red', 'yellow', 'green', 'white'];
const TYPES: CargoItem['cargoType'][] = ['fuel', 'sample', 'mineral', 'equipment'];

function randomItem(rng: Rng, config: CargoRoundConfig): CargoItem {
  return {
    colorCode: pick(rng, COLORS),
    cargoType: pick(rng, TYPES),
    dangerTier: config.dangerAttributeVisible ? 1 + Math.floor(rng() * 5) : 1 + Math.floor(rng() * 2),
    hasBioSignal: rng() < 0.3,
    frozenMark: rng() < 0.25,
    specialIcon: config.hasQuarantineAlert && rng() < 0.15,
  };
}

/** handoff §7.9 우선순위: 특수(격리경보/직전기억) > 예외(위험등급) > 조합 > 일반 */
function resolveZone(item: CargoItem, previous: CargoItem | null, config: CargoRoundConfig, afterMidpoint: boolean): CargoZoneId {
  if (config.hasMemoryRule && previous && item.colorCode === previous.colorCode) return 'holding';
  if (config.hasQuarantineAlert && item.specialIcon) return 'quarantine';
  if (config.hasExceptionRule && item.dangerTier >= 4) return 'quarantine';

  if (config.hasComboRule) {
    if (item.hasBioSignal && item.frozenMark) return 'cold';
    if (item.hasBioSignal) return 'lab';
  }
  if (item.colorCode === 'blue' && item.cargoType === 'fuel') return 'power';

  if (config.midRoundRuleSwap && afterMidpoint && item.colorCode === 'white') return 'holding';
  if (item.colorCode === 'white') return 'disposal';

  return 'general';
}

export function generateCargoRound(config: CargoRoundConfig, seed: number): CargoRoundContent {
  const rng = mulberry32(seed);
  const items: CargoRoundItem[] = [];
  let previous: CargoItem | null = null;

  for (let i = 0; i < config.cargoCount; i++) {
    const item = randomItem(rng, config);
    const afterMidpoint = i >= Math.floor(config.cargoCount / 2);
    const correctZone = resolveZone(item, previous, config, afterMidpoint);
    items.push({ item, correctZone, isHazard: item.dangerTier >= 4 });
    previous = item;
  }

  return { config, items };
}
