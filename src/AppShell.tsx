import { useState } from 'react';
import { Outlet, useLocation, useMatch, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HamburgerMenu from './components/HamburgerMenu';
import { gameConfig } from './data/games';
import { useIsMobile } from './hooks/useIsMobile';
import { useLocalSave } from './hooks/useLocalSave';
import { isGameId } from './types';

const TITLES: Record<string, string> = {
  '/summary': '항해 요약',
  '/history': '항해 기록',
  '/leaderboard': '랭킹',
  '/guide': '게임 안내',
  '/about': '서비스 안내',
  '/register': '회원 등록',
  '/login': '로그인',
};

export default function AppShell() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const save = useLocalSave();
  const gameMatch = useMatch('/games/:gameId/*');
  const gameId = gameMatch?.params.gameId;
  const active = isGameId(gameId) ? gameConfig[gameId] : null;

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((v) => !v);

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
  const goTo = (path: string) => () => {
    setMenuOpen(false);
    navigate(path);
  };
  const goBack = () => {
    if (active) {
      if (location.pathname.endsWith('/result')) navigate('/games');
      else if (location.pathname.endsWith('/play')) navigate(`/games/${active.id}`);
      else navigate('/games');
      return;
    }
    navigate(-1);
  };

  const isHome = location.pathname === '/';
  const isSelect = location.pathname === '/games';
  const headerTitle = isHome
    ? 'ORBIT PROTOCOL'
    : isSelect
      ? '관제 구역 선택'
      : (active?.nameEn ?? TITLES[location.pathname] ?? 'ORBIT PROTOCOL');
  const showHamburger = isHome || isSelect;
  const showBack = !showHamburger;

  const topNavItems = [
    { label: 'VECTOR SHIFT', onClick: () => openGame('vector') },
    { label: 'CARGO CORE', onClick: () => openGame('cargo') },
    { label: 'COMMAND DECK', onClick: () => openGame('command') },
    { label: '랭킹', onClick: goTo('/leaderboard') },
  ];

  const menuItems = [
    { label: 'VECTOR SHIFT', onClick: () => openGame('vector') },
    { label: 'CARGO CORE', onClick: () => openGame('cargo') },
    { label: 'COMMAND DECK', onClick: () => openGame('command') },
    { label: '항해 기록', onClick: goTo('/history') },
    { label: '랭킹', onClick: goTo('/leaderboard') },
    { label: '게임 안내', onClick: goTo('/guide') },
    { label: '서비스 안내', onClick: goTo('/about') },
    { label: '저장 (로그인)', badge: '준비중', onClick: goTo('/login') },
  ];

  const isGameFlow = location.pathname.startsWith('/games/');
  const navTabs = [
    { label: '홈', active: isHome, onClick: goHome },
    { label: '게임', active: isSelect || isGameFlow, onClick: goSelect },
    { label: '랭킹', active: location.pathname === '/leaderboard', onClick: goTo('/leaderboard') },
  ];

  const shellMaxWidth = isMobile ? '430px' : '1180px';
  const shellShadow = isMobile ? '0 40px 100px rgba(0,0,0,.10)' : 'none';

  return (
    <div style={{ width: '100%', minHeight: '100vh', background: '#efeee9', display: 'flex', justifyContent: 'center', padding: 0 }}>
      <div
        className={save.settings.reduceMotion ? 'reduce-motion' : undefined}
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
          topNavItems={topNavItems}
          onBack={goBack}
          onToggleMenu={toggleMenu}
          onSave={goTo('/login')}
          onGoHome={goHome}
        />

        <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          <Outlet />
        </div>

        {isMobile && <BottomNav tabs={navTabs} />}
        {menuOpen && <HamburgerMenu items={menuItems} onClose={toggleMenu} />}
      </div>
    </div>
  );
}
