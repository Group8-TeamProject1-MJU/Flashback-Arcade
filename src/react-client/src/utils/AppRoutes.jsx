import Jehee from '../pages/games/Jehee';
import Jiwon from '../pages/games/Jiwon';
import Gayeong from '../pages/games/Gayeong';
import Yongchan from '../pages/games/Yongchan';
import NotFound from '../pages/notfound/index';
import Home from '../pages/index';
import Signin from '../pages/account/signin';
import Signup from '../pages/account/signup';
import Test from '../pages/test'
import ConfirmEmail from '../pages/account/confirm-email';
import SnakeGame from '../pages/games/snake-game';

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
    path: '/account/confirm-email',
    element: <ConfirmEmail />,
    isPrivate: false
  },
  {
    path: '/games/snake-game',
    element: <SnakeGame />,
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
    path: '/games/jehee',
    element: <Jehee />,
    isPrivate: true
  },
  {
    path: '/test',
    element: <Test />,
    isPrivate: false
  },
  {
    path: '*',
    element: <NotFound />,
    isPrivate: false
  }
];

export default AppRoutes;
