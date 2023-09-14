import Jehee from '../pages/games/Jehee';
import Jiwon from '../pages/games/Jiwon';
import Gayeong from '../pages/games/Gayeong';
import Yongchan from '../pages/games/Yongchan';
import NotFound from '../pages/notfound/index';
import Home from '../pages/index';
import SnakeGame from '../pages/games/SnakeGame';
import Signin from '../pages/account/signin';
import Signup from '../pages/account/signup';
import Test from '../pages/test'

const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/account/signin',
    element: <Signin />
  },
  {
    path: '/account/signup',
    element: <Signup />
  },
  {
    path: '/games/snakegame',
    element: <SnakeGame />
  },
  {
    path: '/games/yongchan',
    element: <Yongchan />
  },
  {
    path: '/games/gayeong',
    element: <Gayeong />
  },  
  {
    path: '/games/jiwon',
    element: <Jiwon />
  },
  {
    path: '/games/jehee',
    element: <Jehee />
  },
  {
    path: '/Test',
    element: <Test />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default AppRoutes;
