import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Layout, { Fallback } from "pages/Layout";
import HomePage from "pages/HomePage";
const GameRoom = lazy(() => import("pages/GameRoom"));

const App = () => {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<GameRoom />} path={"/game"} />
          <Route element={<HomePage />} path={"*"} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
