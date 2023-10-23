import React, { lazy, Suspense } from 'react';

const Jiwon = lazy(() => import('../pages/games/Jiwon'));
const Gayeong = lazy(() => import('../pages/games/Gayeong/Gayeong'));
const Yongchan = lazy(() => import('../pages/games/Yongchan/Yongchan'));
const Woojae = lazy(() => import('../pages/games/Woojae/Woojae'));
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
    path: '/games',
    isPrivate: true,
    sub_routes: [
      {
        path: 'snake-game',
        element: <SnakeGame />,
        title: 'Snake Game',
        categories: ['Arcade'],
        serial_number: '01'
      },
      {
        path: 'tetris',
        element: <Tetris />,
        title: 'Tetris',
        categories: ['Puzzle'],
        serial_number: '02'
      },
      {
        path: 'ball-shooting',
        element: <BallShooting />,
        title: 'Ball Shooting',
        categories: ['Shooting'],
        serial_number: '03'
      },
      {
        path: 'memory',
        element: <Memory />,
        title: 'Memory',
        categories: ['Puzzle'],
        serial_number: '04'
      },
      {
        path: '15puzzle',
        element: <Fifteenpuzzle />,
        title: '15 Puzzle',
        categories: ['Puzzle'],
        serial_number: '05'
      },
      {
        path: 'brick-breackout',
        element: <BrickBreakout />,
        title: 'Brick Breakout',
        categories: ['Shooting'],
        serial_number: '06'
      },
      {
        path: 'mine-sweeper',
        element: <Board />,
        title: 'Mine Sweeper',
        categories: ['Puzzle'],
        serial_number: '07'
      },
      {
        path: 'yongchan',
        element: <Yongchan />,
        title: 'Yongchan',
        serial_number: '08'
      },
      {
        path: 'gayeong',
        element: <Gayeong />,
        title: 'Gayeong',
        serial_number: '09'
      },
      {
        path: 'jiwon',
        element: <Jiwon />,
        title: 'Jiwon',
        serial_number: '10'
      },
      {
        path: 'woojae',
        element: <Woojae />,
        title: 'Woojae',
        serial_number: '11'
      }
    ]
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
