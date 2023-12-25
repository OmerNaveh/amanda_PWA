import React, { useState } from "react";
import { Question } from "models/game";
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
import Loader from "./Loader";
import QuestionResult from "./QuestionResult";

type props = {
  user: User;
  participents: User[];
  question: Question;
  result: User[] | null;
  sessionId: number;
  showLoader: boolean;
  setShowLoader: React.Dispatch<React.SetStateAction<boolean>>;
};
const PlayTime = ({
  user,
  participents,
  question,
  result,
  sessionId,
  showLoader,
  setShowLoader,
}: props) => {
  const { toast } = useToast();
  const { mutate: TriggerSelectingAnswer } = useMutation(
    (selection: User) =>
      answerQuestion(sessionId, user.id, question.id, selection.id),
    {
      onSuccess: () => {
        setShowLoader(true);
      },
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    }
  );
  const { mutate: TriggerShowResult } = useMutation(
    () => getQuestionResult(sessionId, question.id),
    {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    }
  );
  const { mutate: TriggerNextQuestion, isLoading: loadingNextQuestion } =
    useMutation(() => getNextQuestion(sessionId), {
      onError: (err) => {
        toast({ title: getErrorMessage(err), variant: "destructive" });
      },
    });
  const { mutate: TriggerEndingGame } = useMutation(() => endGame(sessionId), {
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
        />
      )}
      {!!showLoader && <Loader showResult={showResult} />}
      {!!result && (
        <QuestionResult
          participents={participents}
          result={result}
          showNextQuestion={nextQuestion}
          loadingNextQuestion={loadingNextQuestion}
          finishGame={finishGame}
        />
      )}
    </>
  );
};

export default PlayTime;
