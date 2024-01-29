import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { QuestionType } from "models/responses";
import React, { useRef } from "react";

type props = {
  questionType: QuestionType;
  isLoading: boolean;
  onClick: (id: number) => void;
};
const QuestionTypeCard = ({ questionType, isLoading, onClick }: props) => {
  const cardRef = useRef(null);
  const isVisible = useIntersectionObserver(cardRef, {
    root: null, // Observe intersection relative to the viewport
    threshold: 0.6, // 60% visibility
  });
  return (
    <div
      ref={cardRef}
      key={questionType.id}
      className="h-full aspect-square flex flex-col bg-card rounded-lg p-2 gap-2 border-2 border-card snap-center"
    >
      <div className="relative h-[40%] w-full">
        <img
          src={questionType.picture}
          alt="question type image"
          className="h-full w-full object-cover rounded-lg"
        />
        <h5 className="absolute bottom-0 left-0 right-0 backdrop-blur py-1 text-base font-bold">
          {questionType.name}
        </h5>
      </div>
      <p className="text-sm text-center text-white/80 line-clamp-4">
        {questionType.description}
      </p>

      <Button
        disabled={isLoading || !!questionType?.isSubscriptionBased}
        onClick={() => {
          onClick(questionType.id);
        }}
        className={`mt-auto transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <p className="text-xl font-semibold text-center tracking-wider">
            {"שחק"}
          </p>
        )}
      </Button>
    </div>
  );
};

export default QuestionTypeCard;
