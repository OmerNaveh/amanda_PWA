import React from "react";
import { Outlet } from "react-router-dom";
import Header from "components/header/Header";
import { GAME_STATUS } from "models/game";
import { useGameStore } from "context/gameStore";

const Layout = () => {
  const gameStatus = useGameStore((state) => state.gameStatus);

  const showHeader = gameStatus !== GAME_STATUS.WELCOME;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-gradient-to-b from-violet-900 via-purple-800 to-fuchsia-900 text-white overflow-hidden">
      <Background />
      <Header showHeader={showHeader} />

      <main
        className="flex-1 flex flex-col p-4 transition-all"
        style={{
          height: showHeader ? "calc(100dvh - 57px)" : "100dvh",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;

const Background: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-pink-600/20 blur-3xl" />
      <div className="absolute bottom-20 right-[5%] w-40 h-40 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute top-1/3 right-[15%] w-24 h-24 rounded-full bg-fuchsia-500/20 blur-2xl" />
    </div>
  );
};

export const Fallback = () => {
  return (
    <>
      <Background />
      <Header showHeader={true} />
    </>
  );
};
