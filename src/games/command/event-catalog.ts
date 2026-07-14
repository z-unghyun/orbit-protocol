import type { EventCard } from './types';

/** handoff §6.9 사건 카드 유형 */
export const POSITIVE_EVENTS: EventCard[] = [
  { id: 'powerCell', kind: 'positive', text: '비상 전력 셀을 발견했습니다.', effect: { power: 2 } },
  { id: 'apRestore', kind: 'positive', text: '행동 포인트가 회복되었습니다.', effect: { turns: 1 } },
];

export const NEGATIVE_EVENTS: EventCard[] = [
  { id: 'solarWind', kind: 'negative', text: '태양풍이 통신을 방해합니다.', effect: { power: -1 } },
  { id: 'overheat', kind: 'negative', text: '기관실이 과열되었습니다.', effect: { hull: -1 } },
  { id: 'crewInjury', kind: 'negative', text: '승무원이 부상을 입었습니다.', effect: { crew: -1 } },
];

export const CHOICE_EVENTS: EventCard[] = [
  {
    id: 'distressCall',
    kind: 'choice',
    text: '구조 신호가 수신되었습니다.',
    optionA: { label: 'A. 구조를 시도한다', effect: { power: -2 }, note: '성공 시 항해 평판 상승', bonusScore: 150 },
    optionB: { label: 'B. 기존 임무를 유지한다', effect: {}, note: '선체 안정도 유지 / 구조 임무 포기' },
  },
];
