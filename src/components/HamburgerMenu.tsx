interface MenuItem {
  label: string;
  badge?: string;
  onClick: () => void;
}

interface HamburgerMenuProps {
  items: MenuItem[];
  onClose: () => void;
}

export default function HamburgerMenu({ items, onClose }: HamburgerMenuProps) {
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,14,.35)', zIndex: 30 }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '78%',
          maxWidth: 320,
          background: '#fefefc',
          zIndex: 31,
          animation: 'menuSlide .32s cubic-bezier(.16,1,.3,1)',
          padding: '24px 22px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '.06em' }}>ORBIT PROTOCOL</div>
          <div onClick={onClose} style={{ fontSize: 20, cursor: 'pointer', color: '#9a9789' }}>
            ×
          </div>
        </div>
        {items.map((item) => (
          <div
            key={item.label}
            onClick={item.onClick}
            style={{
              padding: '14px 0',
              borderBottom: '1px solid #f2f0e8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{item.label}</div>
            {item.badge && (
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: '#b0ada0',
                  background: '#f2f0e8',
                  borderRadius: 20,
                  padding: '3px 8px',
                }}
              >
                {item.badge}
              </div>
            )}
          </div>
        ))}
        <div style={{ marginTop: 'auto', fontSize: 10.5, lineHeight: 1.6, color: '#c2bfb2', paddingTop: 16 }}>
          ORBIT PROTOCOL은 일반 웰니스·교육 콘텐츠이며 의료행위를 제공하지 않습니다.
        </div>
      </div>
    </>
  );
}
