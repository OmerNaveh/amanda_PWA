import { GAME_STATUS, GameContext, Session } from "models/game";
import { QuestionType } from "models/responses";
import { Space } from "models/space";
import { User } from "models/user";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useAuthContext } from "./AuthContext";

export const GlobalGameContext = createContext<GameContext>(null!);

export const GameProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuthContext();
  const [space, setSpace] = useState<Space | null>(null);
  const [participents, setParticipents] = useState<User[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [questionCounter, setQuestionCounter] = useState<number>(0);
  const [selectedGameType, setSelectedGameType] = useState<QuestionType | null>(
    null
  );
  const [gameStatus, setGameStatus] = useState<GAME_STATUS>(
    GAME_STATUS.WELCOME
  );
  const [gameSummary, setGameSummary] = useState<User[]>([]);
  const [hasEveryoneAnswered, setHasEveryoneAnswered] =
    useState<boolean>(false);

  const resetGame = useCallback(() => {
    setSession(null);
    setSelectedGameType(null);
    setGameStatus(GAME_STATUS.PRE_GAME);
    setGameSummary([]);
    setQuestionCounter(0);
    setHasEveryoneAnswered(false);
  }, []);

  const isSessionAdmin =
    !!session?.adminId &&
    !!user?.id &&
    String(session.adminId) === String(user.id);

  const resetAll = useCallback(() => {
    setSpace(null);
    setParticipents([]);
    resetGame();
  }, [resetGame]);

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
        resetAll,
        hasEveryoneAnswered,
        setHasEveryoneAnswered,
        isSessionAdmin,
      }}
    >
      {children}
    </GlobalGameContext.Provider>
  );
};

export const useGameContext = () => useContext(GlobalGameContext);
