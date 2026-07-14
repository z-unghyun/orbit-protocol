import { useRef, useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HamburgerMenu from './components/HamburgerMenu';
import Toast from './components/Toast';
import HomeScreen from './screens/HomeScreen';
import SelectScreen from './screens/SelectScreen';
import IntroScreen from './screens/IntroScreen';
import PlayScreen from './screens/PlayScreen';
import ResultScreen from './screens/ResultScreen';
import { gameConfig } from './data/games';
import { useIsMobile } from './hooks/useIsMobile';
import { isVectorCorrect, type VectorAnswer } from './games/VectorPlay';
import { isCargoCorrect, type CargoZoneId } from './games/CargoPlay';
import type { MissionId } from './games/CommandPlay';
import type { GameId, ScreenId } from './types';

export default function App() {
  const isMobile = useIsMobile();
  const [screen, setScreen] = useState<ScreenId>('home');
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);

  const [vectorSelected, setVectorSelected] = useState<VectorAnswer | null>(null);
  const [cargoSelected, setCargoSelected] = useState<CargoZoneId | null>(null);
  const [commandSelectedId, setCommandSelectedId] = useState<MissionId | null>(null);
  const [commandExecuted, setCommandExecuted] = useState(false);

  const active = gameConfig[activeGameId ?? 'vector'];

  const resetPlayState = () => {
    setVectorSelected(null);
    setCargoSelected(null);
    setCommandSelectedId(null);
    setCommandExecuted(false);
  };

  const goHome = () => {
    setScreen('home');
    setMenuOpen(false);
  };
  const goSelect = () => {
    setScreen('select');
    setMenuOpen(false);
  };
  const goBack = () => {
    if (screen === 'intro') setScreen('select');
    else if (screen === 'play') setScreen('intro');
    else if (screen === 'result') setScreen('select');
    else setScreen('select');
  };
  const openIntro = (id: GameId) => {
    setActiveGameId(id);
    resetPlayState();
    setScreen('intro');
  };
  const startPlay = () => setScreen('play');
  const goResult = () => setScreen('result');
  const retryPlay = () => {
    resetPlayState();
    setScreen('play');
  };

  const toggleMenu = () => setMenuOpen((v) => !v);
  const toggleSound = () => setSoundOn((v) => !v);
  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 1800);
  };

  const vectorAnswered = vectorSelected !== null;
  const vectorCorrect = isVectorCorrect(vectorSelected);
  const cargoAnswered = cargoSelected !== null;
  const cargoCorrect = isCargoCorrect(cargoSelected);

  const score =
    vectorAnswered && vectorCorrect
      ? 100
      : cargoAnswered && cargoCorrect
        ? 100
        : commandExecuted
          ? 640
          : 0;

  const successRateDisplay =
    (vectorAnswered && !vectorCorrect) || (cargoAnswered && !cargoCorrect) ? '84%' : '92%';

  const resultTitle =
    activeGameId === 'command'
      ? '임무 정산 완료'
      : vectorCorrect || cargoCorrect
        ? '라운드 통과'
        : '재도전 가능';

  const resultMessage =
    activeGameId === 'vector'
      ? vectorCorrect
        ? '규칙 전환 이후에도 반응이 안정적이었습니다.'
        : '규칙 전환 직후 반응이 늦어졌습니다. 같은 라운드를 다시 시도할 수 있습니다.'
      : activeGameId === 'cargo'
        ? cargoCorrect
          ? '예외 규칙을 정확히 적용했습니다.'
          : '예외 규칙에서 혼동이 있었습니다. 다시 시도해 보세요.'
        : '제한된 자원 안에서 우선순위 임무를 성공적으로 처리했습니다.';

  const notReady = () => showToast('준비 중인 기능입니다');

  const topNavItems = [
    { label: 'COMMAND DECK', onClick: () => openIntro('command') },
    { label: 'CARGO CORE', onClick: () => openIntro('cargo') },
    { label: 'VECTOR SHIFT', onClick: () => openIntro('vector') },
    { label: '항해 기록', onClick: notReady },
    { label: '랭킹', onClick: notReady },
    { label: '게임 안내', onClick: notReady },
  ];

  const menuItems = [
    { label: 'COMMAND DECK', onClick: () => { setMenuOpen(false); openIntro('command'); } },
    { label: 'CARGO CORE', onClick: () => { setMenuOpen(false); openIntro('cargo'); } },
    { label: 'VECTOR SHIFT', onClick: () => { setMenuOpen(false); openIntro('vector'); } },
    { label: '항해 기록', badge: '준비중', onClick: notReady },
    { label: '랭킹', badge: '준비중', onClick: notReady },
    { label: '게임 안내', badge: '준비중', onClick: notReady },
    { label: '로그인 / 로그아웃', badge: '준비중', onClick: notReady },
  ];

  const gameScreens: ScreenId[] = ['select', 'intro', 'play', 'result'];
  const navTabs = [
    { label: '홈', active: screen === 'home', onClick: goHome },
    { label: '게임', active: gameScreens.includes(screen), onClick: goSelect },
    { label: '항해 기록', active: false, onClick: notReady },
    { label: '랭킹', active: false, onClick: notReady },
  ];

  const headerTitle =
    screen === 'home' ? 'ORBIT PROTOCOL' : screen === 'select' ? '관제 구역 선택' : active.nameEn;
  const showBack = screen !== 'home' && screen !== 'select';
  const showHamburger = screen === 'home' || screen === 'select';

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
          {screen === 'home' && <HomeScreen isMobile={isMobile} onGoSelect={goSelect} />}
          {screen === 'select' && <SelectScreen isMobile={isMobile} onEnter={openIntro} />}
          {screen === 'intro' && <IntroScreen isMobile={isMobile} game={active} onStart={startPlay} />}
          {screen === 'play' && (
            <PlayScreen
              isMobile={isMobile}
              game={active}
              scoreDisplay={score.toLocaleString()}
              vectorSelected={vectorSelected}
              onVectorAnswer={setVectorSelected}
              cargoSelected={cargoSelected}
              onCargoAnswer={setCargoSelected}
              commandSelectedId={commandSelectedId}
              commandExecuted={commandExecuted}
              onCommandSelect={setCommandSelectedId}
              onCommandExecute={() => setCommandExecuted(true)}
              onGoResult={goResult}
            />
          )}
          {screen === 'result' && (
            <ResultScreen
              isMobile={isMobile}
              game={active}
              resultTitle={resultTitle}
              scoreDisplay={score.toLocaleString()}
              successRateDisplay={successRateDisplay}
              resultMessage={resultMessage}
              onRetry={retryPlay}
              onGoSelect={goSelect}
            />
          )}
        </div>

        {isMobile && <BottomNav tabs={navTabs} />}
        {menuOpen && <HamburgerMenu items={menuItems} onClose={toggleMenu} />}
        {toast && <Toast message={toast} />}
      </div>
    </div>
  );
}
