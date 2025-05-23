import { useCallback } from "react";
import { useMutation } from "react-query";
import { motion } from "framer-motion";
import { returnToOptions, startSession } from "services/apiClient";
import { useGameStore } from "context/gameStore";
import { useAuthContext } from "context/AuthContext";
import CircularProgress from "components/ui/CircularProgress";
import GradientButton from "components/ui/GradientButton";
import { User } from "models/user";
import { Crown } from "lucide-react";

const GameResults = () => {
  const selectedGameType = useGameStore((state) => state.selectedGameType);
  const gameSummary = useGameStore((state) => state.gameSummary);
  const resetGame = useGameStore((state) => state.resetGame);
  const space = useGameStore((state) => state.space);

  const { user } = useAuthContext();

  const { mutate, isLoading } = useMutation(() =>
    startSession({
      spaceId: space!.id,
      userId: user!.id,
      questionTypeId: selectedGameType?.id,
    })
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
        className={`flex flex-col gap-8 w-full max-h-[calc(100vh-300px)] overflow-y-auto max-w-md mx-auto`}
      >
        {gameSummary.map((participant, index) => (
          <ParticipantItem
            key={participant.id}
            participant={participant}
            isActiveUser={user?.id === participant.id}
            isWinner={index === 0}
          />
        ))}
      </div>

      <div className="flex mt-auto justify-between gap-4 w-full max-w-md mx-auto">
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

type ParticipantItemProps = {
  participant: User;
  isActiveUser: boolean;
  isWinner: boolean;
};
const ParticipantItem = ({
  participant,
  isActiveUser,
  isWinner,
}: ParticipantItemProps) => (
  <div
    dir="rtl"
    className={`flex items-center gap-4 w-full rounded-lg p-4 bg-card
  ${isWinner ? "border-yellow-400 border" : ""}
  `}
  >
    <div className="relative flex items-center justify-center">
      <div
        className="w-10 h-10 rounded-full"
        style={{ backgroundColor: `rgb(${participant.color})` }}
      />
      {isActiveUser && (
        <div className="absolute bg-black/10 p-2 text-white text-sm rounded-full animate-pulse">
          אני
        </div>
      )}
    </div>

    <p className="text-lg line-clamp-1 max-w-[55%]">{participant.name}</p>
    <div className="flex items-center gap-2 mr-auto">
      <p className="font-semibold text-lg flex-shrink-0">
        {participant?.score || 0} נק׳
      </p>
      {isWinner && (
        <div className="flex justify-center">
          <Crown className="h-5 w-5 fill-yellow-400" />
        </div>
      )}
    </div>
  </div>
);

export default GameResults;
