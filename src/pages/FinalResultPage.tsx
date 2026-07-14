import { useNavigate } from 'react-router-dom';
import { GAME_ORDER, gameConfig } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLocalSave } from '../hooks/useLocalSave';
import { gameProgressPercent, overallProgressPercent, overallSuccessRate, recentSuccessRate } from '../lib/scoring';

export default function FinalResultPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const save = useLocalSave();
  const wideMaxWidth = isMobile ? '100%' : '760px';

  const overall = Math.round(overallProgressPercent(save));
  const overallSuccess = Math.round(overallSuccessRate(save));
  const recentSuccess = Math.round(recentSuccessRate(save));

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '28px 20px 40px',
        maxWidth: wideMaxWidth,
        margin: '0 auto',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', letterSpacing: '.05em', marginBottom: 6 }}>
        전체 항해 요약
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 22 }}>탐사선 항해 기록</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 28 }}>
        <div style={{ background: '#1a1a1a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: '#cfcdc3', fontWeight: 600, marginBottom: 6 }}>전체 진행률</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{overall}%</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: '#9a9789', fontWeight: 600, marginBottom: 6 }}>전체 성공률</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{overallSuccess}%</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: '#9a9789', fontWeight: 600, marginBottom: 6 }}>최근 성공률</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>{recentSuccess}%</div>
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', marginBottom: 10 }}>구역별 진행률</div>
      {GAME_ORDER.map((id) => {
        const game = gameConfig[id];
        const percent = Math.round(gameProgressPercent(id, save));
        return (
          <div key={id} style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>{game.nameKo}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#9a9789' }}>
                {save.progress[id].highestRoundPassed} / {game.total}
              </div>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: '#f2f0e8', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${percent}%`, background: game.accent, borderRadius: 4 }} />
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => navigate('/games')}
        style={{ background: '#1a1a1a', color: '#fff', textAlign: 'center', padding: 16, borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 18, width: '100%', border: 'none', fontFamily: 'inherit' }}
      >
        관제 구역 선택으로
      </button>
    </div>
  );
}
