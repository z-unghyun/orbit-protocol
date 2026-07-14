interface NavTab {
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function BottomNav({ tabs }: { tabs: NavTab[] }) {
  return (
    <div style={{ flex: 'none', display: 'flex', borderTop: '1px solid #eeece5', background: '#fefefc' }}>
      {tabs.map((tab) => (
        <div
          key={tab.label}
          onClick={tab.onClick}
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 5,
            padding: '10px 0 14px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: tab.active ? '#1a1a1a' : '#e4e2d9',
            }}
          />
          <div
            style={{
              fontSize: 10.5,
              fontWeight: 600,
              color: tab.active ? '#1a1a1a' : '#b0ada0',
            }}
          >
            {tab.label}
          </div>
        </div>
      ))}
    </div>
  );
}
