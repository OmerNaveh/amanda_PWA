import { useMutation } from "react-query";
import { motion } from "framer-motion";
import { GAME_STATUS, Question } from "models/game";
import { User } from "models/user";
import { getNextQuestion } from "services/apiClient";
import { useToast } from "components/ui/useToast";
import { useAuthContext } from "context/AuthContext";
import { useGameStore } from "context/gameStore";
import { getErrorMessage } from "lib/errorHandling";
import QuestionBoard from "./QuestionBoard";
import QuestionResult from "./QuestionResult";
import { useCallback } from "react";

type props = {
  question?: Question | null;
  result: User[] | null;
  finishGame: () => void;
  loadingFinishGame: boolean;
};
const PlayTime = ({
  question,
  result,
  finishGame,
  loadingFinishGame,
}: props) => {
  const { user } = useAuthContext();
  const session = useGameStore((state) => state.session);
  const questionCounter = useGameStore((state) => state.questionCounter);
  const gameStatus = useGameStore((state) => state.gameStatus);

  const { toast } = useToast();

  const { mutate: TriggerNextQuestion, isLoading: loadingNextQuestion } =
    useMutation(() => getNextQuestion(session!.id), {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    });

  const nextQuestion = useCallback(() => {
    TriggerNextQuestion();
  }, [TriggerNextQuestion]);

  if (!user) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col flex-1"
    >
      {gameStatus !== GAME_STATUS.SHOWING_RESULT ? (
        <QuestionBoard key={"questionBoard"} question={question} />
      ) : (
        <QuestionResult
          key={"questionResult"}
          result={result}
          showNextQuestion={nextQuestion}
          loadingNextQuestion={loadingNextQuestion}
          finishGame={finishGame}
          loadingFinishGame={loadingFinishGame}
          questionCounter={questionCounter}
          question={question}
        />
      )}
    </motion.div>
  );
};

export default PlayTime;
