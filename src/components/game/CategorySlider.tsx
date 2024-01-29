import React, { useEffect } from "react";
import QuestionTypeCard from "./QuestionTypeCard";
import { QuestionTypeResponse } from "models/responses";
import useCenteredCard from "hooks/useCenteredCard";

type props = {
  questionTypes: QuestionTypeResponse[];
  selectedCategory: number | null;
  setSelectedCategory: React.Dispatch<React.SetStateAction<number | null>>;
  isLoading: boolean;
  startGame: (questionTypeId?: number) => void;
};
const CategorySlider = ({
  questionTypes,
  selectedCategory,
  setSelectedCategory,
  isLoading,
  startGame,
}: props) => {
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
        className="cat-slider flex gap-2 items-center snap-x snap-mandatory overflow-x-auto h-[40%] py-2 flex-shrink-0"
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
            border-2 backdrop-blur-2xl rounded-lg h-full aspect-video relative snap-center
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
        className="flex gap-2 items-center snap-x snap-mandatory overflow-x-auto h-[60%] w-full py-2 flex-shrink-0"
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
