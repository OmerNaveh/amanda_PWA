import CircularProgress from "components/ui/CircularProgress";
import GradientButton from "components/ui/GradientButton";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { QuestionType } from "models/responses";
import { useRef } from "react";

type props = {
  questionType: QuestionType;
  isLoading: boolean;
  onClick: (gameType: QuestionType) => void;
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
      className="h-full w-full mx-auto max-w-md flex flex-col bg-card rounded-lg p-2 xs:p-4 gap-2 xs:gap-4 border-2 border-card overflow-hidden"
    >
      <div className="relative flex-1 w-full">
        <img
          src={questionType.picture}
          alt="question type"
          className="h-full w-full object-cover rounded-lg"
        />
        <h5 className="absolute bottom-0 left-0 right-0 bg-black/70 rounded-b-lg py-1 sm:py-1.5 md:py-2 text-base sm:text-lg md:text-xl font-bold text-center">
          {questionType.name}
        </h5>
      </div>
      <p className="text-sm xs:text-base text-center text-white/80 line-clamp-3 xs:line-clamp-4">
        {questionType.description}
      </p>

      <GradientButton
        variant="primary"
        type="button"
        disabled={isLoading}
        onClick={() => {
          onClick(questionType);
        }}
        className={`mt-auto transition-opacity duration-500 ${
          isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {isLoading ? (
          <CircularProgress wrapperClassName="h-7" />
        ) : (
          <p className="text-xl font-semibold text-center tracking-wider">
            {"התחל"}
          </p>
        )}
      </GradientButton>
    </div>
  );
};

export default QuestionTypeCard;
