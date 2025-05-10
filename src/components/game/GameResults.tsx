import { useMutation } from "react-query";
import { motion } from "framer-motion";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 flex-1"
    >
      <QuestionCard question={"תוצאות המשחק"} renderButtons={renderButtons} />
      <div
        dir="rtl"
        className={`h-[50%] w-full flex items-center flex-shrink-0
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
    </motion.div>
  );
};

export default GameResults;
