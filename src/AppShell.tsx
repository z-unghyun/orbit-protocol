import { useRef, useState } from 'react';
import { Outlet, useLocation, useMatch, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HamburgerMenu from './components/HamburgerMenu';
import Toast from './components/Toast';
import { gameConfig } from './data/games';
import { useIsMobile } from './hooks/useIsMobile';
import { isGameId } from './types';

export default function AppShell() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const gameMatch = useMatch('/games/:gameId/*');
  const gameId = gameMatch?.params.gameId;
  const active = isGameId(gameId) ? gameConfig[gameId] : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const toggleMenu = () => setMenuOpen((v) => !v);
  const toggleSound = () => setSoundOn((v) => !v);
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  };
  const notReady = () => showToast('준비 중인 기능입니다');

  const goHome = () => {
    setMenuOpen(false);
    navigate('/');
  };
  const goSelect = () => {
    setMenuOpen(false);
    navigate('/games');
  };
  const openGame = (id: string) => {
    setMenuOpen(false);
    navigate(`/games/${id}`);
  };
  const goBack = () => {
    if (!active) {
      navigate('/games');
      return;
    }
    if (location.pathname.endsWith('/result')) navigate('/games');
    else if (location.pathname.endsWith('/play')) navigate(`/games/${active.id}`);
    else navigate('/games');
  };

  const isHome = location.pathname === '/';
  const isSelect = location.pathname === '/games';
  const headerTitle = isHome ? 'ORBIT PROTOCOL' : isSelect ? '관제 구역 선택' : (active?.nameEn ?? 'ORBIT PROTOCOL');
  const showHamburger = isHome || isSelect;
  const showBack = !showHamburger;

  const topNavItems = [
    { label: 'COMMAND DECK', onClick: () => openGame('command') },
    { label: 'CARGO CORE', onClick: () => openGame('cargo') },
    { label: 'VECTOR SHIFT', onClick: () => openGame('vector') },
    { label: '항해 기록', onClick: notReady },
    { label: '랭킹', onClick: notReady },
    { label: '게임 안내', onClick: notReady },
  ];

  const menuItems = [
    { label: 'COMMAND DECK', onClick: () => openGame('command') },
    { label: 'CARGO CORE', onClick: () => openGame('cargo') },
    { label: 'VECTOR SHIFT', onClick: () => openGame('vector') },
    { label: '항해 기록', badge: '준비중', onClick: notReady },
    { label: '랭킹', badge: '준비중', onClick: notReady },
    { label: '게임 안내', badge: '준비중', onClick: notReady },
    { label: '로그인 / 로그아웃', badge: '준비중', onClick: notReady },
  ];

  const isGameFlow = location.pathname.startsWith('/games/');
  const navTabs = [
    { label: '홈', active: isHome, onClick: goHome },
    { label: '게임', active: isSelect || isGameFlow, onClick: goSelect },
    { label: '항해 기록', active: false, onClick: notReady },
    { label: '랭킹', active: false, onClick: notReady },
  ];

  const shellMaxWidth = isMobile ? '430px' : '1180px';
  const shellShadow = isMobile ? '0 40px 100px rgba(0,0,0,.10)' : 'none';

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#efeee9', display: 'flex', justifyContent: 'center', padding: 0 }}>
      <div
        style={{
          width: '100%',
          maxWidth: shellMaxWidth,
          minHeight: '100vh',
          background: '#fefefc',
          position: 'relative',
          boxShadow: shellShadow,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Header
          isMobile={isMobile}
          showBack={showBack}
          showHamburger={showHamburger}
          headerTitle={headerTitle}
          soundOn={soundOn}
          topNavItems={topNavItems}
          onBack={goBack}
          onToggleMenu={toggleMenu}
          onToggleSound={toggleSound}
          onGoHome={goHome}
        />

        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          <Outlet />
        </div>

        {isMobile && <BottomNav tabs={navTabs} />}
        {menuOpen && <HamburgerMenu items={menuItems} onClose={toggleMenu} />}
        {toast && <Toast message={toast} />}
      </div>
    </div>
  );
}
