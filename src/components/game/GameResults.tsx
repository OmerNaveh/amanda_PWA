import { useMutation } from "react-query";
import { returnToOptions, startSession } from "services/apiClient";
import { useGameContext } from "context/GameContext";
import { useAuthContext } from "context/AuthContext";
import QuestionCard from "./QuestionCard";
import UserSlider from "./UserSlider";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import Carousel from "components/ui/Carousel";

const GameResults = () => {
  const { selectedGameType, gameSummary, resetGame, space } = useGameContext();
  const { user } = useAuthContext();
  const { mutate, isLoading } = useMutation(
    () =>
      startSession({
        spaceId: space!.id,
        userId: user!.id,
        questionTypeId: selectedGameType?.id,
      }),
    {
      onSuccess: () => {
        resetGame();
      },
    }
  );
  const { mutate: backToOptions, isLoading: loadingBackToOptions } =
    useMutation(() => returnToOptions(space!.id), {
      onSuccess: () => {
        resetGame();
      },
    });
  const playNewGame = async () => {
    mutate();
  };
  const viewOtherGames = () => {
    backToOptions();
  };
  const renderButtons = () => {
    return (
      <>
        <Button onClick={playNewGame} disabled={isLoading}>
          {isLoading ? <CircularProgress /> : "עוד הפעם"}
        </Button>
        <Button onClick={viewOtherGames} disabled={loadingBackToOptions}>
          {loadingBackToOptions ? <CircularProgress /> : "לבחירת משחק"}
        </Button>
      </>
    );
  };
  return (
    <div className="flex flex-col gap-4 h-full">
      <QuestionCard question={"תוצאות המשחק"} renderButtons={renderButtons} />
      <div
        dir="rtl"
        className={`flex gap-2 items-center snap-x snap-mandatory overflow-x-auto h-[50%] w-full py-2 flex-shrink-0
          ${gameSummary.length === 1 && "justify-center"}`}
      >
        <Carousel
          cards={gameSummary.map((participant, index) => (
            <UserSlider
              key={participant.id}
              user={participant}
              isLoading={isLoading}
              isWinner={index === 0}
              isGameSummmary
            />
          ))}
          className="w-full py-0"
        />
      </div>
    </div>
  );
};

export default GameResults;
