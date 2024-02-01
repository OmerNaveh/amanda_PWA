import { Question } from "models/game";
import { User } from "models/user";
import QuestionCard from "./QuestionCard";
import UserSlider from "./UserSlider";
import CountdownTimer from "./CountdownTimer";
import { useCallback } from "react";
import { useAuthContext } from "context/AuthContext";
import { useGameContext } from "context/GameContext";
type props = {
  question: Question;
  selectAnswer: (answer: User) => void;
  isLoading: boolean;
  showResult: () => void;
};
const CountdownTime = 15;

const QuestionBoard = ({
  question,
  selectAnswer,
  isLoading,
  showResult,
}: props) => {
  const { user } = useAuthContext();
  const { participents, questionCounter, selectedGameType, session } =
    useGameContext();

  const isAdmin = String(session?.adminId) === String(user?.id);
  const renderCountdown = useCallback(() => {
    const onCountdownComplete = isAdmin ? showResult : () => {};

    return (
      <CountdownTimer
        initialSeconds={CountdownTime}
        onCountdownComplete={onCountdownComplete}
      />
    );
  }, []);
  return (
    <div className="flex flex-col gap-4 h-full">
      <QuestionCard
        question={question.content}
        renderCountdown={renderCountdown}
      />

      <div
        dir="rtl"
        className={`flex gap-2 items-center snap-x snap-mandatory overflow-x-auto h-[50%] w-full py-2 flex-shrink-0
          ${participents.length === 1 && "justify-center"}`}
      >
        {participents.map((participant) => (
          <UserSlider
            key={participant.id}
            user={participant}
            onClick={selectAnswer}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionBoard;
