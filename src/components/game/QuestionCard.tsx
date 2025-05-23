import { HTMLProps, ReactNode } from "react";
import { cn } from "lib/utils";
import { TOTAL_QUESTIONS } from "constants/gameRules";
import { useGameStore } from "context/gameStore";

type props = {
  question: string;
  className?: HTMLProps<HTMLElement>["className"];
  renderButtons?: () => ReactNode;
  renderCountdown?: () => ReactNode;
};
const QuestionCard = ({
  className,
  question,
  renderButtons,
  renderCountdown,
}: props) => {
  const selectedGameType = useGameStore((state) => state.selectedGameType);
  const questionCounter = useGameStore((state) => state.questionCounter);

  return (
    <div
      dir="rtl"
      className={cn(
        "flex-1 shrink-0 bg-card border-[1.5px] border-card bg-blend-overlay p-4 rounded-2xl flex flex-col gap-2 relative max-w-md mx-auto w-full",
        className
      )}
    >
      {!!selectedGameType && !!questionCounter && (
        <div className="w-full flex flex-col">
          <h2 className="text-lg font-bold text-center line-clamp-2">
            {selectedGameType.name}
          </h2>
          <p className="text-center text-xs">
            {questionCounter}/{TOTAL_QUESTIONS}
          </p>
        </div>
      )}

      <h3 className="text-2xl font-bold text-center line-clamp-3 my-auto">
        {question}
      </h3>
      {!!renderButtons && (
        <div className="flex mt-auto justify-between gap-4 w-full" dir="rtl">
          {renderButtons()}
        </div>
      )}
      {!!renderCountdown && (
        <div className="absolute -bottom-3 right-0 left-0">
          {renderCountdown()}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
