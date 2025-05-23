import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GAME_STATUS, Question } from "models/game";
import { WS_MESSAGE, WS_MESSAGE_TYPE } from "models/ws";
import { User } from "models/user";
import { useAuthContext } from "context/AuthContext";
import { useGameStore } from "context/gameStore";
import ParticipentsBottomSheet from "components/game/ParticipentsBottomSheet";
import WaitingRoom from "components/game/WaitingRoom";
import { useMutation } from "react-query";
import { endGame } from "services/apiClient";
import { useToast } from "components/ui/useToast";
import { getErrorMessage } from "lib/errorHandling";
import useSocket from "hooks/useSocket";
import { AnimatePresence } from "framer-motion";
import Loader from "components/game/Loader";
const PlayTime = lazy(() => import("components/game/PlayTime"));
const GameResults = lazy(() => import("components/game/GameResults"));

const GameRoom = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [result, setResult] = useState<User[] | null>(null);

  const space = useGameStore((state) => state.space);
  const participents = useGameStore((state) => state.participents);
  const setParticipents = useGameStore((state) => state.setParticipents);
  const session = useGameStore((state) => state.session);
  const setSession = useGameStore((state) => state.setSession);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const setSelectedGameType = useGameStore(
    (state) => state.setSelectedGameType
  );
  const setGameSummary = useGameStore((state) => state.setGameSummary);
  const setQuestionCounter = useGameStore((state) => state.setQuestionCounter);
  const setHasEveryoneAnswered = useGameStore(
    (state) => state.setHasEveryoneAnswered
  );
  const resetGame = useGameStore((state) => state.resetGame);
  const resetAll = useGameStore((state) => state.resetAll);

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMessage = useCallback(
    (data: any) => {
      const wsData = data?.data as WS_MESSAGE;

      switch (wsData.type) {
        case WS_MESSAGE_TYPE.JOIN:
          if (user?.id === wsData.user.id || !wsData?.users?.length) return;
          setParticipents(wsData.users);
          break;
        case WS_MESSAGE_TYPE.LEAVE:
          setParticipents((prev) => {
            if (!prev.length) return prev;
            if (wsData.user.id === user?.id) return prev;
            return prev.filter(
              (participent) => participent.id !== wsData.user.id
            );
          });
          break;
        case WS_MESSAGE_TYPE.START_GAME:
          setGameStatus(GAME_STATUS.SHOWING_QUESTION);
          setQuestionCounter(1);
          setResult(null);
          setSession(wsData.session);
          setQuestion(wsData.question);
          setSelectedGameType(wsData.questionType);
          setParticipents(wsData.users);
          setGameSummary([]);
          break;
        case WS_MESSAGE_TYPE.END_GAME:
          setQuestion(null);
          setResult(null);
          setSession(null);
          setGameStatus(GAME_STATUS.GAME_OVER);
          setGameSummary(wsData.users);
          break;
        case WS_MESSAGE_TYPE.NEXT_QUESTION:
          setQuestionCounter((prev) => prev + 1);
          setGameStatus(GAME_STATUS.SHOWING_QUESTION);
          setParticipents(wsData.users);
          setResult(null);
          setQuestion(wsData.question);
          break;
        case WS_MESSAGE_TYPE.NEXT_RESULT:
          setResult(wsData.users);
          setGameStatus(GAME_STATUS.SHOWING_RESULT);
          break;
        case WS_MESSAGE_TYPE.BACK_TO_OPTIONS:
          resetGame();
          break;
        case WS_MESSAGE_TYPE.ALL_ANSWERS_SUBMITTED:
          setHasEveryoneAnswered(true);
          break;
      }
    },
    [
      resetGame,
      setGameStatus,
      setGameSummary,
      setHasEveryoneAnswered,
      setParticipents,
      setQuestionCounter,
      setSelectedGameType,
      setSession,
      user?.id,
    ]
  );

  useSocket({ handleMessage, channel: space?.channel });

  const { mutate: TriggerEndingGame, isLoading: loadingFinishGame } =
    useMutation(() => endGame(session!.id), {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    });

  const finishGame = useCallback(() => {
    TriggerEndingGame();
  }, [TriggerEndingGame]);

  useEffect(() => {
    if (!space || !user) {
      navigate("/");
      return;
    }
  }, [navigate, space, user]);

  if (!space || !user) return null;
  return (
    <div className="flex flex-col flex-1 gap-4">
      <div className="flex-1 flex flex-col flex-shrink-0 text-center overflow-hidden">
        <Suspense fallback={<Loader />}>
          <AnimatePresence mode="wait">
            {gameStatus === GAME_STATUS.PRE_GAME ? (
              <WaitingRoom key={gameStatus} />
            ) : gameStatus === GAME_STATUS.GAME_OVER ? (
              <GameResults key={gameStatus} />
            ) : (
              <PlayTime
                key={"playtime"}
                question={question}
                result={result}
                finishGame={finishGame}
                loadingFinishGame={loadingFinishGame}
              />
            )}
          </AnimatePresence>
        </Suspense>
      </div>
      {!!participents.length && (
        <ParticipentsBottomSheet
          resetAll={resetAll}
          finishGame={finishGame}
          loadingFinishGame={loadingFinishGame}
        />
      )}
    </div>
  );
};

export default GameRoom;
