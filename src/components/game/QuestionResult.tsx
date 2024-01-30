import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { User } from "models/user";
import QuestionCard from "./QuestionCard";
import UserSlider from "./UserSlider";

type props = {
  participents: User[];
  result: User[];
  showNextQuestion: () => void;
  loadingNextQuestion: boolean;
  finishGame: () => void;
  isAdmin: boolean;
};

const TOTAL_ANIMATION_DURATION = 5000;
const CYCLE_INTERVAL = 300;

const QuestionResult = ({
  participents,
  result,
  showNextQuestion,
  loadingNextQuestion,
  finishGame,
  isAdmin,
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
      const nextHighlight = (currentHighlight + 1) % participents.length;
      setCurrentHighlight(nextHighlight);
    }, CYCLE_INTERVAL);

    const stopAnimationTimeout = setTimeout(() => {
      clearInterval(cycleTimeout);
      setAnimationInProgress(false);

      // Set the highlight to the winner
      const winnerId = result[0].id;
      const winnerIndex = participents.findIndex((p) => p.id === winnerId);
      setCurrentHighlight(winnerIndex);
      showFireworks();
    }, TOTAL_ANIMATION_DURATION);

    return () => {
      clearInterval(cycleTimeout);
      clearTimeout(stopAnimationTimeout);
    };
  }, [currentHighlight, participents, result, animationInProgress]);

  const renderAdminButtons = () => {
    return (
      <Button onClick={showNextQuestion} disabled={loadingNextQuestion}>
        {loadingNextQuestion ? <CircularProgress /> : "הלאה נקסט"}
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
        className="flex justify-center items-center snap-x snap-mandatory overflow-x-auto h-[60%] w-full py-2 flex-shrink-0"
      >
        <UserSlider user={participents[currentHighlight]} />
      </div>

      {/* <div className="mt-auto flex flex-col gap-4">
        <Button onClick={finishGame}>{"סיים משחק"}</Button>
      </div> */}
    </div>
  );
};

export default QuestionResult;
