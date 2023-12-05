import MainLayout from './layouts/main/MainLayout';
import { UserProvider } from './contexts/UserContext';
import AuthRoutes from './components/AuthRoutes';
import { ToastContainer, toast } from 'react-toastify';
import MusicButton from './components/MusicButton';
import { Suspense, useEffect, useState } from 'react';
import CustomPacmanLoader from './components/PacmanLoader';

function App() {
  const [loading, setLoading] = useState(false);
  const [playtime, setPlaytime] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }

    setPlaytime(0);

    // 1초 단위로 실행되는 interval 생성
    const intervalId = setInterval(() => {
      setPlaytime((prevPlaytime) => {
        if (setPlaytime == 0) {
          return prevPlaytime + 1;
        }
        toast(`${prevPlaytime + 1}시간이 경과되었습니다.`)
        return prevPlaytime + 1;
      });
    }, 3600000); // 1시간

    // 리엑트 컴포넌트가 언마운트될 때 interval 정리
    return () => clearInterval(intervalId);
  }, []);

  return (
    <UserProvider>
      {loading ? (
        <div className="loading-animation">
          <CustomPacmanLoader className="" />
          <p className="loader1" style={{ color: "#f1e702" }}>Welcome to Flashback Arcade🔥</p>
        </div>
      ) : (
        <Suspense
          fallback={
            <div className="loading-animation">
              <CustomPacmanLoader />
            </div>
          }
        >
          <MainLayout>
            <AuthRoutes />
            <ToastContainer />
            <MusicButton />
          </MainLayout>
        </Suspense>
      )}
    </UserProvider>
  );


}

export default App;
