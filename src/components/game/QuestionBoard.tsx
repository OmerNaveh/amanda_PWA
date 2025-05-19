import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "react-query";
import { GAME_STATUS, Question } from "models/game";
import { User } from "models/user";
import QuestionCard from "./QuestionCard";
import UserSlider from "./UserSlider";
import CountdownTimer from "./CountdownTimer";
import { useAuthContext } from "context/AuthContext";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { answerQuestion, getQuestionResult } from "services/apiClient";
import { getErrorMessage } from "lib/errorHandling";
import { useToast } from "components/ui/useToast";
import Carousel from "components/ui/Carousel";
import { useGameStore } from "context/gameStore";
type props = {
  question?: Question | null;
};
const COUNTDOWN_TIME = 30;

const QuestionBoard = ({ question }: props) => {
  const [currentAnswerSelection, setCurrentAnswerSelection] =
    useState<User | null>(null);
  const { user } = useAuthContext();

  const participents = useGameStore((state) => state.participents);
  const session = useGameStore((state) => state.session);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const setGameStatus = useGameStore((state) => state.setGameStatus);
  const hasEveryoneAnswered = useGameStore(
    (state) => state.hasEveryoneAnswered
  );
  const setHasEveryoneAnswered = useGameStore(
    (state) => state.setHasEveryoneAnswered
  );
  const getIsSessionAdmin = useGameStore((state) => state.getIsSessionAdmin);
  const isSessionAdmin = getIsSessionAdmin(user?.id);
  const { toast } = useToast();

  const { mutate: TriggerSelectingAnswer, isLoading: loadingAnswerSelection } =
    useMutation(
      ({
        selection,
        userId,
        questionId,
      }: {
        selection: User;
        userId: number;
        questionId: number;
      }) => answerQuestion(session!.id, userId, questionId, selection.id),
      {
        onSuccess: (data, { selection }) => {
          setCurrentAnswerSelection(selection);
          setGameStatus(GAME_STATUS.WAITING_FOR_ANSWERS);
        },
        onError: (err) => {
          toast({ title: getErrorMessage(err), variant: "destructive" });
        },
      }
    );

  const { mutate: TriggerShowResult, isLoading: showAnswerResultLoading } =
    useMutation(
      ({ questionId }: { questionId: number }) =>
        getQuestionResult(session!.id, questionId),
      {
        onError: (err) => {
          toast({ title: getErrorMessage(err), variant: "destructive" });
        },
      }
    );

  const selectAnswer = useCallback(
    (answer: User) => {
      if (currentAnswerSelection) return;
      if (!user || !question) {
        toast({
          description: "נראה שיש לנו בעיה, אנא נסה לצאת ולהיכנס שוב למשחק",
          variant: "destructive",
        });
        return;
      }

      TriggerSelectingAnswer({
        selection: answer,
        userId: user.id,
        questionId: question.id,
      });
    },
    [currentAnswerSelection, user, question, TriggerSelectingAnswer, toast]
  );

  const showResult = useCallback(() => {
    if (showAnswerResultLoading) return;
    if (!question) {
      toast({
        description: "נראה שיש לנו בעיה, אנא נסה לצאת ולהיכנס שוב למשחק",
        variant: "destructive",
      });
      return;
    }

    TriggerShowResult({ questionId: question.id });
  }, [TriggerShowResult, question, showAnswerResultLoading, toast]);

  const renderCountdown = useCallback(() => {
    const onCountdownComplete = isSessionAdmin ? showResult : () => {};

    return (
      <CountdownTimer
        initialSeconds={COUNTDOWN_TIME}
        onCountdownComplete={onCountdownComplete}
      />
    );
  }, [isSessionAdmin, showResult]);

  const rennderAdminButtons = () => {
    return (
      <Button
        disabled={showAnswerResultLoading}
        onClick={showResult}
        className="px-4"
      >
        {showAnswerResultLoading ? <CircularProgress /> : <p>{"הצג תוצאות"}</p>}
      </Button>
    );
  };

  // Trigger Show result when everyone answered - only for admin
  useEffect(() => {
    if (
      hasEveryoneAnswered &&
      gameStatus === GAME_STATUS.WAITING_FOR_ANSWERS &&
      isSessionAdmin
    ) {
      showResult();
      setHasEveryoneAnswered(false);
    }
  }, [
    hasEveryoneAnswered,
    gameStatus,
    isSessionAdmin,
    showResult,
    setHasEveryoneAnswered,
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col flex-1 gap-4"
    >
      <QuestionCard
        question={
          gameStatus === GAME_STATUS.WAITING_FOR_ANSWERS || !question
            ? "נחכה שכולם יענו"
            : question.content
        }
        renderCountdown={!!question ? renderCountdown : undefined}
        renderButtons={
          gameStatus === GAME_STATUS.WAITING_FOR_ANSWERS && !!isSessionAdmin
            ? rennderAdminButtons
            : undefined
        }
      />

      {gameStatus === GAME_STATUS.WAITING_FOR_ANSWERS &&
      !!currentAnswerSelection ? (
        <div
          dir="rtl"
          className="flex justify-center items-center w-full flex-shrink-0"
        >
          <UserSlider user={currentAnswerSelection} />
        </div>
      ) : gameStatus === GAME_STATUS.WAITING_FOR_ANSWERS && !question ? (
        <div
          dir="rtl"
          className="flex justify-center items-center w-full flex-shrink-0"
        >
          <Carousel
            cards={participents.map((participant) => (
              <UserSlider key={participant.id} user={participant} />
            ))}
          />
        </div>
      ) : (
        <div
          dir="rtl"
          className={`flex flex-col w-full flex-shrink-0
          ${participents.length === 1 && "justify-center"}`}
        >
          <Carousel
            cards={participents.map((participant) => (
              <UserSlider
                key={participant.id}
                user={participant}
                onClick={selectAnswer}
                isLoading={loadingAnswerSelection}
              />
            ))}
            className="w-full py-2"
          />
        </div>
      )}
    </motion.div>
  );
};

export default QuestionBoard;
