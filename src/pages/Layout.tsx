import React from "react";
import { Outlet } from "react-router-dom";
import Header from "components/header/Header";
import CircleSVG from "components/ui/CircleSVG";
import { AnimatePresence } from "framer-motion";
import { useGameContext } from "context/GameContext";
import { GAME_STATUS } from "models/game";

type HeaderMode = "welcome" | "compact";

const Layout = () => {
  const { gameStatus } = useGameContext();
  const headerMode: HeaderMode =
    gameStatus === GAME_STATUS.WELCOME ? "welcome" : "compact";

  const handleLogoClick = () => {
    if (gameStatus !== GAME_STATUS.WELCOME) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gradient-to-b from-violet-900 via-purple-800 to-fuchsia-900 text-white overflow-hidden">
      <Background />
      <Header mode={headerMode} onLogoClick={handleLogoClick} />
      <AnimatePresence mode="wait">
        <main
          className="flex-1 flex flex-col px-2 transition-all duration-300 ease-in-out"
          style={{
            paddingTop: headerMode === "welcome" ? "0" : "0.5rem",
            minHeight:
              headerMode === "welcome" ? "100dvh" : "calc(100dvh - 56px)",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <Outlet />
        </main>
      </AnimatePresence>
    </div>
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

export const Fallback = () => {
  return (
    <>
      <Background />
      <Header mode="compact" />
    </>
  );
};
