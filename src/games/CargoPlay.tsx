export type CargoZoneId = 'general' | 'cold' | 'quarantine' | 'lab' | 'power';

const ZONES: { id: CargoZoneId; label: string }[] = [
  { id: 'general', label: '일반 화물칸' },
  { id: 'cold', label: '냉동 보관실' },
  { id: 'quarantine', label: '위험물 격리실' },
  { id: 'lab', label: '연구실' },
  { id: 'power', label: '동력실' },
];

const CORRECT: CargoZoneId = 'quarantine';

interface CargoPlayProps {
  selected: CargoZoneId | null;
  onAnswer: (zone: CargoZoneId) => void;
  onGoResult: () => void;
}

export default function CargoPlay({ selected, onAnswer, onGoResult }: CargoPlayProps) {
  const answered = selected !== null;
  const isCorrect = selected === CORRECT;

  return (
    <>
      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px', marginBottom: 18 }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, color: '#b0ada0', marginBottom: 6 }}>분류 규칙</div>
        <div style={{ fontSize: 12.5, color: '#1a1a1a', fontWeight: 500, lineHeight: 1.7 }}>
          청색 연료 셀은 동력실로 보낸다.
          <br />
          위험 등급 3 이상은 다른 규칙보다 먼저 격리실로 보낸다.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '22px 0 20px' }}>
        <div style={{ width: 150, background: '#fff', border: '1px solid #eeece5', borderRadius: 18, padding: '18px 14px', textAlign: 'center' }}>
          <div style={{ width: 56, height: 56, margin: '0 auto 12px', borderRadius: 14, background: 'linear-gradient(135deg,#8fb8e8,#5b7fd6)' }} />
          <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>청색 연료 셀</div>
          <div
            style={{
              fontSize: 10.5,
              color: '#c23b2e',
              fontWeight: 700,
              background: '#fdeceb',
              borderRadius: 20,
              padding: '4px 8px',
              display: 'inline-block',
            }}
          >
            위험 등급 4
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
        {ZONES.map((zone) => {
          let bg = '#fff';
          let color = '#1a1a1a';
          let border = '#eeece5';
          if (answered) {
            if (zone.id === CORRECT) {
              bg = '#eef6e6';
              color = '#3f7d3a';
              border = '#cfe8c4';
            } else if (zone.id === selected) {
              bg = '#fdeceb';
              color = '#c23b2e';
              border = '#f3c9c4';
            }
          }
          return (
            <div
              key={zone.id}
              onClick={() => !answered && onAnswer(zone.id)}
              style={{
                textAlign: 'center',
                padding: '14px 6px',
                borderRadius: 14,
                fontSize: 12.5,
                fontWeight: 700,
                cursor: 'pointer',
                background: bg,
                color,
                border: `1px solid ${border}`,
              }}
            >
              {zone.label}
            </div>
          );
        })}
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
              {isCorrect ? '정확한 분류입니다 · +100점' : '분류 오류가 발생했습니다'}
            </div>
            <div style={{ fontSize: 12, color: '#635f52' }}>
              {isCorrect
                ? '위험 등급 4는 색상 규칙보다 격리 규칙이 우선 적용됩니다.'
                : '위험 등급 3 이상은 다른 규칙보다 먼저 격리실로 보내야 합니다.'}
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

export function isCargoCorrect(selected: CargoZoneId | null) {
  return selected === CORRECT;
}
