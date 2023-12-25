import { Route, Routes } from "react-router-dom";
import Layout from "pages/Layout";
import HomePage from "pages/HomePage";
import GameRoom from "pages/GameRoom";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<GameRoom />} path={"/game"} />
        <Route element={<HomePage />} path={"*"} />
      </Route>
    </Routes>
  );
};

export default App;
