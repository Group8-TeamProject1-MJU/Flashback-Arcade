import Jiwon from '../pages/games/Jiwon';
import Gayeong from '../pages/games/Gayeong/Gayeong';
import Yongchan from '../pages/games/Yongchan/Yongchan';
import NotFound from '../pages/notfound/index';
import Home from '../pages/index';
import Signin from '../pages/account/signin';
import Signup from '../pages/account/signup';
import Test from '../pages/test'
import ConfirmEmail from '../pages/account/confirm-email';
import SnakeGame from '../pages/games/snake-game';
import ExternalSignup from '../pages/external-signup';
import BallShooting from '../pages/games/ball-shooting/BallShooting';
import Tetris from '../pages/games/tetris/src/components/Tetris';
import Woojae from '../pages/games/Woojae/Woojae';

const AppRoutes = [
  {
    index: true,
    element: <Home />,
    isPrivate: true
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
    isPrivate: true
  },
  {
    path: '/games/tetris',
    element: <Tetris />,
    isPrivate: false
  },
  {
    path: '/games/ball-shooting',
    element: <BallShooting />,
    isPrivate: false
  },
  {
    path: '/games/yongchan',
    element: <Yongchan />,
    isPrivate: false
  },
  {
    path: '/games/gayeong',
    element: <Gayeong />,
    isPrivate: false
  },
  {
    path: '/games/jiwon',
    element: <Jiwon />,
    isPrivate: false
  },
  {
    path: '/games/woojae',
    element: <Woojae />,
    isPrivate: false
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
