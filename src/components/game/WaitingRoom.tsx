import CircularProgress from "components/ui/CircularProgress";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { getQuestionTypes, startSession } from "services/apiClient";
import CategorySlider from "./CategorySlider";
import QuestionCard from "./QuestionCard";

type props = {
  spaceId: number;
  userId: number;
};
const WaitingRoom = ({ spaceId, userId }: props) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(0);
  const { data: questionTypes, isLoading: loadingQuestionTypes } = useQuery({
    queryKey: "questionTypes",
    queryFn: () => getQuestionTypes(),
  });
  const { mutate, isLoading } = useMutation(
    (questionTypeId?: number) =>
      startSession({
        spaceId,
        userId,
        questionTypeId,
      }),
    {}
  );
  const startGame = (questionTypeId?: number) => {
    mutate(questionTypeId);
  };
  return (
    <div className="flex flex-col text-center gap-4 h-full">
      {loadingQuestionTypes ? (
        <div className="h-full w-full flex flex-col">
          <QuestionCard question="כבר מתחילים את הערב" />
          <CircularProgress wrapperClassName="my-auto" className="h-12 w-12" />
        </div>
      ) : !!questionTypes ? (
        <CategorySlider
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          questionTypes={questionTypes}
          isLoading={isLoading}
          startGame={startGame}
        />
      ) : (
        <div className="h-full w-full flex justify-center items-center px-4">
          <p className="text-center text-4xl">
            {"סעמק משהו השתבש, יאללה תלחצו על ריפרש"}
          </p>
        </div>
      )}
    </div>
  );
};

export default WaitingRoom;
