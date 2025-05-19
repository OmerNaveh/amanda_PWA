import { useCallback } from "react";
import { useMutation } from "react-query";
import { motion } from "framer-motion";
import { returnToOptions, startSession } from "services/apiClient";
import { useGameStore } from "store/gameStore";
import { useAuthContext } from "context/AuthContext";
import UserSlider from "./UserSlider";
import CircularProgress from "components/ui/CircularProgress";
import Carousel from "components/ui/Carousel";
import GradientButton from "components/ui/GradientButton";

const GameResults = () => {
  const selectedGameType = useGameStore((state) => state.selectedGameType);
  const gameSummary = useGameStore((state) => state.gameSummary);
  const resetGame = useGameStore((state) => state.resetGame);
  const space = useGameStore((state) => state.space);

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

  const playNewGame = useCallback(async () => {
    mutate();
  }, [mutate]);

  const viewOtherGames = useCallback(() => {
    backToOptions();
  }, [backToOptions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 flex-1"
    >
      <h3 className="font-bold text-xl">{"תוצאות המשחק"}</h3>

      <div
        dir="rtl"
        className={`flex shrink-0
          ${gameSummary.length === 1 && "justify-center"}`}
      >
        <Carousel
          cards={gameSummary.map((participant, index) => (
            <UserSlider
              key={participant.id}
              user={participant}
              isActiveUser={user?.id === participant.id}
              isLoading={isLoading}
              isWinner={index === 0}
              isGameSummmary
            />
          ))}
          className="w-full h-full py-0 shrink-0"
        />
      </div>

      <div className="flex mt-auto justify-between gap-4 w-full">
        <GradientButton
          variant="secondary"
          className="w-full"
          onClick={viewOtherGames}
          disabled={loadingBackToOptions}
        >
          {loadingBackToOptions ? <CircularProgress /> : "נחליף סגנון"}
        </GradientButton>
        <GradientButton
          onClick={playNewGame}
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress /> : "עוד סיבוב"}
        </GradientButton>
      </div>
    </motion.div>
  );
};

export default GameResults;
