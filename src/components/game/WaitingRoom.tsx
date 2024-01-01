import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { Lock } from "lucide-react";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { User } from "models/user";
import { getQuestionTypes, startSession } from "services/apiClient";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "components/ui/carousel";

type props = {
  participents: User[];
  spaceId: number;
  userId: number;
};
const WaitingRoom = ({ participents, spaceId, userId }: props) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const { data: questionTypes, isLoading: loadingQuestionTypes } = useQuery({
    queryKey: "questionTypes",
    queryFn: () => getQuestionTypes(),
  });
  const { mutate, isLoading } = useMutation(
    (questionTypeId?: number) =>
      startSession({
        spaceId,
        userId,
        questionTypeId,
      }),
    {}
  );
  const startGame = (questionTypeId?: number) => {
    mutate(questionTypeId);
  };
  return (
    <div className="flex flex-col text-center gap-4 h-full">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-bold">Waiting for more players...</h3>
        <p className="text-white">
          {participents.length}{" "}
          {participents.length >= 2 ? "players have" : "player has"} joined the
          game
        </p>
      </div>
      <div className="flex flex-wrap gap-4 px-4 flex-grow max-h-[30%] overflow-y-auto">
        {participents.map((user) => (
          <div
            key={user.id}
            className="flex flex-col items-center text-white bg-gray-800 rounded-lg shadow p-4 h-fit w-[calc(50%-1rem)]"
          >
            <div
              className="h-10 w-10 rounded-full mb-2"
              style={{ backgroundColor: `rgb(${user.color})` }}
            />
            <span className="text-sm line-clamp-1">{user.name}</span>
          </div>
        ))}
      </div>
      {loadingQuestionTypes ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : !!questionTypes ? (
        <div className="flex flex-col h-full flex-grow w-full">
          <Carousel className="h-full" setApi={setApi}>
            <CarouselContent className="h-full">
              {questionTypes.map((questionType) => {
                return (
                  <CarouselItem key={questionType.id} className="h-full">
                    <div className="flex flex-col justify-center items-center gap-2 h-full bg-gray-700 p-4 rounded-xl shadow-lg">
                      <h4 className="text-2xl text-center text-white font-bold">
                        {questionType.name}
                      </h4>
                      <img
                        src={questionType.picture}
                        alt="question type image"
                        className="h-28 w-28 object-contain rounded-lg"
                      />
                      <p className="text-white max-h-32 overflow-y-auto">
                        {questionType.description}
                      </p>
                      <Button
                        disabled={
                          isLoading || !!questionType?.isSubscriptionBased
                        }
                        onClick={() => {
                          startGame(questionType.id);
                        }}
                        className="mt-auto"
                      >
                        {isLoading ? (
                          <CircularProgress />
                        ) : !!questionType?.isSubscriptionBased ? (
                          <Lock className="h-6 w-6" />
                        ) : (
                          "Start Game"
                        )}
                      </Button>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
          <div className="py-1 text-center text-sm text-muted-foreground">
            {current} / {count}
          </div>
        </div>
      ) : (
        <Button onClick={() => startGame()} className="mt-auto">
          {isLoading ? <CircularProgress /> : "Start Game"}
        </Button>
      )}
    </div>
  );
};

export default WaitingRoom;
