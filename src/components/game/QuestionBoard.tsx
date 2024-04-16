import { useCallback, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { GAME_STATUS, Question } from "models/game";
import { User } from "models/user";
import QuestionCard from "./QuestionCard";
import UserSlider from "./UserSlider";
import CountdownTimer from "./CountdownTimer";
import { useAuthContext } from "context/AuthContext";
import { useGameContext } from "context/GameContext";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { answerQuestion, getQuestionResult } from "services/apiClient";
import { getErrorMessage } from "lib/errorHandling";
import { useToast } from "components/ui/useToast";
import { Carousel } from "components/ui/Carousel";
type props = {
  question?: Question | null;
};
const CountdownTime = 15;

const QuestionBoard = ({ question }: props) => {
  const [currentAnswerSelection, setCurrentAnswerSelection] =
    useState<User | null>(null);
  const { user } = useAuthContext();
  const {
    participents: part,
    session,
    gameStatus,
    setGameStatus,
  } = useGameContext();
  const { toast } = useToast();

  const participents = useMemo(() => {
    return part;
  }, []);
  const { mutate: TriggerSelectingAnswer, isLoading: loadingAnswerSelection } =
    useMutation(
      (selection: User) =>
        answerQuestion(session!.id, user!.id, question!.id, selection.id),
      {
        onSuccess: (data, selection) => {
          setCurrentAnswerSelection(selection);
          setGameStatus(GAME_STATUS.WAITING_FOR_ANSWERS);
        },
        onError: (err) => {
          toast({ title: getErrorMessage(err), variant: "destructive" });
        },
      }
    );

  const { mutate: TriggerShowResult, isLoading: showAnswerResultLoading } =
    useMutation(() => getQuestionResult(session!.id, question!.id), {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    });
  const selectAnswer = (answer: User) => {
    TriggerSelectingAnswer(answer);
  };
  const showResult = () => {
    TriggerShowResult();
  };

  const isAdmin = String(session?.adminId) === String(user?.id);
  const renderCountdown = useCallback(() => {
    const onCountdownComplete = isAdmin ? showResult : () => {};

    return (
      <CountdownTimer
        initialSeconds={CountdownTime}
        onCountdownComplete={onCountdownComplete}
      />
    );
  }, [gameStatus]);
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
  return (
    <div className="flex flex-col gap-4 h-full">
      <QuestionCard
        question={
          gameStatus === GAME_STATUS.WAITING_FOR_ANSWERS || !question
            ? "נחכה שכולם יענו"
            : question.content
        }
        renderCountdown={!!question ? renderCountdown : undefined}
        renderButtons={
          gameStatus === GAME_STATUS.WAITING_FOR_ANSWERS && !!isAdmin
            ? rennderAdminButtons
            : undefined
        }
      />
      {gameStatus === GAME_STATUS.WAITING_FOR_ANSWERS &&
      !!currentAnswerSelection ? (
        <div
          dir="rtl"
          className="flex justify-center items-center snap-x snap-mandatory overflow-x-auto h-[50%] w-full flex-shrink-0"
        >
          <UserSlider user={currentAnswerSelection} />
        </div>
      ) : gameStatus === GAME_STATUS.WAITING_FOR_ANSWERS && !question ? (
        <div
          dir="rtl"
          className="flex justify-center items-center snap-x snap-mandatory overflow-x-auto h-[50%] w-full flex-shrink-0"
        >
          <Carousel
            cards={participents.map((participant) => (
              <UserSlider key={participant.id} user={participant} />
            ))}
            className="w-full py-0"
          />
        </div>
      ) : (
        <div
          dir="rtl"
          className={`flex gap-2 items-center snap-x snap-mandatory overflow-x-auto h-[50%] w-full flex-shrink-0
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
            className="w-full py-0"
          />
        </div>
      )}
    </div>
  );
};

export default QuestionBoard;
