import { Suspense, lazy, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GAME_STATUS, Question } from "models/game";
import { PUBNUB_MESSAGE, PUBNUB_MESSAGE_TYPE } from "models/pubnub";
import { User } from "models/user";
import usePubnub from "hooks/usePubnub";
import { useAuthContext } from "context/AuthContext";
import { useGameContext } from "context/GameContext";
import ParticipentsBottomSheet from "components/game/ParticipentsBottomSheet";
import WaitingRoom from "components/game/WaitingRoom";
import LoaderCard from "components/game/LoaderCard";
import { useMutation } from "react-query";
import { endGame } from "services/apiClient";
import { useToast } from "components/ui/useToast";
import { getErrorMessage } from "lib/errorHandling";
import useSocket from "hooks/usePubnub";
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
    resetGame,
  } = useGameContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleMessage = useCallback((data: any) => {
    const pubnubData = data?.data as PUBNUB_MESSAGE;

    switch (pubnubData.type) {
      case PUBNUB_MESSAGE_TYPE.JOIN:
        if (user?.id === pubnubData.user.id || !pubnubData?.users?.length)
          return;
        setParticipents(pubnubData.users);
        break;
      case PUBNUB_MESSAGE_TYPE.LEAVE:
        setParticipents((prev) => {
          if (!prev.length) return prev;
          if (pubnubData.user.id === user?.id) return prev;
          return prev.filter(
            (participent) => participent.id !== pubnubData.user.id
          );
        });
        break;
      case PUBNUB_MESSAGE_TYPE.START_GAME:
        setGameStatus(GAME_STATUS.SHOWING_QUESTION);
        setQuestionCounter(1);
        setResult(null);
        setSession(pubnubData.session);
        setQuestion(pubnubData.question);
        setSelectedGameType(pubnubData.category);
        setParticipents(pubnubData.users);
        setGameSummary([]);
        break;
      case PUBNUB_MESSAGE_TYPE.END_GAME:
        setQuestion(null);
        setResult(null);
        setSession(null);
        setGameStatus(GAME_STATUS.GAME_OVER);
        setGameSummary(pubnubData.users);
        break;
      case PUBNUB_MESSAGE_TYPE.NEXT_QUESTION:
        setQuestionCounter((prev) => prev + 1);
        setGameStatus(GAME_STATUS.SHOWING_QUESTION);
        setParticipents(pubnubData.users);
        setResult(null);
        setQuestion(pubnubData.question);
        break;
      case PUBNUB_MESSAGE_TYPE.NEXT_RESULT:
        setResult(pubnubData.users);
        setGameStatus(GAME_STATUS.SHOWING_RESULT);
        break;
      case PUBNUB_MESSAGE_TYPE.BACK_TO_OPTIONS:
        resetGame();
        break;
    }
  }, []);

  const { sendMessage } = useSocket({ handleMessage, channel: space?.channel });
  const { mutate: TriggerEndingGame, isLoading: loadingFinishGame } =
    useMutation(() => endGame(session!.id), {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    });
  const finishGame = () => {
    TriggerEndingGame();
  };

  useEffect(() => {
    if (!space || !user) {
      navigate("/");
      return;
    }
  }, []);

  if (!space || !user) return null;
  return (
    <div className="page-height w-full flex flex-col">
      <div className="flex flex-col flex-shrink-0 text-center gap-4 px-4 h-[calc(100%-4rem)]">
        <Suspense fallback={<LoaderCard />}>
          {gameStatus === GAME_STATUS.PRE_GAME ? (
            <WaitingRoom />
          ) : gameStatus === GAME_STATUS.GAME_OVER ? (
            <GameResults />
          ) : (
            <PlayTime
              question={question}
              result={result}
              finishGame={finishGame}
              loadingFinishGame={loadingFinishGame}
            />
          )}
        </Suspense>
      </div>
      {!!participents.length && (
        <ParticipentsBottomSheet
          resetGame={resetGame}
          finishGame={finishGame}
          loadingFinishGame={loadingFinishGame}
        />
      )}
    </div>
  );
};

export default GameRoom;
