import { Navigate, useNavigate, useParams } from 'react-router-dom';
import Orb from '../components/Orb';
import { gameConfig } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLocalSave } from '../hooks/useLocalSave';
import { nextRoundForGame } from '../lib/progression';
import { isGameId } from '../types';
import { VECTOR_ROUNDS } from '../games/vector/rounds';
import { introRuleText as vectorRuleText } from '../games/vector/logic';
import { CARGO_ROUNDS } from '../games/cargo/rounds';
import { describeCargoRules } from '../games/cargo/logic';
import { COMMAND_ROUNDS } from '../games/command/rounds';

export default function GameIntroPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const save = useLocalSave();

  if (!isGameId(gameId)) return <Navigate to="/games" replace />;
  const game = gameConfig[gameId];
  const contentMaxWidth = isMobile ? '100%' : '640px';
  const roundNumber = nextRoundForGame(gameId, save);

  const ruleText =
    gameId === 'vector'
      ? vectorRuleText(VECTOR_ROUNDS[roundNumber - 1])
      : gameId === 'cargo'
        ? describeCargoRules(CARGO_ROUNDS[roundNumber - 1])
        : `가용 자원 안에서 중요도 높은 임무부터 처리하세요\n최소 목표 점수 ${COMMAND_ROUNDS[roundNumber - 1].minScore.toLocaleString()}점`;

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '24px 20px 40px',
        maxWidth: contentMaxWidth,
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 18px' }}>
        <Orb gradient={game.gradient} size={150} big />
      </div>
      <div style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, letterSpacing: '.08em', color: game.accent, marginBottom: 4 }}>
        {game.nameEn}
      </div>
      <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>
        {game.nameKo}
      </div>
      <div style={{ textAlign: 'center', fontSize: 11.5, color: '#9a9789', marginBottom: 14 }}>
        라운드 {roundNumber} / {game.total}
      </div>
      <div style={{ textAlign: 'center', fontSize: 13.5, lineHeight: 1.6, color: '#635f52', marginBottom: 22, padding: '0 6px' }}>
        {game.desc}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 22 }}>
        {game.tags.map((tag) => (
          <div
            key={tag}
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: '#635f52',
              background: '#f2f0e8',
              borderRadius: 20,
              padding: '6px 12px',
            }}
          >
            {tag}
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: 16, marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', letterSpacing: '.05em', marginBottom: 8 }}>
          이번 라운드 기준
        </div>
        <div style={{ fontSize: 13.5, lineHeight: 1.7, color: '#1a1a1a', fontWeight: 500, whiteSpace: 'pre-line' }}>
          {ruleText}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate(`/games/${gameId}/play`)}
        style={{
          background: game.accent,
          color: '#fff',
          textAlign: 'center',
          padding: 16,
          borderRadius: 100,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%',
          border: 'none',
          fontFamily: 'inherit',
        }}
      >
        라운드 시작
      </button>
    </div>
  );
}
