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
  const [winners, setWinners] = useState<User[]>([]);

  useEffect(() => {
    const cycleParticipants = setTimeout(() => {
      setCurrentHighlight((prev) => (prev + 1) % participents.length);
    }, 200); // Adjust time for faster or slower cycling

    if (winners.length > 0) {
      clearTimeout(cycleParticipants);
    }

    return () => clearTimeout(cycleParticipants);
  }, [currentHighlight, participents.length, winners]);

  useEffect(() => {
    const announceWinners = setTimeout(() => {
      setWinners(result);
    }, participents.length * 500); // Adjust timing based on the number of participants

    return () => clearTimeout(announceWinners);
  }, [participents.length, result]);

  const isWinner = (userId: number) =>
    winners.some((winner) => winner.id === userId);

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Round Winner</h2>
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
        {winners.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold">
              {winners.length >= 2 ? "Winners" : "Winner"}:
            </h3>
            <ul>
              {winners.map((winner) => (
                <li
                  key={winner.id}
                  className="mt-2 p-2"
                  style={{
                    backgroundColor: isWinner(winner.id)
                      ? `rgb(${winner.color})`
                      : "",
                  }}
                >
                  {winner.name}
                </li>
              ))}
            </ul>
            <h4 className="text-lg mt-4">It's your turn to drink</h4>
          </div>
        )}
      </div>
      <div className="mt-auto flex flex-col gap-4">
        <Button onClick={showNextQuestion} disabled={loadingNextQuestion}>
          {loadingNextQuestion ? <CircularProgress /> : "Next Question"}
        </Button>
        <Button onClick={finishGame}>End Game</Button>
      </div>
    </div>
  );
};

export default QuestionResult;
