import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { User } from "models/user";
import QuestionCard from "./QuestionCard";
import UserSlider from "./UserSlider";
import { TOTAL_QUESTIONS } from "constants/gameRules";

type props = {
  participents: User[];
  result: User[];
  showNextQuestion: () => void;
  loadingNextQuestion: boolean;
  finishGame: () => void;
  loadingFinishGame: boolean;
  isAdmin: boolean;
  questionCounter: number;
};

const TOTAL_ANIMATION_DURATION = 5000;
const CYCLE_INTERVAL = 300;

const QuestionResult = ({
  participents,
  result,
  showNextQuestion,
  loadingNextQuestion,
  finishGame,
  loadingFinishGame,
  isAdmin,
  questionCounter,
}: props) => {
  const [currentHighlight, setCurrentHighlight] = useState<number>(0);
  const [animationInProgress, setAnimationInProgress] = useState<boolean>(true);
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
  useEffect(() => {
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
  }, [participents, result, animationInProgress]);

  const renderAdminButtons = () => {
    return questionCounter === TOTAL_QUESTIONS ? (
      <Button onClick={finishGame} disabled={loadingFinishGame}>
        {loadingFinishGame ? <CircularProgress /> : "לתוצאות"}
      </Button>
    ) : (
      <Button onClick={showNextQuestion} disabled={loadingNextQuestion}>
        {loadingNextQuestion ? <CircularProgress /> : "לשאלה הבאה"}
      </Button>
    );
  };
  return (
    <div className="flex flex-col gap-4 h-full">
      <QuestionCard
        question={"והזוכה הגדול הוא היא הם"}
        renderButtons={isAdmin ? renderAdminButtons : undefined}
      />
      <div
        dir="rtl"
        className="flex justify-center items-center snap-x snap-mandatory overflow-x-auto h-[50%] w-full py-2 flex-shrink-0"
      >
        <UserSlider user={participents[currentHighlight]} />
      </div>
    </div>
  );
};

export default QuestionResult;
