import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!animationInProgress) {
      return;
    }
    const winnerIds = result.map((winner) => winner.id);
    const timeout = setTimeout(() => {
      // Increment the highlight index
      const nextHighlight = (currentHighlight + 1) % participents.length;
      setCurrentHighlight(nextHighlight);
      // Check if conditions are met to stop the animation
      if (winnerIds.includes(participents[nextHighlight].id)) {
        setAnimationInProgress(false);
      }
    }, 200); // Adjust time for faster or slower cycling

    return () => clearTimeout(timeout);
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
