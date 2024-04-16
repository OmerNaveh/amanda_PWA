import QuestionTypeCard from "./QuestionTypeCard";
import { QuestionType, QuestionTypeResponse } from "models/responses";
import { Carousel } from "components/ui/Carousel";

type props = {
  questionTypes: QuestionTypeResponse;
  isLoading: boolean;
  startGame: (gameType: QuestionType) => void;
};
const CategorySlider = ({ questionTypes, isLoading, startGame }: props) => {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <h3 className="font-bold text-2xl">{"בחרו את סוג המשחק"}</h3>

      <Carousel
        cards={questionTypes.map((questionType) => {
          return (
            <QuestionTypeCard
              key={questionType.id}
              questionType={questionType}
              isLoading={isLoading}
              onClick={startGame}
            />
          );
        })}
      />
    </div>
  );
};

export default CategorySlider;
