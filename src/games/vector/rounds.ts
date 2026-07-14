import type { VectorRoundConfig } from './types';

/** handoff §8.11 라운드별 난이도 */
export const VECTOR_ROUNDS: VectorRoundConfig[] = [
  { roundNumber: 1, signalCount: 8, transitionCount: 0, criteriaPool: ['color'], reversal: false, hasUnannouncedTransition: false, changeNote: '기본 기준 학습' },
  { roundNumber: 2, signalCount: 10, transitionCount: 1, criteriaPool: ['color'], reversal: false, hasUnannouncedTransition: false, changeNote: '긴 예고 전환' },
  { roundNumber: 3, signalCount: 10, transitionCount: 1, criteriaPool: ['color', 'dangerTier'], reversal: false, hasUnannouncedTransition: false, changeNote: '색상 → 등급' },
  { roundNumber: 4, signalCount: 12, transitionCount: 2, criteriaPool: ['color', 'dangerTier'], reversal: false, hasUnannouncedTransition: false, changeNote: '전환 예고 단축' },
  { roundNumber: 5, signalCount: 12, transitionCount: 2, criteriaPool: ['color', 'dangerTier'], reversal: false, hasUnannouncedTransition: false, changeNote: '방해 신호 증가' },
  { roundNumber: 6, signalCount: 14, transitionCount: 3, criteriaPool: ['color', 'dangerTier', 'shape'], reversal: false, hasUnannouncedTransition: false, changeNote: '신호 전환' },
  { roundNumber: 7, signalCount: 14, transitionCount: 3, criteriaPool: ['color', 'dangerTier', 'shape'], reversal: true, hasUnannouncedTransition: false, changeNote: '방향 반전' },
  { roundNumber: 8, signalCount: 16, transitionCount: 3, criteriaPool: ['color', 'dangerTier', 'shape'], reversal: false, hasUnannouncedTransition: false, changeNote: '전환 시점 변동' },
  { roundNumber: 9, signalCount: 16, transitionCount: 4, criteriaPool: ['color', 'dangerTier', 'shape'], reversal: false, hasUnannouncedTransition: true, changeNote: '비예고 전환 1회' },
  { roundNumber: 10, signalCount: 18, transitionCount: 4, criteriaPool: ['color', 'dangerTier', 'shape'], reversal: false, hasUnannouncedTransition: false, changeNote: '세 기준 순환' },
  { roundNumber: 11, signalCount: 18, transitionCount: 5, criteriaPool: ['color', 'dangerTier', 'shape', 'approach'], reversal: true, hasUnannouncedTransition: false, changeNote: '반전과 기준 전환 혼합' },
  { roundNumber: 12, signalCount: 20, transitionCount: 5, criteriaPool: ['color', 'dangerTier', 'shape', 'approach'], reversal: true, hasUnannouncedTransition: true, changeNote: '종합 항로' },
];

/** handoff §8.10 충돌 신호 비율 (참고용 — 실제 생성은 전환 스케줄에서 자연 발생) */
export function conflictRatioForRound(roundNumber: number): number {
  if (roundNumber <= 4) return 0.1;
  if (roundNumber <= 8) return 0.3;
  if (roundNumber <= 11) return 0.5;
  return 0.6;
}
