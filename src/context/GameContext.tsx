import { GAME_STATUS, GameContext, Session } from "models/game";
import { QuestionType } from "models/responses";
import { Space } from "models/space";
import { User } from "models/user";
import { createContext, PropsWithChildren, useContext, useState } from "react";

export const GlobalGameContext = createContext<GameContext>(null!);

export const GameProvider = ({ children }: PropsWithChildren) => {
  const [space, setSpace] = useState<Space | null>(null);
  const [participents, setParticipents] = useState<User[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [questionCounter, setQuestionCounter] = useState<number>(0);
  const [selectedGameType, setSelectedGameType] = useState<QuestionType | null>(
    null
  );
  const [gameStatus, setGameStatus] = useState<GAME_STATUS>(
    GAME_STATUS.PRE_GAME
  );
  const [gameSummary, setGameSummary] = useState<User[]>([]);

  const resetGame = () => {
    setSession(null);
    setSelectedGameType(null);
    setGameStatus(GAME_STATUS.PRE_GAME);
    setGameSummary([]);
    setQuestionCounter(0);
  };
  return (
    <GlobalGameContext.Provider
      value={{
        participents,
        setParticipents,
        session,
        setSession,
        space,
        setSpace,
        selectedGameType,
        setSelectedGameType,
        gameStatus,
        setGameStatus,
        gameSummary,
        questionCounter,
        setQuestionCounter,
        setGameSummary,
        resetGame,
      }}
    >
      {children}
    </GlobalGameContext.Provider>
  );
};

export const useGameContext = () => useContext(GlobalGameContext);
