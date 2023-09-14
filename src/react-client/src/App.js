import AppRoutes from './utils/AppRoutes';
import MainLayout from './layouts/main/MainLayout';
import { Route, Routes } from "react-router-dom";
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <MainLayout>
        <Routes>
          {/* <Route path="/" element={<MainLayout />}> */}
          {AppRoutes.map((route, idx) => {
            const { element, ...rest } = route;
            return <Route key={idx} {...rest} element={element} />;
          })}
          {/* </Route> */}
        </Routes>
      </MainLayout>
    </UserProvider>
  );
}

export default App;
