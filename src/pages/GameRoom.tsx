import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GAME_STATUS, Question } from "models/game";
import { WS_MESSAGE, WS_MESSAGE_TYPE } from "models/ws";
import { User } from "models/user";
import { useAuthContext } from "context/AuthContext";
import { useGameContext } from "context/GameContext";
import ParticipentsBottomSheet from "components/game/ParticipentsBottomSheet";
import WaitingRoom from "components/game/WaitingRoom";
import LoaderCard from "components/game/LoaderCard";
import { useMutation } from "react-query";
import { endGame } from "services/apiClient";
import { useToast } from "components/ui/useToast";
import { getErrorMessage } from "lib/errorHandling";
import useSocket from "hooks/useSocket";
import { AnimatePresence } from "framer-motion";
const PlayTime = lazy(() => import("components/game/PlayTime"));
const GameResults = lazy(() => import("components/game/GameResults"));

const GameRoom = () => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [result, setResult] = useState<User[] | null>(null);
  const {
    space,
    participents,
    setParticipents,
    session,
    setSession,
    gameStatus,
    setGameStatus,
    setSelectedGameType,
    setGameSummary,
    setQuestionCounter,
    setHasEveryoneAnswered,
    resetGame,
    resetAll,
  } = useGameContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMessage = useCallback((data: any) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex flex-col flex-shrink-0 text-center overflow-hidden">
        <Suspense fallback={<LoaderCard />}>
          <AnimatePresence mode="wait">
            {gameStatus === GAME_STATUS.PRE_GAME ? (
              <WaitingRoom key={gameStatus} />
            ) : gameStatus === GAME_STATUS.GAME_OVER ? (
              <GameResults key={gameStatus} />
            ) : (
              <PlayTime
                key={gameStatus}
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
