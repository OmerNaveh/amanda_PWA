import React, { useEffect, useState } from "react";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { User } from "models/user";

type props = {
  participents: User[];
  result: User[];
  showNextQuestion: () => void;
  loadingNextQuestion: boolean;
  finishGame: () => void;
};

const QuestionResult = ({
  participents,
  result,
  showNextQuestion,
  loadingNextQuestion,
  finishGame,
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

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{"והזוכה הגדול הוא היא הם"}</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 max-h-64 overflow-y-auto">
          {participents.map((participant, index) => (
            <div
              key={participant.id}
              className={`p-4 rounded-lg transition duration-500`}
              style={{
                backgroundColor:
                  currentHighlight === index
                    ? `rgb(${participant.color})`
                    : "rgb(75 85 99)",
              }}
            >
              {participant.name}
            </div>
          ))}
        </div>
        {animationInProgress === false && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">
              {result.length >= 2 ? "הזוכים" : "הזוכה"}:
            </h3>
            <ul>
              {result.map((winner) => (
                <li
                  key={winner.id}
                  className="mt-2 p-2"
                  style={{
                    backgroundColor: winner.id ? `rgb(${winner.color})` : "",
                  }}
                >
                  {winner.name}
                </li>
              ))}
            </ul>
            <h4 className="text-lg mt-4">{"תורך לשתות"}</h4>
          </div>
        )}
      </div>
      <div className="mt-auto flex flex-col gap-4">
        <Button onClick={showNextQuestion} disabled={loadingNextQuestion}>
          {loadingNextQuestion ? <CircularProgress /> : "הלאה נקסט"}
        </Button>
        <Button onClick={finishGame}>{"סיים משחק"}</Button>
      </div>
    </div>
  );
};

export default QuestionResult;
