import MainLayout from './layouts/main/MainLayout';
import { UserProvider } from './contexts/UserContext';
import AuthRoutes from './components/AuthRoutes';
import { ToastContainer, toast } from 'react-toastify';
import MusicButton from './components/MusicButton';
import { Suspense, useEffect, useState } from 'react';
import CustomPacmanLoader from './components/PacmanLoader';
import axios from 'axios';


function App() {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setPlaytime(0);
    if (process.env.NODE_ENV !== 'development') {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 3000);
    }
    const intervalId = setInterval(() => {
     
      setPlaytime((playtime)=>playtime+1);
      toast(`${playtime+1}시간이 경과되었습니다.`)
    },1000); // 1시간

    // 컴포넌트가 언마운트될 때 interval 정리
    return () => clearInterval(intervalId);
  

  }, []);

  const [playtime, setPlaytime] = useState(null);

 
 
  return (
    <UserProvider>
      <div>
      <p color="white">{playtime !== null ? `Total Playtime: ${playtime}` : 'Loading playtime...'}</p>
    </div>
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
