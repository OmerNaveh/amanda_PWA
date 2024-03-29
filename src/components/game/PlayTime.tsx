import { useMutation } from "react-query";
import { Question } from "models/game";
import { User } from "models/user";
import { getNextQuestion } from "services/apiClient";
import { useToast } from "components/ui/useToast";
import { useAuthContext } from "context/AuthContext";
import { useGameContext } from "context/GameContext";
import { getErrorMessage } from "lib/errorHandling";
import QuestionBoard from "./QuestionBoard";
import QuestionResult from "./QuestionResult";

type props = {
  question: Question;
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
  const { session, questionCounter } = useGameContext();
  const { toast } = useToast();

  const { mutate: TriggerNextQuestion, isLoading: loadingNextQuestion } =
    useMutation(() => getNextQuestion(session!.id), {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    });

  const nextQuestion = () => {
    TriggerNextQuestion();
  };

  if (!session || !user) return null;
  return (
    <>
      {!result ? (
        <QuestionBoard question={question} />
      ) : (
        <QuestionResult
          result={result}
          showNextQuestion={nextQuestion}
          loadingNextQuestion={loadingNextQuestion}
          finishGame={finishGame}
          loadingFinishGame={loadingFinishGame}
          isAdmin={String(session.adminId) === String(user.id)}
          questionCounter={questionCounter}
        />
      )}
    </>
  );
};

export default PlayTime;
