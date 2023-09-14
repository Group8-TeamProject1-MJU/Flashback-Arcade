import AppRoutes from './utils/AppRoutes';
import MainLayout from './layouts/main/MainLayout';
import { Route, Routes } from "react-router-dom";

function App() {
  return (
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
  );
}

export default App;
