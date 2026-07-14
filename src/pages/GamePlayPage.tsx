import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { gameConfig } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';
import { isGameId } from '../types';
import VectorPlay, { isVectorCorrect, type VectorAnswer } from '../games/VectorPlay';
import CargoPlay, { isCargoCorrect, type CargoZoneId } from '../games/CargoPlay';
import CommandPlay, { type MissionId } from '../games/CommandPlay';
import type { RoundResultState } from './RoundResultPage';

export default function GamePlayPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { gameId } = useParams();

  const [vectorSelected, setVectorSelected] = useState<VectorAnswer | null>(null);
  const [cargoSelected, setCargoSelected] = useState<CargoZoneId | null>(null);
  const [commandSelectedId, setCommandSelectedId] = useState<MissionId | null>(null);
  const [commandExecuted, setCommandExecuted] = useState(false);

  if (!isGameId(gameId)) return <Navigate to="/games" replace />;
  const game = gameConfig[gameId];
  const contentMaxWidth = isMobile ? '100%' : '640px';

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

  const goResult = () => {
    const state: RoundResultState = { vectorSelected, cargoSelected, commandExecuted };
    navigate(`/games/${gameId}/result`, { state });
  };

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
          라운드 <b>1</b> / {game.total}
        </div>
        <div style={{ fontSize: 11.5, color: '#635f52', fontWeight: 600 }}>점수 {score.toLocaleString()}</div>
        <div style={{ fontSize: 11.5, color: '#635f52', fontWeight: 600 }}>00:38</div>
      </div>

      {game.id === 'vector' && (
        <VectorPlay selected={vectorSelected} onAnswer={setVectorSelected} onGoResult={goResult} />
      )}
      {game.id === 'cargo' && (
        <CargoPlay selected={cargoSelected} onAnswer={setCargoSelected} onGoResult={goResult} />
      )}
      {game.id === 'command' && (
        <CommandPlay
          selectedId={commandSelectedId}
          executed={commandExecuted}
          onSelect={setCommandSelectedId}
          onExecute={() => setCommandExecuted(true)}
          onGoResult={goResult}
        />
      )}
    </div>
  );
}
