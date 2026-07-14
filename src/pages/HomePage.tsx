import { useNavigate } from 'react-router-dom';
import Orb from '../components/Orb';
import { homeOrbGradient } from '../data/games';
import { useIsMobile } from '../hooks/useIsMobile';

export default function HomePage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const gridCols = isMobile ? '1fr 1fr' : 'repeat(4, 1fr)';
  const wideMaxWidth = isMobile ? '100%' : '1040px';

  return (
    <div
      style={{
        animation: 'screenIn .5s cubic-bezier(.16,1,.3,1)',
        padding: '28px 20px 40px',
        maxWidth: wideMaxWidth,
        margin: '0 auto',
      }}
    >
      <div style={{ fontSize: 12, color: '#9a9789', fontWeight: 500, marginBottom: 4 }}>
        관제 요원, 복귀를 환영합니다
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', lineHeight: 1.25, marginBottom: 28 }}>
        탐사선 상태를
        <br />
        확인하세요
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 20px' }}>
        <Orb gradient={homeOrbGradient} size={220} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: gridCols, gap: 10, marginBottom: 28 }}>
        <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: '#9a9789', fontWeight: 600, marginBottom: 6 }}>함교 안정도</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>72%</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: '#9a9789', fontWeight: 600, marginBottom: 6 }}>화물 안전도</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>65%</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: '#9a9789', fontWeight: 600, marginBottom: 6 }}>항로 정확도</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a' }}>58%</div>
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid #1a1a1a', borderRadius: 16, padding: '14px 16px' }}>
          <div style={{ fontSize: 10, color: '#cfcdc3', fontWeight: 600, marginBottom: 6 }}>전체 항해 진행률</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>65%</div>
        </div>
      </div>

      <div
        onClick={() => navigate('/games')}
        style={{
          background: '#1a1a1a',
          color: '#fff',
          textAlign: 'center',
          padding: 16,
          borderRadius: 100,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          marginBottom: 16,
        }}
      >
        관제 구역 선택하기
      </div>

      <div style={{ fontSize: 11, lineHeight: 1.6, color: '#b0ada0', textAlign: 'center', padding: '0 8px' }}>
        ORBIT PROTOCOL은 주의집중, 작업기억, 계획, 인지 전환 능력을 게임 형태로 연습하는 일반 웰니스·교육
        콘텐츠입니다.
        <br />
        의료행위, 진단 또는 치료를 제공하지 않습니다.
      </div>
    </div>
  );
}
