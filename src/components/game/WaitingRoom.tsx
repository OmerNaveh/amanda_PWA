import { useMutation, useQuery } from "react-query";
import { motion } from "framer-motion";
import { getQuestionTypes, startSession } from "services/apiClient";
import CategorySlider from "./CategorySlider";
import { useGameContext } from "context/GameContext";
import { useAuthContext } from "context/AuthContext";
import LoaderCard from "./LoaderCard";
import { QuestionType } from "models/responses";
import { useToast } from "components/ui/useToast";
import { getErrorMessage } from "lib/errorHandling";

const WaitingRoom = () => {
  const { space, setSelectedGameType } = useGameContext();
  const { user } = useAuthContext();
  const { toast } = useToast();
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
      onError: (error) => {
        toast({ description: getErrorMessage(error), variant: "destructive" });
      },
    }
  );
  const startGame = (gameType: QuestionType) => {
    mutate(gameType);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col text-center"
    >
      {loadingQuestionTypes ? (
        <LoaderCard />
      ) : (
        <CategorySlider
          questionTypes={questionTypes}
          isLoading={isLoading}
          startGame={startGame}
        />
      )}
    </motion.div>
  );
};

export default WaitingRoom;
