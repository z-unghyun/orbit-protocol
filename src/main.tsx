import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css';
import AppShell from './AppShell';
import HomePage from './pages/HomePage';
import GameSelectPage from './pages/GameSelectPage';
import GameIntroPage from './pages/GameIntroPage';
import GamePlayPage from './pages/GamePlayPage';
import RoundResultPage from './pages/RoundResultPage';
import FinalResultPage from './pages/FinalResultPage';
import HistoryPage from './pages/HistoryPage';
import LeaderboardPage from './pages/LeaderboardPage';
import GuidePage from './pages/GuidePage';
import AboutPage from './pages/AboutPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/games', element: <GameSelectPage /> },
      { path: '/games/:gameId', element: <GameIntroPage /> },
      { path: '/games/:gameId/play', element: <GamePlayPage /> },
      { path: '/games/:gameId/result', element: <RoundResultPage /> },
      { path: '/summary', element: <FinalResultPage /> },
      { path: '/history', element: <HistoryPage /> },
      { path: '/leaderboard', element: <LeaderboardPage /> },
      { path: '/guide', element: <GuidePage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
