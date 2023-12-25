import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MessageEvent } from "pubnub";
import { useToast } from "components/ui/useToast";
import { CreateOrJoinSpaceResponse } from "models/responses";
import usePubnub from "hooks/usePubnub";
import { User } from "models/user";
import { PUBNUB_MESSAGE, PUBNUB_MESSAGE_TYPE } from "models/pubnub";
import WaitingRoom from "components/game/WaitingRoom";
import { Question } from "models/game";
import PlayTime from "components/game/PlayTime";
import GameResults from "components/game/GameResults";

const GameRoom = () => {
  const [participents, setParticipents] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [question, setQuestion] = useState<Question | null>(null);
  const [result, setResult] = useState<User[] | null>(null);
  const [gameSummary, setGameSummary] = useState<User[] | null>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const location = useLocation();
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
        setSessionId(pubnubData.session.id);
        setQuestion(pubnubData.question);
        break;
      case PUBNUB_MESSAGE_TYPE.END_GAME:
        setQuestion(null);
        setResult(null);
        setSessionId(null);
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
  });

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

  if (!spaceData) return null;
  return (
    <div className="flex flex-col text-center gap-4 px-4 py-4 page-height">
      {!isGameStarted && !isGameFinished && (
        <WaitingRoom participents={participents} spaceId={spaceData.space.id} />
      )}
      {isGameStarted &&
        !isGameFinished &&
        !!user &&
        !!question &&
        !!sessionId && (
          <PlayTime
            user={user}
            participents={participents}
            question={question}
            result={result}
            sessionId={sessionId}
            showLoader={showLoader}
            setShowLoader={setShowLoader}
          />
        )}
      {!!isGameFinished && !!gameSummary && (
        <GameResults spaceId={spaceData.space.id} gameSummary={gameSummary} />
      )}
    </div>
  );
};

export default GameRoom;
