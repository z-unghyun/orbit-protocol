export type VectorAnswer = 'left' | 'right';

interface VectorPlayProps {
  selected: VectorAnswer | null;
  onAnswer: (answer: VectorAnswer) => void;
  onGoResult: () => void;
}

const CORRECT: VectorAnswer = 'left';

export default function VectorPlay({ selected, onAnswer, onGoResult }: VectorPlayProps) {
  const answered = selected !== null;
  const isCorrect = selected === CORRECT;
  const leftPicked = selected === 'left';
  const rightPicked = selected === 'right';

  const optionStyle = (picked: boolean) => ({
    background: picked ? (isCorrect ? '#eef6e6' : '#fdeceb') : '#fff',
    color: picked ? (isCorrect ? '#3f7d3a' : '#c23b2e') : '#1a1a1a',
    border: `1px solid ${picked ? (isCorrect ? '#cfe8c4' : '#f3c9c4') : '#eeece5'}`,
  });

  return (
    <>
      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#b0ada0', marginBottom: 6 }}>현재 기준 · 색상</div>
        <div style={{ fontSize: 13, color: '#1a1a1a', fontWeight: 500 }}>
          적색·황색 → 좌측 회피 &nbsp;/&nbsp; 청색·녹색 → 우측 회피
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '26px 0 20px' }}>
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 40% 35%,#ff9d7a,#e2432f 65%,#b32a1c 100%)',
            boxShadow: '0 10px 30px rgba(210,60,30,.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ width: 44, height: 44, background: '#fff2ea', clipPath: 'polygon(50% 0%,100% 100%,0% 100%)' }} />
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, color: '#9a9789', marginBottom: 24 }}>
        접근 신호 · 적색 · 각진 형태 · 위험 등급 3
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div
          onClick={() => !answered && onAnswer('left')}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '18px 0',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            ...optionStyle(leftPicked),
          }}
        >
          ◀ 좌측 회피
        </div>
        <div
          onClick={() => !answered && onAnswer('right')}
          style={{
            flex: 1,
            textAlign: 'center',
            padding: '18px 0',
            borderRadius: 16,
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            ...optionStyle(rightPicked),
          }}
        >
          우측 회피 ▶
        </div>
      </div>

      {answered && (
        <>
          <div
            style={{
              background: isCorrect ? '#eef6e6' : '#fdeceb',
              borderRadius: 14,
              padding: '14px 16px',
              marginBottom: 14,
              animation: 'popIn .3s ease',
            }}
          >
            <div style={{ fontSize: 13.5, fontWeight: 700, color: isCorrect ? '#3f7d3a' : '#c23b2e', marginBottom: 2 }}>
              {isCorrect ? '정확한 회피입니다 · +100점' : '충돌이 발생했습니다'}
            </div>
            <div style={{ fontSize: 12, color: '#635f52' }}>
              {isCorrect
                ? '색상 기준에 맞는 방향으로 제때 회피했습니다.'
                : '적색 신호는 색상 기준에 따라 좌측 회피가 정답이었습니다.'}
            </div>
          </div>
          <div
            onClick={onGoResult}
            style={{
              background: '#1a1a1a',
              color: '#fff',
              textAlign: 'center',
              padding: 15,
              borderRadius: 100,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            라운드 결과 확인
          </div>
        </>
      )}
    </>
  );
}

export function isVectorCorrect(selected: VectorAnswer | null) {
  return selected === CORRECT;
}
