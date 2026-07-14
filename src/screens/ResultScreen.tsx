import Orb from '../components/Orb';
import type { GameConfig } from '../types';

interface ResultScreenProps {
  isMobile: boolean;
  game: GameConfig;
  resultTitle: string;
  scoreDisplay: string;
  successRateDisplay: string;
  resultMessage: string;
  onRetry: () => void;
  onGoSelect: () => void;
}

export default function ResultScreen({
  isMobile,
  game,
  resultTitle,
  scoreDisplay,
  successRateDisplay,
  resultMessage,
  onRetry,
  onGoSelect,
}: ResultScreenProps) {
  const contentMaxWidth = isMobile ? '100%' : '640px';

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
          <div style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a' }}>{scoreDisplay}</div>
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
        onClick={onRetry}
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
        onClick={onGoSelect}
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
