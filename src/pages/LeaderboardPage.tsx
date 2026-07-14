import { useIsMobile } from '../hooks/useIsMobile';
import { useLocalSave } from '../hooks/useLocalSave';
import { estimatedRankingScore } from '../lib/scoring';

export default function LeaderboardPage() {
  const isMobile = useIsMobile();
  const save = useLocalSave();
  const wideMaxWidth = isMobile ? '100%' : '640px';
  const myScore = estimatedRankingScore(save).toFixed(1);

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '24px 20px 40px',
        maxWidth: wideMaxWidth,
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>전체 랭킹</div>
      <div style={{ fontSize: 13, color: '#9a9789', lineHeight: 1.6, marginBottom: 24 }}>
        랭킹은 계정 시스템과 서버 연동 이후 제공됩니다.
        <br />
        준비 중인 기능입니다.
      </div>

      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '18px 20px', display: 'inline-block' }}>
        <div style={{ fontSize: 10, color: '#9a9789', fontWeight: 600, marginBottom: 6 }}>내 예상 랭킹 점수</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a' }}>{myScore}점</div>
        <div style={{ fontSize: 10.5, color: '#c2bfb2', marginTop: 6 }}>전체 진척도 × 0.6 + 최근 성공률 × 0.4</div>
      </div>
    </div>
  );
}
