import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import Orb from '../components/Orb';
import { gameConfig } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';
import { isGameId } from '../types';
import { isVectorCorrect, type VectorAnswer } from '../games/VectorPlay';
import { isCargoCorrect, type CargoZoneId } from '../games/CargoPlay';

export interface RoundResultState {
  vectorSelected: VectorAnswer | null;
  cargoSelected: CargoZoneId | null;
  commandExecuted: boolean;
}

export default function RoundResultPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const location = useLocation();
  const state = location.state as RoundResultState | null;

  if (!isGameId(gameId)) return <Navigate to="/games" replace />;
  if (!state) return <Navigate to={`/games/${gameId}`} replace />;

  const game = gameConfig[gameId];
  const contentMaxWidth = isMobile ? '100%' : '640px';

  const { vectorSelected, cargoSelected, commandExecuted } = state;
  const vectorAnswered = vectorSelected !== null;
  const vectorCorrect = isVectorCorrect(vectorSelected);
  const cargoAnswered = cargoSelected !== null;
  const cargoCorrect = isCargoCorrect(cargoSelected);

  const score =
    vectorAnswered && vectorCorrect
      ? 100
      : cargoAnswered && cargoCorrect
        ? 100
        : commandExecuted
          ? 640
          : 0;

  const successRateDisplay =
    (vectorAnswered && !vectorCorrect) || (cargoAnswered && !cargoCorrect) ? '84%' : '92%';

  const resultTitle =
    gameId === 'command'
      ? '임무 정산 완료'
      : vectorCorrect || cargoCorrect
        ? '라운드 통과'
        : '재도전 가능';

  const resultMessage =
    gameId === 'vector'
      ? vectorCorrect
        ? '규칙 전환 이후에도 반응이 안정적이었습니다.'
        : '규칙 전환 직후 반응이 늦어졌습니다. 같은 라운드를 다시 시도할 수 있습니다.'
      : gameId === 'cargo'
        ? cargoCorrect
          ? '예외 규칙을 정확히 적용했습니다.'
          : '예외 규칙에서 혼동이 있었습니다. 다시 시도해 보세요.'
        : '제한된 자원 안에서 우선순위 임무를 성공적으로 처리했습니다.';

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
        라운드 결과
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 18 }}>{resultTitle}</div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 20px' }}>
          <div style={{ fontSize: 10, color: '#9a9789', fontWeight: 600, marginBottom: 4 }}>획득 점수</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{score.toLocaleString()}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 20px' }}>
          <div style={{ fontSize: 10, color: '#9a9789', fontWeight: 600, marginBottom: 4 }}>성공률</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{successRateDisplay}</div>
        </div>
      </div>

      <div style={{ fontSize: 13, lineHeight: 1.6, color: '#635f52', marginBottom: 28, padding: '0 8px' }}>
        {resultMessage}
      </div>

      <div
        onClick={() => navigate(`/games/${gameId}/play`)}
        style={{
          background: '#1a1a1a',
          color: '#fff',
          textAlign: 'center',
          padding: 16,
          borderRadius: 100,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 12,
        }}
      >
        이 라운드 다시 도전
      </div>
      <div
        onClick={() => navigate('/games')}
        style={{
          background: '#fff',
          color: '#1a1a1a',
          border: '1px solid #e4e2d9',
          textAlign: 'center',
          padding: 16,
          borderRadius: 100,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        관제 구역 선택으로
      </div>
    </div>
  );
}
