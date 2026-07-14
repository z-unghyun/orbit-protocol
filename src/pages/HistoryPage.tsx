import { gameConfig } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLocalSave } from '../hooks/useLocalSave';
import { recentSuccessRate } from '../lib/scoring';

export default function HistoryPage() {
  const isMobile = useIsMobile();
  const save = useLocalSave();
  const wideMaxWidth = isMobile ? '100%' : '760px';
  const recent = Math.round(recentSuccessRate(save));
  const entries = [...save.history].reverse();

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '24px 20px 40px',
        maxWidth: wideMaxWidth,
        margin: '0 auto',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>항해 기록</div>
      <div style={{ fontSize: 13, color: '#9a9789', marginBottom: 6 }}>최근 10라운드 성공률 {recent}%</div>
      <div style={{ fontSize: 11, color: '#c2bfb2', marginBottom: 22 }}>
        이 기록은 현재 기기에만 저장됩니다. 계정 기능이 추가되면 다른 기기와 자동 동기화됩니다.
      </div>

      {entries.length === 0 && (
        <div style={{ fontSize: 13, color: '#9a9789', textAlign: 'center', padding: '40px 0' }}>
          아직 완료한 라운드가 없습니다.
        </div>
      )}

      {entries.map((entry) => {
        const game = gameConfig[entry.gameId];
        return (
          <div
            key={entry.sessionId}
            style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>
                {game.nameKo} · 라운드 {entry.roundNumber}
              </div>
              <div style={{ fontSize: 11.5, color: '#9a9789' }}>
                {entry.successes} / {entry.attempts} 성공 · 점수 {entry.score.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: entry.passed ? '#3f7d3a' : '#c23b2e',
                background: entry.passed ? '#eef6e6' : '#fdeceb',
                borderRadius: 20,
                padding: '4px 10px',
              }}
            >
              {entry.passed ? '통과' : '미통과'}
            </div>
          </div>
        );
      })}
    </div>
  );
}
