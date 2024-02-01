import { useState } from "react";
import { useMutation } from "react-query";
import { GAME_STATUS, Question } from "models/game";
import { User } from "models/user";
import QuestionBoard from "./QuestionBoard";
import {
  answerQuestion,
  getNextQuestion,
  getQuestionResult,
} from "services/apiClient";
import { useToast } from "components/ui/useToast";
import { getErrorMessage } from "lib/errorHandling";
import Loader from "./WaitForEveryoneToAnswer";
import QuestionResult from "./QuestionResult";
import { useAuthContext } from "context/AuthContext";
import { useGameContext } from "context/GameContext";

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
  const [currentAnswerSelection, setCurrentAnswerSelection] =
    useState<User | null>(null);
  const { user } = useAuthContext();
  const { session, participents, gameStatus, setGameStatus, questionCounter } =
    useGameContext();
  const { toast } = useToast();
  const { mutate: TriggerSelectingAnswer, isLoading: loadingAnswerSelection } =
    useMutation(
      (selection: User) =>
        answerQuestion(session!.id, user!.id, question.id, selection.id),
      {
        onSuccess: (data, selection) => {
          setCurrentAnswerSelection(selection);
          setGameStatus(GAME_STATUS.WAITING_FOR_ANSWERS);
        },
        onError: (err) => {
          toast({ title: getErrorMessage(err), variant: "destructive" });
        },
      }
    );
  const { mutate: TriggerShowResult, isLoading: showAnswerResultLoading } =
    useMutation(() => getQuestionResult(session!.id, question.id), {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    });
  const { mutate: TriggerNextQuestion, isLoading: loadingNextQuestion } =
    useMutation(() => getNextQuestion(session!.id), {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    });

  const selectAnswer = (answer: User) => {
    TriggerSelectingAnswer(answer);
  };
  const showResult = () => {
    TriggerShowResult();
  };
  const nextQuestion = () => {
    TriggerNextQuestion();
  };

  if (!session || !user) return null;
  return (
    <>
      {gameStatus === GAME_STATUS.SHOWING_QUESTION && !!question && !result && (
        <QuestionBoard
          question={question}
          selectAnswer={selectAnswer}
          isLoading={loadingAnswerSelection}
          showResult={showResult}
        />
      )}
      {gameStatus === GAME_STATUS.WAITING_FOR_ANSWERS && (
        <Loader
          isLoading={showAnswerResultLoading}
          showResult={showResult}
          isAdmin={String(session.adminId) === String(user.id)}
          currentAnswerSelection={currentAnswerSelection}
        />
      )}
      {!!result && (
        <QuestionResult
          participents={participents}
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
