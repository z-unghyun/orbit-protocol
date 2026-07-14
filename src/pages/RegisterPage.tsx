import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/useIsMobile';

export default function RegisterPage() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const contentMaxWidth = isMobile ? '100%' : '480px';

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '40px 20px',
        maxWidth: contentMaxWidth,
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 10 }}>회원 등록</div>
      <div style={{ fontSize: 13, color: '#9a9789', lineHeight: 1.6, marginBottom: 28 }}>
        닉네임 + PIN 회원 등록은 준비 중입니다.
        <br />
        등록 없이도 게스트로 계속 플레이할 수 있으며, 진행 기록은 이 기기에 저장됩니다.
      </div>
      <button
        type="button"
        onClick={() => navigate('/games')}
        style={{ background: '#1a1a1a', color: '#fff', textAlign: 'center', padding: 16, borderRadius: 100, fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%', border: 'none', fontFamily: 'inherit' }}
      >
        게스트로 계속 플레이
      </button>
    </div>
  );
}
