import { Route, Routes } from "react-router-dom";
import Layout from "pages/Layout";
import HomePage from "pages/HomePage";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route element={<HomePage />} path={"/"} />
      </Route>
    </Routes>
  );
};

export default App;
