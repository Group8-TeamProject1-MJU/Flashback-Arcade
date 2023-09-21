import React, { lazy, Suspense } from 'react';

const Jehee = lazy(() => import('../pages/games/Jehee'));
const Jiwon = lazy(() => import('../pages/games/Jiwon'));
const Gayeong = lazy(() => import('../pages/games/Gayeong'));
const Yongchan = lazy(() => import('../pages/games/Yongchan'));
const NotFound = lazy(() => import('../pages/notfound/index'));
const Home = lazy(() => import('../pages/Home/index'));
const Signin = lazy(() => import('../pages/account/signin'));
const Signup = lazy(() => import('../pages/account/signup'));
const Test = lazy(() => import('../pages/test'));
const ConfirmEmail = lazy(() => import('../pages/account/confirm-email'));
const SnakeGame = lazy(() => import('../pages/games/snake-game'));
const ExternalSignup = lazy(() => import('../pages/external-signup'));
const BallShooting = lazy(() => import('../pages/games/ball-shooting/BallShooting'));
const Tetris = lazy(() => import('../pages/games/tetris/src/components/Tetris'));
const Memory = lazy(() => import('../pages/games/memory/memory'));
const Fifteenpuzzle = lazy(() => import('../pages/games/15Puzzle/Fifteenpuzzle'));
const BrickBreakout = lazy(() => import('../pages/games/BrickBreakout/BrickBreakout'));
const Board = lazy(() => import('../pages/games/Minesweeper/Components/Board'));

const AppRoutes = [
  {
    index: true,
    element: <Home />,
    isPrivate: false
  },
  {
    path: '/account/signin',
    element: <Signin />,
    isPrivate: false
  },
  {
    path: '/account/signup',
    element: <Signup />,
    isPrivate: false
  },
  {
    path: '/account/external-signup',
    element: <ExternalSignup />,
    isPrivate: false
  },
  {
    path: '/account/confirm-email',
    element: <ConfirmEmail />,
    isPrivate: false
  },
  {
    path: '/games/snake-game',
    element: <SnakeGame />,
    title: 'Snake Game',
    isPrivate: true
  },
  {
    path: '/games/tetris',
    element: <Tetris />,
    title: 'Tetris',
    isPrivate: false
  },
  {
    path: '/games/ball-shooting',
    element: <BallShooting />,
    title: 'Ball Shooting',
    isPrivate: false
  },
  {
    path: '/games/memory',
    element: <Memory />,
    title: 'Memory',
    isPrivate: false
  },
  {
    path: '/games/15puzzle',
    element: <Fifteenpuzzle />,
    title: '15 Puzzle',
    isPrivate: false
  },
  {
    path: '/games/brick-breackout',
    element: <BrickBreakout />,
    title: 'Brick Breakout',
    isPrivate: false
  },
  {
    path: '/games/mine-sweeper',
    element: <Board />,
    title: '지뢰찾기-Mine Sweeper',
    isPrivate: false
  },
  {
    path: '/games/yongchan',
    element: <Yongchan />,
    title: 'Yongchan',
    isPrivate: false
  },
  {
    path: '/games/gayeong',
    element: <Gayeong />,
    title: 'Gayeong',
    isPrivate: false
  },
  {
    path: '/games/jiwon',
    element: <Jiwon />,
    title: 'Jiwon',
    isPrivate: false
  },
  {
    path: '/games/jehee',
    element: <Jehee />,
    title: 'Jehee',
    isPrivate: true
  },
  {
    path: '/test',
    element: <Test />,
    isPrivate: false
  },
  {
    path: '/notfound',
    element: <NotFound />,
    isPrivate: false
  },
  {
    path: '*',
    element: <NotFound />,
    isPrivate: false
  }
];

export default AppRoutes;
