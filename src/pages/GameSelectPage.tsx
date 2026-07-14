import { useNavigate } from 'react-router-dom';
import Orb from '../components/Orb';
import { GAME_ORDER, gameConfig } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';

export default function GameSelectPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const gridCols = isMobile ? '1fr' : 'repeat(3, 1fr)';
  const wideMaxWidth = isMobile ? '100%' : '1040px';

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '24px 20px 40px',
        maxWidth: wideMaxWidth,
        margin: '0 auto',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>관제 구역 선택</div>
      <div style={{ fontSize: 13, color: '#9a9789', marginBottom: 22 }}>
        담당할 구역을 선택하고 임무를 시작하세요
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 16 }}>
        {GAME_ORDER.map((id) => {
          const game = gameConfig[id];
          return (
            <div
              key={id}
              onClick={() => navigate(`/games/${id}`)}
              style={{
                background: '#fff',
                border: '1px solid #eeece5',
                borderRadius: 20,
                padding: 16,
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                marginBottom: 14,
                cursor: 'pointer',
              }}
            >
              <div style={{ flex: 'none' }}>
                <Orb gradient={game.gradient} size={64} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', color: '#b0ada0', marginBottom: 2 }}>
                  {game.nameEn}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{game.nameKo}</div>
                <div style={{ fontSize: 11.5, color: '#9a9789' }}>
                  {game.passed} / {game.total} 라운드 통과
                </div>
              </div>
              <div style={{ fontSize: 18, color: '#c9c6b9' }}>›</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
