import type { GameConfig } from '../types';
import VectorPlay, { type VectorAnswer } from '../games/VectorPlay';
import CargoPlay, { type CargoZoneId } from '../games/CargoPlay';
import CommandPlay, { type MissionId } from '../games/CommandPlay';

interface PlayScreenProps {
  isMobile: boolean;
  game: GameConfig;
  scoreDisplay: string;
  vectorSelected: VectorAnswer | null;
  onVectorAnswer: (answer: VectorAnswer) => void;
  cargoSelected: CargoZoneId | null;
  onCargoAnswer: (zone: CargoZoneId) => void;
  commandSelectedId: MissionId | null;
  commandExecuted: boolean;
  onCommandSelect: (id: MissionId) => void;
  onCommandExecute: () => void;
  onGoResult: () => void;
}

export default function PlayScreen({
  isMobile,
  game,
  scoreDisplay,
  vectorSelected,
  onVectorAnswer,
  cargoSelected,
  onCargoAnswer,
  commandSelectedId,
  commandExecuted,
  onCommandSelect,
  onCommandExecute,
  onGoResult,
}: PlayScreenProps) {
  const contentMaxWidth = isMobile ? '100%' : '640px';

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
        <div style={{ fontSize: 11.5, color: '#635f52', fontWeight: 600 }}>점수 {scoreDisplay}</div>
        <div style={{ fontSize: 11.5, color: '#635f52', fontWeight: 600 }}>00:38</div>
      </div>

      {game.id === 'vector' && (
        <VectorPlay selected={vectorSelected} onAnswer={onVectorAnswer} onGoResult={onGoResult} />
      )}
      {game.id === 'cargo' && (
        <CargoPlay selected={cargoSelected} onAnswer={onCargoAnswer} onGoResult={onGoResult} />
      )}
      {game.id === 'command' && (
        <CommandPlay
          selectedId={commandSelectedId}
          executed={commandExecuted}
          onSelect={onCommandSelect}
          onExecute={onCommandExecute}
          onGoResult={onGoResult}
        />
      )}
    </div>
  );
}
