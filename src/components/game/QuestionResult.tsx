import confetti from "canvas-confetti";
import CircularProgress from "components/ui/CircularProgress";
import GradientButton from "components/ui/GradientButton";
import { TOTAL_QUESTIONS } from "constants/gameRules";
import { useAuthContext } from "context/AuthContext";
import { User } from "models/user";
import { useEffect, useState } from "react";
import { useGameStore } from "context/gameStore";
import QuestionCard from "./QuestionCard";
import UserSlider from "./UserSlider";

type props = {
  result: User[] | null;
  showNextQuestion: () => void;
  loadingNextQuestion: boolean;
  finishGame: () => void;
  loadingFinishGame: boolean;
  questionCounter: number;
};

const TOTAL_ANIMATION_DURATION = 5000;
const CYCLE_INTERVAL = 300;

const showFireworks = () => {
  const colors = ["#FFFFFF", "#211134", "#97A9F6"];
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: colors,
  });
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: colors,
  });
};

const QuestionResult = ({
  result,
  showNextQuestion,
  loadingNextQuestion,
  finishGame,
  loadingFinishGame,
  questionCounter,
}: props) => {
  const [currentHighlight, setCurrentHighlight] = useState<number>(0);
  const [animationInProgress, setAnimationInProgress] = useState<boolean>(true);
  const { user } = useAuthContext();

  const participents = useGameStore((state) => state.participents);
  const getIsSessionAdmin = useGameStore((state) => state.getIsSessionAdmin);
  const isSessionAdmin = getIsSessionAdmin(user?.id);

  useEffect(() => {
    if (!result || !result?.length || !result[0]?.id) return;

    if (!animationInProgress || participents.length <= 1) {
      showFireworks();
      return;
    }

    const cycleTimeout = setInterval(() => {
      setCurrentHighlight(
        (prevHighlight) => (prevHighlight + 1) % participents.length
      );
    }, CYCLE_INTERVAL);

    const stopAnimationTimeout = setTimeout(() => {
      clearInterval(cycleTimeout);

      // Set the highlight to the winner
      const winnerId = result[0].id;
      const winnerIndex = participents.findIndex((p) => p.id === winnerId);
      setCurrentHighlight(winnerIndex);

      setAnimationInProgress(false);
      showFireworks();
    }, TOTAL_ANIMATION_DURATION);

    return () => {
      clearInterval(cycleTimeout);
      clearTimeout(stopAnimationTimeout);
      setCurrentHighlight(0);
    };
  }, [animationInProgress, participents, result]);

  const renderAdminButtons = () => {
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
  };
  return (
    <div className="flex flex-col gap-4 flex-1">
      <QuestionCard
        question={"והזוכה הגדול הוא היא הם"}
        renderButtons={isSessionAdmin ? renderAdminButtons : undefined}
      />
      <div
        dir="rtl"
        className="flex flex-col justify-center items-center flex-1 w-full flex-shrink-0"
      >
        {result?.[0]?.id ? (
          <div
            dir="rtl"
            className="flex-1 w-full flex flex-col justify-center bg-card rounded-lg p-2 border-2 border-card max-w-md"
          >
            <p>{"נראה שאף אחד לא הצביע..."}</p>
          </div>
        ) : (
          <UserSlider user={participents[currentHighlight]} />
        )}
      </div>
    </div>
  );
};

export default QuestionResult;
