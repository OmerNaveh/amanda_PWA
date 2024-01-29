import { HTMLProps, ReactNode } from "react";
import { cn } from "lib/utils";

type props = {
  question: string;
  className?: HTMLProps<HTMLElement>["className"];
  renderButtons?: () => ReactNode;
};
const QuestionCard = ({ className, question, renderButtons }: props) => {
  return (
    <div
      dir="rtl"
      className={cn(
        "h-[50%] bg-card border-[1.5px] border-card bg-blend-overlay p-4 rounded-2xl flex flex-col justify-center relative",
        className
      )}
    >
      <h3 className="text-2xl font-bold text-center line-clamp-4">
        {question}
      </h3>
      {!!renderButtons && (
        <div
          className="flex absolute bottom-4 right-0 left-0 justify-between px-4 gap-4 w-full"
          dir="rtl"
        >
          {renderButtons()}
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
