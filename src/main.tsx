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

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/games', element: <GameSelectPage /> },
      { path: '/games/:gameId', element: <GameIntroPage /> },
      { path: '/games/:gameId/play', element: <GamePlayPage /> },
      { path: '/games/:gameId/result', element: <RoundResultPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
