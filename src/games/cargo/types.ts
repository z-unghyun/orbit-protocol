export type CargoZoneId = 'general' | 'cold' | 'quarantine' | 'lab' | 'power' | 'disposal' | 'holding';
export type CargoColor = 'blue' | 'red' | 'yellow' | 'green' | 'white';
export type CargoType = 'fuel' | 'sample' | 'mineral' | 'equipment';

export interface CargoItem {
  colorCode: CargoColor;
  cargoType: CargoType;
  dangerTier: number; // 1-5
  hasBioSignal: boolean;
  frozenMark: boolean;
  specialIcon: boolean;
}

export interface CargoRoundConfig {
  roundNumber: number;
  cargoCount: number;
  ruleAlwaysVisible: boolean;
  dangerAttributeVisible: boolean;
  hasComboRule: boolean;
  hasExceptionRule: boolean;
  hasQuarantineAlert: boolean;
  hasMemoryRule: boolean;
  midRoundRuleSwap: boolean;
  ruleRecallCount: number;
  perItemSeconds: number;
  changeNote: string;
}

export interface CargoRoundItem {
  item: CargoItem;
  correctZone: CargoZoneId;
  isHazard: boolean; // dangerTier >= 4, "치명적 오분류" 대상
}

export interface CargoRoundContent {
  config: CargoRoundConfig;
  items: CargoRoundItem[];
}

export const CARGO_ZONES: { id: CargoZoneId; label: string }[] = [
  { id: 'general', label: '일반 화물칸' },
  { id: 'cold', label: '냉동 보관실' },
  { id: 'quarantine', label: '위험물 격리실' },
  { id: 'lab', label: '연구실' },
  { id: 'power', label: '동력실' },
  { id: 'disposal', label: '우주 폐기 구역' },
  { id: 'holding', label: '임시 보류 구역' },
];
