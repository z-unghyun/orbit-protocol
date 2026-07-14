import { useEffect } from 'react';

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
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        onClick={onClose}
        aria-label="메뉴 닫기"
        style={{ position: 'absolute', inset: 0, background: 'rgba(20,18,14,.35)', zIndex: 30, border: 'none', cursor: 'pointer' }}
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
          <button
            type="button"
            onClick={onClose}
            aria-label="메뉴 닫기"
            style={{ fontSize: 20, cursor: 'pointer', color: '#9a9789', background: 'none', border: 'none', fontFamily: 'inherit' }}
          >
            ×
          </button>
        </div>
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            style={{
              padding: '14px 0',
              borderBottom: '1px solid #f2f0e8',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              borderBottomWidth: 1,
              borderBottomStyle: 'solid',
              borderBottomColor: '#f2f0e8',
              fontFamily: 'inherit',
              width: '100%',
              textAlign: 'left',
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
          </button>
        ))}
        <div style={{ marginTop: 'auto', fontSize: 10.5, lineHeight: 1.6, color: '#c2bfb2', paddingTop: 16 }}>
          ORBIT PROTOCOL은 일반 웰니스·교육 콘텐츠이며 의료행위를 제공하지 않습니다.
        </div>
      </div>
    </>
  );
}
