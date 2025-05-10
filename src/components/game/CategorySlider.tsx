import QuestionTypeCard from "./QuestionTypeCard";
import { QuestionType, QuestionTypeResponse } from "models/responses";
import Carousel from "components/ui/Carousel";
import CircularProgress from "components/ui/CircularProgress";

type props = {
  questionTypes?: QuestionTypeResponse;
  isLoading: boolean;
  startGame: (gameType: QuestionType) => void;
};
const CategorySlider = ({ questionTypes, isLoading, startGame }: props) => {
  if (!questionTypes?.length) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center gap-4">
        <h3 dir="rtl" className="font-bold text-xl">
          {"טוען..."}
        </h3>
        <CircularProgress className="h-12 w-12" />
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
