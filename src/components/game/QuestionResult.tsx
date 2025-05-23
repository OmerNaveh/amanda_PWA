import CircularProgress from "components/ui/CircularProgress";
import GradientButton from "components/ui/GradientButton";
import { TOTAL_QUESTIONS } from "constants/gameRules";
import { useAuthContext } from "context/AuthContext";
import { User } from "models/user";
import { useGameStore } from "context/gameStore";
import QuestionCard from "./QuestionCard";
import UserSlider from "./UserSlider";
import useHighlightWinner from "hooks/useHighlightWinner";
import { Question } from "models/game";
import { useCallback } from "react";

type props = {
  result: User[] | null;
  showNextQuestion: () => void;
  loadingNextQuestion: boolean;
  finishGame: () => void;
  loadingFinishGame: boolean;
  questionCounter: number;
  question?: Question | null;
};

const QuestionResult = ({
  result,
  showNextQuestion,
  loadingNextQuestion,
  finishGame,
  loadingFinishGame,
  questionCounter,
  question,
}: props) => {
  const { user } = useAuthContext();

  const participents = useGameStore((state) => state.participents);
  const getIsSessionAdmin = useGameStore((state) => state.getIsSessionAdmin);
  const isSessionAdmin = getIsSessionAdmin(user?.id);

  const { currentHighlight } = useHighlightWinner(result, participents);

  const winnerId = result?.[0]?.id;

  const renderAdminButtons = useCallback(() => {
    return questionCounter === TOTAL_QUESTIONS ? (
      <GradientButton
        className="w-full"
        onClick={finishGame}
        disabled={loadingFinishGame}
      >
        {loadingFinishGame ? <CircularProgress /> : "לתוצאות"}
      </GradientButton>
    ) : (
      <GradientButton
        className="w-full"
        onClick={showNextQuestion}
        disabled={loadingNextQuestion}
      >
        {loadingNextQuestion ? <CircularProgress /> : "לשאלה הבאה"}
      </GradientButton>
    );
  }, [
    finishGame,
    loadingFinishGame,
    loadingNextQuestion,
    questionCounter,
    showNextQuestion,
  ]);

  return (
    <div className="flex flex-col gap-4 flex-1">
      <QuestionCard
        question={question?.content || "והזוכה הגדול הוא היא הם"}
        renderButtons={isSessionAdmin ? renderAdminButtons : undefined}
      />
      <div dir="rtl" className="flex flex-col flex-1 w-full">
        {!winnerId ? (
          <div
            dir="rtl"
            className="flex-1 w-full flex flex-col justify-center max-w-md mx-auto"
          >
            <p className="text-lg font-semibold">
              {"נראה שאף אחד לא הצביע..."}
            </p>
          </div>
        ) : (
          <UserSlider user={participents[currentHighlight]} />
        )}
      </div>
    </div>
  );
};

export default QuestionResult;
