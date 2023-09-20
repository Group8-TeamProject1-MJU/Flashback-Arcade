import MainLayout from './layouts/main/MainLayout';
import { UserProvider } from './contexts/UserContext';
import AuthRoutes from './components/AuthRoutes';
import { ToastContainer, toast } from 'react-toastify';
import MusicButton from './components/MusicButton';

function App() {
  return (
    <UserProvider>
      <MainLayout>
        <AuthRoutes />
        <ToastContainer />
        <MusicButton />
      </MainLayout>
    </UserProvider>
  );
}

export default App;
