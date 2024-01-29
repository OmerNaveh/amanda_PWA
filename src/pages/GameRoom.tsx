import { useCallback, useEffect, useId, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageEvent } from "pubnub";
import { useToast } from "components/ui/useToast";
import {
  CreateOrJoinSpaceResponse,
  QuestionTypeResponse,
} from "models/responses";
import usePubnub from "hooks/usePubnub";
import { User } from "models/user";
import { PUBNUB_MESSAGE, PUBNUB_MESSAGE_TYPE } from "models/pubnub";
import WaitingRoom from "components/game/WaitingRoom";
import { Question, Session } from "models/game";
import PlayTime from "components/game/PlayTime";
import GameResults from "components/game/GameResults";
import ParticipentsBottomSheet from "components/game/ParticipentsBottomSheet";

const GameRoom = () => {
  const [participents, setParticipents] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<QuestionTypeResponse | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [result, setResult] = useState<User[] | null>(null);
  const [gameSummary, setGameSummary] = useState<User[] | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [currentAnswerSelection, setCurrentAnswerSelection] =
    useState<User | null>(null);

  const location = useLocation();
  const id = useId();
  const spaceData = location.state?.spaceData as CreateOrJoinSpaceResponse;
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleMessage = useCallback(({ message }: MessageEvent) => {
    const { data } = message;
    console.log(data);
    const pubnubData = data as PUBNUB_MESSAGE;
    switch (pubnubData.type) {
      case PUBNUB_MESSAGE_TYPE.JOIN:
        if (user?.id === pubnubData.user.id) return;
        setParticipents((prev) => [...prev, pubnubData.user]);
        break;
      case PUBNUB_MESSAGE_TYPE.START_GAME:
        setIsGameFinished(false);
        setIsGameStarted(true);
        setResult(null);
        setSession(pubnubData.session);
        setQuestion(pubnubData.question);
        setSelectedQuestionType(pubnubData.questionType);
        break;
      case PUBNUB_MESSAGE_TYPE.END_GAME:
        setQuestion(null);
        setResult(null);
        setSession(null);
        setIsGameFinished(true);
        setGameSummary(pubnubData.users);
        break;
      case PUBNUB_MESSAGE_TYPE.NEXT_QUESTION:
        setResult(null);
        setQuestion(pubnubData.question);
        break;
      case PUBNUB_MESSAGE_TYPE.NEXT_RESULT:
        setShowLoader(false);
        setResult(pubnubData.users);
        break;
    }
  }, []);

  const { connectToPubnub, handleDisconnectFromPubnub } = usePubnub({
    handleMessage,
    userId: !!spaceData.user.id ? String(spaceData.user.id) : id,
  });

  const resetAllStates = () => {
    setSession(null);
    setSelectedQuestionType(null);
    setIsGameStarted(false);
    setIsGameFinished(false);
    setQuestion(null);
    setResult(null);
    setGameSummary(null);
    setCurrentAnswerSelection(null);
  };

  // Initial connection to PubNub and populate state
  useEffect(() => {
    if (!spaceData) {
      toast({ title: "No space data found", variant: "destructive" });
      navigate("/");
      return;
    }
    setParticipents(spaceData.space.users);
    setUser(spaceData.user);
    connectToPubnub(spaceData.space.channel);

    return () => {
      setParticipents([]);
      setUser(null);
      handleDisconnectFromPubnub(spaceData.space.channel);
    };
  }, []);
  // TODO: Implement lazy loading for components and show loader
  if (!spaceData) return null;
  return (
    <div className="page-height w-full flex flex-col">
      <div className="flex flex-col flex-shrink-0 text-center gap-4 px-4 py-2 h-[calc(100%-4rem)]">
        {!isGameStarted && !isGameFinished && (
          <WaitingRoom spaceId={spaceData.space.id} userId={user?.id!} />
        )}
        {isGameStarted &&
          !isGameFinished &&
          !!user &&
          !!question &&
          !!session && (
            <PlayTime
              user={user}
              participents={participents}
              question={question}
              result={result}
              session={session}
              showLoader={showLoader}
              setShowLoader={setShowLoader}
              currentAnswerSelection={currentAnswerSelection}
              setCurrentAnswerSelection={setCurrentAnswerSelection}
            />
          )}
        {!!isGameFinished && !!gameSummary && (
          <GameResults
            spaceId={spaceData.space.id}
            gameSummary={gameSummary}
            userId={user?.id!}
            selectedQuestionType={selectedQuestionType}
            resetAllStates={resetAllStates}
          />
        )}
      </div>
      {!!participents && !!participents.length && (
        <ParticipentsBottomSheet
          participents={participents}
          hasGameStarted={isGameStarted}
          user={user}
        />
      )}
    </div>
  );
};

export default GameRoom;
