import { useMutation, useQuery } from "react-query";
import { getQuestionTypes, startSession } from "services/apiClient";
import CategorySlider from "./CategorySlider";
import { useGameContext } from "context/GameContext";
import { useAuthContext } from "context/AuthContext";
import LoaderCard from "./LoaderCard";
import { QuestionType } from "models/responses";

const WaitingRoom = () => {
  const { space, setSelectedGameType } = useGameContext();
  const { user } = useAuthContext();
  const { data: questionTypes, isLoading: loadingQuestionTypes } = useQuery({
    queryKey: "questionTypes",
    queryFn: () => getQuestionTypes(),
  });
  const { mutate, isLoading } = useMutation(
    (questionType: QuestionType) =>
      startSession({
        spaceId: space?.id!,
        userId: user?.id!,
        questionTypeId: questionType.id,
      }),
    {
      onSuccess: (data) => {
        setSelectedGameType(data.questionType);
      },
    }
  );
  const startGame = (gameType: QuestionType) => {
    mutate(gameType);
  };
  return (
    <div className="flex flex-col text-center h-full">
      {loadingQuestionTypes ? (
        <LoaderCard />
      ) : !!questionTypes ? (
        <CategorySlider
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
