import { useEffect, useState } from "react";
import QuestionTypeCard from "./QuestionTypeCard";
import { QuestionType, QuestionTypeResponse } from "models/responses";
import useCenteredCard from "hooks/useCenteredCard";

type props = {
  questionTypes: QuestionTypeResponse[];
  isLoading: boolean;
  startGame: (gameType: QuestionType) => void;
};
const CategorySlider = ({ questionTypes, isLoading, startGame }: props) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(0);
  const centeredIndex = useCenteredCard(".cat-slider", questionTypes.length);
  useEffect(() => {
    if (centeredIndex !== null) {
      setSelectedCategory(centeredIndex);
    }
  }, [centeredIndex, setSelectedCategory]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div
        dir="rtl"
        className="cat-slider flex gap-2 items-center snap-x snap-mandatory overflow-x-auto h-[40%] pb-2 flex-shrink-0"
      >
        {questionTypes.map((category, index) => {
          return (
            <div
              key={category.id}
              className={`${
                index === selectedCategory
                  ? "border-foreground"
                  : "border-card "
              }
            border-2 backdrop-blur-2xl rounded-lg h-full w-[90%] shrink-0  relative snap-center
            `}
            >
              <img
                src={category.picture}
                alt="category image"
                className="h-full w-full object-cover rounded-lg"
              />
              <h3 className="absolute bottom-0 left-0 right-0 backdrop-blur py-2 text-2xl font-bold">
                {category.name}
              </h3>
            </div>
          );
        })}
      </div>

      <div
        dir="rtl"
        className="flex gap-2 items-center snap-x snap-mandatory overflow-x-auto overflow-y-hidden h-[60%] w-full pb-2 flex-shrink-0"
      >
        {selectedCategory !== null &&
          questionTypes[selectedCategory].questionTypes.map((questionType) => {
            return (
              <QuestionTypeCard
                key={questionType.id}
                questionType={questionType}
                isLoading={isLoading}
                onClick={startGame}
              />
            );
          })}
      </div>
    </div>
  );
};

export default CategorySlider;
