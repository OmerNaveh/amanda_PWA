import { useMutation } from "react-query";
import { startSession } from "services/apiClient";
import { useGameContext } from "context/GameContext";
import { useAuthContext } from "context/AuthContext";
import QuestionCard from "./QuestionCard";
import UserSlider from "./UserSlider";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";

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
  const playNewGame = async () => {
    mutate();
  };
  const viewOtherGames = () => {
    resetGame();
  };
  const renderButtons = () => {
    return (
      <>
        <Button onClick={playNewGame} disabled={isLoading}>
          {isLoading ? <CircularProgress /> : "עוד הפעם"}
        </Button>
        <Button onClick={viewOtherGames}>{"לבחירת משחק"}</Button>
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
        {gameSummary.map((participant, index) => (
          <UserSlider
            key={participant.id}
            user={participant}
            isLoading={isLoading}
            isWinner={index === 0}
            isGameSummmary
          />
        ))}
      </div>
    </div>
  );
};

export default GameResults;
