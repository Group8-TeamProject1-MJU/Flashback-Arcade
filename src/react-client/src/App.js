import MainLayout from './layouts/main/MainLayout';
import { UserProvider } from './contexts/UserContext';
import AuthRoutes from './components/AuthRoutes';

function App() {
  return (
    <UserProvider>
      <MainLayout>
        <AuthRoutes />
      </MainLayout>
    </UserProvider>
  );
}

export default App;
