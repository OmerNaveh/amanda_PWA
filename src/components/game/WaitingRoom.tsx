import { useMutation, useQuery } from "react-query";
import { motion } from "framer-motion";
import { getQuestionTypes, startSession } from "services/apiClient";
import CategorySlider from "./CategorySlider";
import { useGameStore } from "store/gameStore";
import { useAuthContext } from "context/AuthContext";
import { QuestionType } from "models/responses";
import { useToast } from "components/ui/useToast";
import { getErrorMessage } from "lib/errorHandling";
import { useCallback } from "react";
import Loader from "./Loader";

const WaitingRoom = () => {
  const space = useGameStore((state) => state.space);
  const setSelectedGameType = useGameStore(
    (state) => state.setSelectedGameType
  );

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

  const startGame = useCallback(
    (gameType: QuestionType) => {
      mutate(gameType);
    },
    [mutate]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col text-center"
    >
      {loadingQuestionTypes ? (
        <Loader />
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
