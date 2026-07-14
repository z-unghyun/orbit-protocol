import type { CargoRoundConfig } from './types';

/** handoff §7.11 라운드별 난이도 */
export const CARGO_ROUNDS: CargoRoundConfig[] = [
  { roundNumber: 1, cargoCount: 8, ruleAlwaysVisible: true, dangerAttributeVisible: false, hasComboRule: false, hasExceptionRule: false, hasQuarantineAlert: false, hasMemoryRule: false, midRoundRuleSwap: false, ruleRecallCount: 2, perItemSeconds: 7, changeNote: '색상 기준, 규칙 항상 표시' },
  { roundNumber: 2, cargoCount: 10, ruleAlwaysVisible: true, dangerAttributeVisible: false, hasComboRule: true, hasExceptionRule: false, hasQuarantineAlert: false, hasMemoryRule: false, midRoundRuleSwap: false, ruleRecallCount: 2, perItemSeconds: 7, changeNote: '화물 종류 추가' },
  { roundNumber: 3, cargoCount: 10, ruleAlwaysVisible: false, dangerAttributeVisible: false, hasComboRule: true, hasExceptionRule: false, hasQuarantineAlert: false, hasMemoryRule: false, midRoundRuleSwap: false, ruleRecallCount: 2, perItemSeconds: 7, changeNote: '규칙창 접힘' },
  { roundNumber: 4, cargoCount: 12, ruleAlwaysVisible: false, dangerAttributeVisible: true, hasComboRule: true, hasExceptionRule: false, hasQuarantineAlert: false, hasMemoryRule: false, midRoundRuleSwap: false, ruleRecallCount: 2, perItemSeconds: 6.5, changeNote: '위험 등급 추가' },
  { roundNumber: 5, cargoCount: 12, ruleAlwaysVisible: false, dangerAttributeVisible: true, hasComboRule: true, hasExceptionRule: true, hasQuarantineAlert: false, hasMemoryRule: false, midRoundRuleSwap: false, ruleRecallCount: 2, perItemSeconds: 6.5, changeNote: '예외 규칙' },
  { roundNumber: 6, cargoCount: 14, ruleAlwaysVisible: false, dangerAttributeVisible: true, hasComboRule: true, hasExceptionRule: true, hasQuarantineAlert: false, hasMemoryRule: false, midRoundRuleSwap: false, ruleRecallCount: 2, perItemSeconds: 6, changeNote: '규칙 우선순위' },
  { roundNumber: 7, cargoCount: 14, ruleAlwaysVisible: false, dangerAttributeVisible: true, hasComboRule: true, hasExceptionRule: true, hasQuarantineAlert: false, hasMemoryRule: false, midRoundRuleSwap: false, ruleRecallCount: 1, perItemSeconds: 5, changeNote: '제한시간 감소' },
  { roundNumber: 8, cargoCount: 16, ruleAlwaysVisible: false, dangerAttributeVisible: true, hasComboRule: true, hasExceptionRule: true, hasQuarantineAlert: true, hasMemoryRule: false, midRoundRuleSwap: false, ruleRecallCount: 1, perItemSeconds: 5, changeNote: '격리 경보' },
  { roundNumber: 9, cargoCount: 16, ruleAlwaysVisible: false, dangerAttributeVisible: true, hasComboRule: true, hasExceptionRule: true, hasQuarantineAlert: true, hasMemoryRule: true, midRoundRuleSwap: false, ruleRecallCount: 1, perItemSeconds: 5, changeNote: '직전 화물 기억' },
  { roundNumber: 10, cargoCount: 18, ruleAlwaysVisible: false, dangerAttributeVisible: true, hasComboRule: true, hasExceptionRule: true, hasQuarantineAlert: true, hasMemoryRule: true, midRoundRuleSwap: true, ruleRecallCount: 1, perItemSeconds: 4.5, changeNote: '복합 규칙과 일부 교체' },
];
