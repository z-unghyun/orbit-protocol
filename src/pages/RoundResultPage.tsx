import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Orb from '../components/Orb';
import { gameConfig } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';
import { isGameId } from '../types';
import type { RoundResult } from '../games/shared/round-types';

export default function RoundResultPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const location = useLocation();
  const result = (location.state as { result?: RoundResult } | null)?.result;

  if (!isGameId(gameId)) return <Navigate to="/games" replace />;
  if (!result) return <Navigate to={`/games/${gameId}`} replace />;

  const game = gameConfig[gameId];
  const contentMaxWidth = isMobile ? '100%' : '640px';
  const isFinalRound = result.roundNumber >= game.total;

  const resultTitle =
    gameId === 'command'
      ? '임무 정산 완료'
      : result.passed
        ? isFinalRound
          ? '항해 완료'
          : '라운드 통과'
        : '재도전 가능';

  const successRateDisplay = result.attempts === 0 ? '0%' : `${Math.round((result.successes / result.attempts) * 100)}%`;
  const showNext = result.passed && !isFinalRound;

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '32px 20px 40px',
        textAlign: 'center',
        maxWidth: contentMaxWidth,
        margin: '0 auto',
      }}
    >
      <div style={{ margin: '0 auto 20px', width: 120 }}>
        <Orb gradient={game.gradient} size={120} big />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', letterSpacing: '.05em', marginBottom: 6 }}>
        라운드 {result.roundNumber} 결과
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 18 }}>{resultTitle}</div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 20px' }}>
          <div style={{ fontSize: 10, color: '#9a9789', fontWeight: 600, marginBottom: 4 }}>획득 점수</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{result.score.toLocaleString()}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 20px' }}>
          <div style={{ fontSize: 10, color: '#9a9789', fontWeight: 600, marginBottom: 4 }}>성공률</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{successRateDisplay}</div>
        </div>
      </div>

      <div style={{ fontSize: 13, lineHeight: 1.6, color: '#635f52', marginBottom: 28, padding: '0 8px' }}>
        {result.message}
      </div>

      {showNext && (
        <button
          type="button"
          onClick={() => navigate(`/games/${gameId}/play`)}
          style={{ background: game.accent, color: '#fff', textAlign: 'center', padding: 16, borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 12, width: '100%', border: 'none', fontFamily: 'inherit' }}
        >
          다음 라운드로
        </button>
      )}
      {!result.passed && (
        <button
          type="button"
          onClick={() => navigate(`/games/${gameId}/play`)}
          style={{ background: '#1a1a1a', color: '#fff', textAlign: 'center', padding: 16, borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginBottom: 12, width: '100%', border: 'none', fontFamily: 'inherit' }}
        >
          이 라운드 다시 도전
        </button>
      )}
      {result.passed && isFinalRound && (
        <div style={{ fontSize: 12, color: '#9a9789', marginBottom: 12 }}>이 구역의 모든 라운드를 통과했습니다.</div>
      )}
      <button
        type="button"
        onClick={() => navigate('/games')}
        style={{ background: '#fff', color: '#1a1a1a', border: '1px solid #e4e2d9', textAlign: 'center', padding: 16, borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}
      >
        관제 구역 선택으로
      </button>
    </div>
  );
}
