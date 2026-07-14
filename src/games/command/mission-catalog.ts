import type { MissionTemplate } from './types';

/** handoff §6.6 임무 예시 + §6.7 임무 유형을 반영한 카탈로그 */
export const MISSION_CATALOG: MissionTemplate[] = [
  { id: 'diagnostics', name: '신호 진단', cost: { power: 1, turns: 1 }, importance: 1 },
  { id: 'oxygen', name: '산소 정화 장치 복구', cost: { power: 2, crew: 1, turns: 2 }, importance: 3, mandatory: true },
  { id: 'comms', name: '외부 통신 복구', cost: { power: 2, parts: 1, turns: 1 }, importance: 2, prereqId: 'diagnostics' },
  { id: 'rescueSignal', name: '미확인 구조 신호 확인', cost: { power: 1, turns: 1 }, importance: 2, riskReward: true },
  { id: 'hullSurvey', name: '외벽 손상 조사', cost: { power: 1, turns: 1 }, importance: 1 },
  { id: 'shielding', name: '방사선 차폐 강화', cost: { parts: 2, turns: 1 }, importance: 2, prereqId: 'hullSurvey' },
  { id: 'lifeSupport', name: '생명유지 점검', cost: { power: 1, crew: 1, turns: 1 }, importance: 3, mandatory: true },
  { id: 'crewRest', name: '승무원 휴식 배정', cost: { crew: 1, turns: 1 }, importance: 1 },
  { id: 'cargoSecure', name: '화물 고정', cost: { parts: 1, turns: 1 }, importance: 1, deadline: true },
  { id: 'navFix', name: '항로 재계산', cost: { power: 1, crew: 1, turns: 2 }, importance: 2, deadline: true },
];

export function missionById(id: string): MissionTemplate {
  const found = MISSION_CATALOG.find((m) => m.id === id);
  if (!found) throw new Error(`unknown mission id: ${id}`);
  return found;
}
