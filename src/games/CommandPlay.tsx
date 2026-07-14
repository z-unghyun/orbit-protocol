export type MissionId = 'oxygen' | 'comms' | 'signal';

interface MissionDef {
  id: MissionId;
  name: string;
  cost: string;
  importance: string;
  badgeColor: string;
  badgeBg: string;
}

const MISSIONS: MissionDef[] = [
  { id: 'oxygen', name: '산소 정화 장치 복구', cost: '전력 2 · 승무원 1 · 2턴 소요', importance: '중요도 높음', badgeColor: '#c23b2e', badgeBg: '#fdeceb' },
  { id: 'comms', name: '외부 통신 복구', cost: '전력 2 · 수리 부품 1 · 1턴 소요', importance: '중요도 보통', badgeColor: '#a4791f', badgeBg: '#f7f0dd' },
  { id: 'signal', name: '미확인 구조 신호 확인', cost: '전력 1 · 1턴 소요', importance: '위험·보상', badgeColor: '#5b3fae', badgeBg: '#efeaf9' },
];

interface CommandPlayProps {
  selectedId: MissionId | null;
  executed: boolean;
  onSelect: (id: MissionId) => void;
  onExecute: () => void;
  onGoResult: () => void;
}

export default function CommandPlay({ selectedId, executed, onSelect, onExecute, onGoResult }: CommandPlayProps) {
  const resources = {
    power: executed ? 2 : 4,
    crew: executed ? 1 : 2,
    time: executed ? 1 : 3,
    parts: 2,
  };

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 18 }}>
        <ResourceCard label="전력" value={resources.power} />
        <ResourceCard label="승무원" value={resources.crew} />
        <ResourceCard label="시간" value={resources.time} />
        <ResourceCard label="부품" value={resources.parts} />
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', marginBottom: 10 }}>임무를 선택하세요</div>

      {MISSIONS.map((m) => (
        <div
          key={m.id}
          onClick={() => !executed && onSelect(m.id)}
          style={{
            background: selectedId === m.id ? '#f7f6f1' : '#fff',
            border: `1px solid ${selectedId === m.id ? '#1a1a1a' : '#eeece5'}`,
            borderRadius: 16,
            padding: '14px 16px',
            marginBottom: 10,
            cursor: 'pointer',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1a1a1a' }}>{m.name}</div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: m.badgeColor,
                background: m.badgeBg,
                borderRadius: 20,
                padding: '3px 8px',
              }}
            >
              {m.importance}
            </div>
          </div>
          <div style={{ fontSize: 11.5, color: '#9a9789' }}>{m.cost}</div>
        </div>
      ))}

      {selectedId && !executed && (
        <div
          onClick={onExecute}
          style={{
            background: '#1a1a1a',
            color: '#fff',
            textAlign: 'center',
            padding: 16,
            borderRadius: 100,
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: 8,
            marginBottom: 14,
          }}
        >
          임무 실행
        </div>
      )}

      {executed && (
        <>
          <div style={{ background: '#eef6e6', borderRadius: 14, padding: '14px 16px', marginBottom: 14, animation: 'popIn .3s ease' }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: '#3f7d3a', marginBottom: 2 }}>임무 성공</div>
            <div style={{ fontSize: 12, color: '#635f52' }}>
              산소 정화 장치가 복구되어 생명 유지 장치 경보가 해제되었습니다.
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

function ResourceCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 12, padding: '10px 6px', textAlign: 'center' }}>
      <div style={{ fontSize: 9.5, color: '#9a9789', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a' }}>{value}</div>
    </div>
  );
}
