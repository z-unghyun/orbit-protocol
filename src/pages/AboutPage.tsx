import { useIsMobile } from '../hooks/useIsMobile';
import { useLocalSave } from '../hooks/useLocalSave';
import { updateSettings } from '../lib/local-save';

export default function AboutPage() {
  const isMobile = useIsMobile();
  const save = useLocalSave();
  const contentMaxWidth = isMobile ? '100%' : '640px';

  return (
    <div
      style={{
        animation: 'screenIn .4s cubic-bezier(.16,1,.3,1)',
        padding: '24px 20px 40px',
        maxWidth: contentMaxWidth,
        margin: '0 auto',
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 18 }}>서비스 안내</div>

      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: 18, marginBottom: 22 }}>
        <div style={{ fontSize: 13, lineHeight: 1.7, color: '#1a1a1a' }}>
          ORBIT PROTOCOL은 주의집중, 작업기억, 계획, 인지 전환 능력을 게임 형태로 연습하는 일반 웰니스·교육
          콘텐츠입니다.
          <br />
          <br />
          의료행위, 진단 또는 치료를 제공하지 않습니다. 이 서비스는 놀이치료, 인지 훈련, 실행기능 훈련 등의
          개념에서 영감을 받았지만 실제 치료를 대체하지 않습니다.
        </div>
      </div>

      <div style={{ fontSize: 11, fontWeight: 700, color: '#b0ada0', marginBottom: 10 }}>설정</div>
      <div style={{ background: '#fff', border: '1px solid #eeece5', borderRadius: 16, padding: '4px 18px', marginBottom: 22 }}>
        <SettingRow
          label="사운드"
          description="게임 효과음을 켜거나 끕니다"
          checked={save.settings.soundOn}
          onToggle={() => updateSettings({ soundOn: !save.settings.soundOn })}
        />
        <div style={{ height: 1, background: '#f2f0e8' }} />
        <SettingRow
          label="애니메이션 감소"
          description="화면 전환·연출 애니메이션을 줄입니다"
          checked={save.settings.reduceMotion}
          onToggle={() => updateSettings({ reduceMotion: !save.settings.reduceMotion })}
        />
      </div>

      <div style={{ fontSize: 11, lineHeight: 1.6, color: '#b0ada0' }}>
        닉네임, 진척도, 성공률, 랭킹 외 불필요한 개인정보는 수집하지 않습니다. 현재 진행 기록은 이 기기의
        브라우저에만 저장됩니다.
      </div>
    </div>
  );
}

function SettingRow({ label, description, checked, onToggle }: { label: string; description: string; checked: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' }}>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{label}</div>
        <div style={{ fontSize: 11.5, color: '#9a9789', marginTop: 2 }}>{description}</div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        style={{
          width: 42,
          height: 24,
          borderRadius: 20,
          border: 'none',
          background: checked ? '#1a1a1a' : '#e4e2d9',
          position: 'relative',
          cursor: 'pointer',
          flex: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 3,
            left: checked ? 21 : 3,
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left .15s ease',
          }}
        />
      </button>
    </div>
  );
}
