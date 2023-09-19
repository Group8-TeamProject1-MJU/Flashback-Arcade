import MainLayout from './layouts/main/MainLayout';
import { UserProvider } from './contexts/UserContext';
import AuthRoutes from './components/AuthRoutes';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  return (
    <UserProvider>
      <MainLayout>
        <AuthRoutes />
        <ToastContainer />
      </MainLayout>
    </UserProvider>
  );
}

export default App;
