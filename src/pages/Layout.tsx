import React from "react";
import { Outlet } from "react-router-dom";
import Header from "components/header/Header";
import CircleSVG from "components/ui/CircleSVG";

const Layout = () => {
  return (
    <>
      <Background />
      <Header />
      {<Outlet />}
    </>
  );
};

export default Layout;

const Background: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <CircleSVG
        width="100%"
        height="100%"
        viewBox="0 0 370 470"
        circleCx="185"
        circleCy="235"
        circleR="107.5"
        fill="#0C445B"
        filterId="filter0_f_311_4806"
        stdDeviation="100"
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
      />

      <CircleSVG
        width="100%"
        height="100%"
        viewBox="0 0 390 615"
        circleCx="195"
        circleCy="307.5"
        circleR="107.5"
        fill="#420C5B"
        filterId="filter0_f_311_4805"
        stdDeviation="100"
        className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2"
      />
    </div>
  );
};
