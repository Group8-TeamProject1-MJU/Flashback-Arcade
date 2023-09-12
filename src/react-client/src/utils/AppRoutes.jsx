import Jehee from '../pages/games/Jehee';
import Jiwon from '../pages/games/Jiwon';
import Gayeong from '../pages/games/Gayeong';
import Yongchan from '../pages/games/Yongchan';
import NotFound from '../pages/notfound/index';
import Home from '../pages/index';



const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/games/yongchan',
    element: <Yongchan />
  },
  {
    path: '/games/gayeong',
    element: <Gayeong />
  },  {
    path: '/games/jiwon',
    element: <Jiwon />
  },  {
    path: '/games/jehee',
    element: <Jehee />
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default AppRoutes;
