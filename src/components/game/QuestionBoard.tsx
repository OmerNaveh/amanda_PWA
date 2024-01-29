import { Question } from "models/game";
import { User } from "models/user";
import QuestionCard from "./QuestionCard";
import UserSlider from "./UserSlider";
type props = {
  participents: User[];
  question: Question;
  selectAnswer: (answer: User) => void;
  isLoading: boolean;
};
const QuestionBoard = ({
  question,
  participents,
  selectAnswer,
  isLoading,
}: props) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <QuestionCard question={question.content} />

      <div
        dir="rtl"
        className="flex gap-2 items-center snap-x snap-mandatory overflow-x-auto h-[60%] w-full py-2 flex-shrink-0"
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
