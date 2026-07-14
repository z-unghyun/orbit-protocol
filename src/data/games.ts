import type { GameConfig, GameId } from '../types';

export const GAME_ORDER: GameId[] = ['vector', 'cargo', 'command'];

export const gameConfig: Record<GameId, GameConfig> = {
  vector: {
    id: 'vector',
    nameEn: 'VECTOR SHIFT',
    nameKo: '항로 전환실',
    accent: '#4a6fd1',
    total: 12,
    passed: 9,
    desc: '계속 바뀌는 항법 기준에 맞춰 항로를 빠르게 전환합니다. 이전 규칙을 억제하고 새 규칙에 즉시 반응하세요.',
    tags: ['인지 전환', '선택적 주의', '반응 조절'],
    ruleText: '색상 기준\n적색·황색 → 좌측 회피\n청색·녹색 → 우측 회피',
    gradient:
      'radial-gradient(circle at 30% 30%, #dff58a 0%, transparent 55%), radial-gradient(circle at 70% 35%, #7fc4e0 0%, transparent 55%), radial-gradient(circle at 50% 78%, #a3e0c0 0%, transparent 58%)',
  },
  cargo: {
    id: 'cargo',
    nameEn: 'CARGO CORE',
    nameKo: '화물 분류실',
    accent: '#7a4fc9',
    total: 10,
    passed: 7,
    desc: '행성 표본, 광물, 연료 셀을 규칙에 따라 올바른 보관 구역으로 분류합니다. 예외 규칙이 우선 적용됩니다.',
    tags: ['작업기억', '규칙 유지', '예외 처리'],
    ruleText: '청색 연료 셀 → 동력실\n위험 등급 3 이상 → 격리실 우선 적용',
    gradient:
      'radial-gradient(circle at 30% 30%, #f2c9dc 0%, transparent 55%), radial-gradient(circle at 70% 35%, #8891e8 0%, transparent 55%), radial-gradient(circle at 50% 78%, #f5e28a 0%, transparent 58%)',
  },
  command: {
    id: 'command',
    nameEn: 'COMMAND DECK',
    nameKo: '함교 작전실',
    accent: '#d9541f',
    total: 8,
    passed: 6,
    desc: '제한된 전력, 승무원, 부품 안에서 여러 임무의 우선순위를 정하고 실행하는 전략 게임입니다.',
    tags: ['계획', '우선순위 판단', '자원 관리'],
    ruleText: '가용 자원 안에서\n중요도 높은 임무부터 처리하세요',
    gradient:
      'radial-gradient(circle at 30% 30%, #ffb37a 0%, transparent 55%), radial-gradient(circle at 70% 35%, #ff8fb0 0%, transparent 55%), radial-gradient(circle at 50% 78%, #7fc4e8 0%, transparent 58%)',
  },
};

export const homeOrbGradient =
  'radial-gradient(circle at 28% 32%, #ffd3a0 0%, transparent 55%), radial-gradient(circle at 68% 28%, #a7d8e8 0%, transparent 55%), radial-gradient(circle at 55% 70%, #f2a5c4 0%, transparent 58%), radial-gradient(circle at 30% 75%, #cdeaa0 0%, transparent 55%)';
