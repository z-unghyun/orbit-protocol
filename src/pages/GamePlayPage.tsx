import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { gameConfig } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLocalSave } from '../hooks/useLocalSave';
import { recordRoundResult, startRound } from '../lib/local-save';
import { nextRoundForGame } from '../lib/progression';
import { isGameId } from '../types';
import { VECTOR_ROUNDS } from '../games/vector/rounds';
import VectorRound from '../games/vector/VectorRound';
import { CARGO_ROUNDS } from '../games/cargo/rounds';
import CargoRound from '../games/cargo/CargoRound';
import { COMMAND_ROUNDS } from '../games/command/rounds';
import CommandRound from '../games/command/CommandRound';
import type { RoundResult } from '../games/shared/round-types';

export default function GamePlayPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { gameId } = useParams();
  const save = useLocalSave();
  const [paused, setPaused] = useState(false);
  const [liveScore, setLiveScore] = useState(0);
  // generated once per mount, purely — never touches local-save during render
  const [freshSeed] = useState(() => Math.floor(Math.random() * 2 ** 31));

  const validGameId = isGameId(gameId) ? gameId : null;
  const roundNumber = validGameId ? nextRoundForGame(validGameId, save) : 1;

  const resumedInProgress =
    validGameId && save.inProgress && save.inProgress.gameId === validGameId && save.inProgress.roundNumber === roundNumber
      ? save.inProgress
      : null;
  const seed = resumedInProgress ? resumedInProgress.roundSeed : freshSeed;

  useEffect(() => {
    if (!validGameId || resumedInProgress) return;
    startRound({ gameId: validGameId, roundNumber, roundSeed: freshSeed, itemIndex: 0, score: 0, successCount: 0, attemptCount: 0, remainingTimeMs: 0, startedAt: Date.now() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validGameId, roundNumber]);

  if (!validGameId) return <Navigate to="/games" replace />;
  const game = gameConfig[validGameId];
  const contentMaxWidth = isMobile ? '100%' : '640px';

  function handleComplete(result: RoundResult) {
    recordRoundResult(result);
    navigate(`/games/${validGameId}/result`, { state: { result } });
  }

  const commonProps = { roundNumber, seed, paused, onScoreChange: setLiveScore, onComplete: handleComplete };

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '18px 20px 40px',
        maxWidth: contentMaxWidth,
        margin: '0 auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f7f6f1',
          borderRadius: 14,
          padding: '10px 14px',
          marginBottom: 18,
        }}
      >
        <div style={{ fontSize: 11.5, color: '#635f52', fontWeight: 600 }}>
          라운드 <b>{roundNumber}</b> / {game.total}
        </div>
        <div style={{ fontSize: 11.5, color: '#635f52', fontWeight: 600 }}>점수 {liveScore.toLocaleString()}</div>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          style={{ fontSize: 11.5, color: '#635f52', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none', fontFamily: 'inherit' }}
        >
          {paused ? '재개' : '일시정지'}
        </button>
      </div>

      {validGameId === 'vector' && <VectorRound config={VECTOR_ROUNDS[roundNumber - 1]} {...commonProps} />}
      {validGameId === 'cargo' && <CargoRound config={CARGO_ROUNDS[roundNumber - 1]} {...commonProps} />}
      {validGameId === 'command' && <CommandRound config={COMMAND_ROUNDS[roundNumber - 1]} {...commonProps} />}
    </div>
  );
}
