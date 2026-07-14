interface NavItem {
  label: string;
  onClick: () => void;
}

interface HeaderProps {
  isMobile: boolean;
  showBack: boolean;
  showHamburger: boolean;
  headerTitle: string;
  soundOn: boolean;
  topNavItems: NavItem[];
  onBack: () => void;
  onToggleMenu: () => void;
  onToggleSound: () => void;
  onGoHome: () => void;
}

const btnReset = { background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' } as const;

export default function Header({
  isMobile,
  showBack,
  showHamburger,
  headerTitle,
  soundOn,
  topNavItems,
  onBack,
  onToggleMenu,
  onToggleSound,
  onGoHome,
}: HeaderProps) {
  const soundLabel = soundOn ? 'SOUND ON' : 'MUTED';

  if (isMobile) {
    return (
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
          padding: '0 18px',
          background: 'rgba(254,254,252,.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #eeece5',
          flex: 'none',
        }}
      >
        {showBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="뒤로"
            style={{ ...btnReset, fontSize: 20, fontWeight: 600, width: 32, color: '#1a1a1a', textAlign: 'left', padding: 0 }}
          >
            ←
          </button>
        ) : showHamburger ? (
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label="메뉴 열기"
            style={{
              ...btnReset,
              width: 22,
              height: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: 0,
            }}
          >
            <div style={{ width: '100%', height: 2, background: '#1a1a1a', borderRadius: 2 }} />
            <div style={{ width: '100%', height: 2, background: '#1a1a1a', borderRadius: 2 }} />
            <div style={{ width: '100%', height: 2, background: '#1a1a1a', borderRadius: 2 }} />
          </button>
        ) : (
          <div style={{ width: 32 }} />
        )}

        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', color: '#1a1a1a' }}>
          {headerTitle}
        </div>

        <button
          type="button"
          onClick={onToggleSound}
          style={{
            ...btnReset,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '.04em',
            color: '#8a8879',
            border: '1px solid #e4e2d9',
            borderRadius: 20,
            padding: '5px 10px',
            minWidth: 38,
            textAlign: 'center',
          }}
        >
          {soundLabel}
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 76,
        padding: '0 48px',
        background: 'rgba(254,254,252,.94)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #eeece5',
        flex: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            style={{
              ...btnReset,
              fontSize: 15,
              fontWeight: 600,
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 0,
            }}
          >
            ← 뒤로
          </button>
        )}
        <button
          type="button"
          onClick={onGoHome}
          style={{
            ...btnReset,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '.06em',
            color: '#1a1a1a',
            whiteSpace: 'nowrap',
            flex: 'none',
            padding: 0,
          }}
        >
          ORBIT PROTOCOL
        </button>
        <div style={{ display: 'flex', gap: 30 }}>
          {topNavItems.map((nav) => (
            <button
              key={nav.label}
              type="button"
              onClick={nav.onClick}
              style={{
                ...btnReset,
                fontSize: 13,
                fontWeight: 600,
                color: '#635f52',
                whiteSpace: 'nowrap',
                flex: 'none',
                padding: 0,
              }}
            >
              {nav.label}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={onToggleSound}
        style={{
          ...btnReset,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '.04em',
          color: '#8a8879',
          border: '1px solid #e4e2d9',
          borderRadius: 20,
          padding: '7px 14px',
          whiteSpace: 'nowrap',
          flex: 'none',
        }}
      >
        {soundLabel}
      </button>
    </div>
  );
}
