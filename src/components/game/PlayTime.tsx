import React from "react";
import { Question, Session } from "models/game";
import { User } from "models/user";
import QuestionBoard from "./QuestionBoard";
import { useMutation } from "react-query";
import {
  answerQuestion,
  endGame,
  getNextQuestion,
  getQuestionResult,
} from "services/apiClient";
import { useToast } from "components/ui/useToast";
import { getErrorMessage } from "lib/errorHandling";
import Loader from "./WaitForEveryoneToAnswer";
import QuestionResult from "./QuestionResult";

type props = {
  user: User;
  participents: User[];
  question: Question;
  result: User[] | null;
  session: Session;
  showLoader: boolean;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
  currentAnswerSelection: User | null;
  setCurrentAnswerSelection: React.Dispatch<React.SetStateAction<User | null>>;
};
const PlayTime = ({
  user,
  participents,
  question,
  result,
  session,
  showLoader,
  setShowLoader,
  currentAnswerSelection,
  setCurrentAnswerSelection,
}: props) => {
  const { toast } = useToast();
  const { mutate: TriggerSelectingAnswer, isLoading: loadingAnswerSelection } =
    useMutation(
      (selection: User) =>
        answerQuestion(session.id, user.id, question.id, selection.id),
      {
        onSuccess: (data, selection) => {
          setCurrentAnswerSelection(selection);
          setShowLoader(true);
        },
        onError: (err) => {
          toast({ title: getErrorMessage(err), variant: "destructive" });
        },
      }
    );
  const { mutate: TriggerShowResult, isLoading: showAnswerResultLoading } =
    useMutation(() => getQuestionResult(session.id, question.id), {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    });
  const { mutate: TriggerNextQuestion, isLoading: loadingNextQuestion } =
    useMutation(() => getNextQuestion(session.id), {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    });
  const { mutate: TriggerEndingGame } = useMutation(() => endGame(session.id), {
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
  const finishGame = () => {
    TriggerEndingGame();
  };
  return (
    <>
      {!!question && !result && !showLoader && (
        <QuestionBoard
          question={question}
          participents={participents}
          selectAnswer={selectAnswer}
          isLoading={loadingAnswerSelection}
        />
      )}
      {!!showLoader && (
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
          isAdmin={String(session.adminId) === String(user.id)}
        />
      )}
    </>
  );
};

export default PlayTime;
