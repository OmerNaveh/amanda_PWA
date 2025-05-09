import QuestionTypeCard from "./QuestionTypeCard";
import { QuestionType, QuestionTypeResponse } from "models/responses";
import Carousel from "components/ui/Carousel";

type props = {
  questionTypes?: QuestionTypeResponse;
  isLoading: boolean;
  startGame: (gameType: QuestionType) => void;
};
const CategorySlider = ({ questionTypes, isLoading, startGame }: props) => {
  if (!questionTypes?.length) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <h3 className="font-bold text-xl">{"טוען..."}</h3>
      </div>
    );
  }
  return (
    <div className="flex flex-col overflow-hidden">
      <h3 className="font-bold text-xl">{"בחרו את סוג המשחק"}</h3>

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
