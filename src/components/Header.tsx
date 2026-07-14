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
          <div
            onClick={onBack}
            style={{ fontSize: 20, fontWeight: 600, cursor: 'pointer', width: 32, color: '#1a1a1a' }}
          >
            ←
          </div>
        ) : showHamburger ? (
          <div
            onClick={onToggleMenu}
            style={{
              width: 22,
              height: 16,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
          >
            <div style={{ width: '100%', height: 2, background: '#1a1a1a', borderRadius: 2 }} />
            <div style={{ width: '100%', height: 2, background: '#1a1a1a', borderRadius: 2 }} />
            <div style={{ width: '100%', height: 2, background: '#1a1a1a', borderRadius: 2 }} />
          </div>
        ) : (
          <div style={{ width: 32 }} />
        )}

        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em', color: '#1a1a1a' }}>
          {headerTitle}
        </div>

        <div
          onClick={onToggleSound}
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '.04em',
            color: '#8a8879',
            border: '1px solid #e4e2d9',
            borderRadius: 20,
            padding: '5px 10px',
            cursor: 'pointer',
            minWidth: 38,
            textAlign: 'center',
          }}
        >
          {soundLabel}
        </div>
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
          <div
            onClick={onBack}
            style={{
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              color: '#1a1a1a',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            ← 뒤로
          </div>
        )}
        <div
          onClick={onGoHome}
          style={{
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '.06em',
            color: '#1a1a1a',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            flex: 'none',
          }}
        >
          ORBIT PROTOCOL
        </div>
        <div style={{ display: 'flex', gap: 30 }}>
          {topNavItems.map((nav) => (
            <div
              key={nav.label}
              onClick={nav.onClick}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: '#635f52',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flex: 'none',
              }}
            >
              {nav.label}
            </div>
          ))}
        </div>
      </div>
      <div
        onClick={onToggleSound}
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '.04em',
          color: '#8a8879',
          border: '1px solid #e4e2d9',
          borderRadius: 20,
          padding: '7px 14px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          flex: 'none',
        }}
      >
        {soundLabel}
      </div>
    </div>
  );
}
