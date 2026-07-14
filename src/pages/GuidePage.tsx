import { GAME_ORDER, gameConfig } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';

export default function GuidePage() {
  const isMobile = useIsMobile();
  const wideMaxWidth = isMobile ? '100%' : '760px';

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '24px 20px 40px',
        maxWidth: wideMaxWidth,
        margin: '0 auto',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>게임 안내</div>
      <div style={{ fontSize: 13, color: '#9a9789', marginBottom: 22 }}>
        세 관제 구역은 독립적으로 진행됩니다. 원하는 순서로 자유롭게 플레이하세요.
      </div>

      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: 16, marginBottom: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', marginBottom: 8 }}>공통 진행 흐름</div>
        <div style={{ fontSize: 13, color: '#1a1a1a', lineHeight: 1.8 }}>
          게임 선택 → 게임 소개 → 라운드 시작 → 규칙 확인 → 입력 → 결과 판정 → 라운드 결과 → 자동 저장
        </div>
      </div>

      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: 16, marginBottom: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', marginBottom: 8 }}>실패해도 괜찮습니다</div>
        <div style={{ fontSize: 13, color: '#635f52', lineHeight: 1.7 }}>
          한 번의 실패로 게임이 끝나지 않습니다. 같은 라운드를 다시 시도하거나, 이전 단계로 돌아가거나, 다른 구역으로
          이동할 수 있습니다. 결과는 능력 부족이 아니라 그 라운드의 규칙과 조건에서 나온 것입니다.
        </div>
      </div>

      {GAME_ORDER.map((id) => {
        const game = gameConfig[id];
        return (
          <div key={id} style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: game.accent, marginBottom: 4 }}>{game.nameEn}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1a1a1a', marginBottom: 6 }}>
              {game.nameKo} · 전체 {game.total}라운드
            </div>
            <div style={{ fontSize: 13, color: '#635f52', lineHeight: 1.6, marginBottom: 10 }}>{game.desc}</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {game.tags.map((tag) => (
                <div key={tag} style={{ fontSize: 11, fontWeight: 600, color: '#635f52', background: '#f2f0e8', borderRadius: 20, padding: '5px 10px' }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
