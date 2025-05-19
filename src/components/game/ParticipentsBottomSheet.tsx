import { useMemo, useState, memo } from "react";
import { motion } from "framer-motion";
import { useAuthContext } from "context/AuthContext";
import { useGameStore } from "store/gameStore";
import { GAME_STATUS } from "models/game";
import CircularProgress from "components/ui/CircularProgress";
import DraggableDrawer from "components/ui/DraggableDrawer";
import { useNavigate } from "react-router-dom";
import GradientButton from "components/ui/GradientButton";
import { Share2 } from "lucide-react";
import IconButton from "components/ui/IconButton";

type props = {
  finishGame: () => void;
  loadingFinishGame: boolean;
  resetAll: () => void;
};
const ParticipentsBottomSheet = ({
  finishGame,
  loadingFinishGame,
  resetAll,
}: props) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useAuthContext();

  const participents = useGameStore((state) => state.participents);
  const gameStatus = useGameStore((state) => state.gameStatus);
  const space = useGameStore((state) => state.space);

  const getIsSessionAdmin = useGameStore((state) => state.getIsSessionAdmin);
  const isSessionAdmin = getIsSessionAdmin(user?.id);

  const sortedParticipents = useMemo(
    () =>
      [...participents].sort((a, b) => {
        if (a.id === user?.id) return -1;
        if (b.id === user?.id) return 1;
        return 0;
      }),
    [participents, user]
  );
  const handleExitGame = () => {
    resetAll();
    navigate("/");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my Amanda game!",
          text: `Join my "Who's Most Likely To" game: ${space?.id}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <>
      <motion.div
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-gradient-to-r from-purple-900/80 to-indigo-900/80 py-3 px-4 rounded-lg shadow-lg flex flex-row justify-between items-center cursor-pointer max-w-md mx-auto w-full"
      >
        <div className="flex items-center gap-2">
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleShare();
            }}
          >
            <Share2 size={18} />
          </IconButton>
        </div>
        <h4 dir="rtl" className="font-bold text-base text-white">
          {gameStatus === GAME_STATUS.PRE_GAME
            ? `${participents.length} משתתפים מוכנים לשחק`
            : `${participents.length} משתתפים במשחק`}
        </h4>
      </motion.div>

      <DraggableDrawer
        open={open}
        setOpen={() => {
          setOpen(false);
        }}
      >
        <h4 dir="rtl" className="font-bold text-center text-base shrink-0">
          {gameStatus === GAME_STATUS.PRE_GAME
            ? `${participents.length} משתתפים מוכנים לשחק`
            : `${participents.length} משתתפים במשחק`}
        </h4>

        <div className="flex flex-col gap-4 py-2 min-h-0 flex-1 overflow-y-auto">
          {sortedParticipents.map((participent, index) => (
            <div
              dir="rtl"
              key={participent.id}
              className={`flex items-center gap-4 text-white w-full p-2 rounded-lg ${
                participent.id === user?.id ? "bg-white/10" : ""
              }`}
            >
              <p className="text-white/50">{index + 1}</p>
              <div
                className="h-10 w-10 rounded-lg"
                style={{ backgroundColor: `rgb(${participent.color})` }}
              />
              <span className="line-clamp-1 max-w-[50%]">
                {participent.name}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 flex flex-col gap-4 shrink-0">
          {isSessionAdmin && (
            <GradientButton
              variant="secondary"
              onClick={finishGame}
              disabled={!!loadingFinishGame}
              className=" bg-white/40"
            >
              {!!loadingFinishGame ? (
                <CircularProgress />
              ) : (
                <p>{"לסיום המשחק"}</p>
              )}
            </GradientButton>
          )}
          <GradientButton
            type="button"
            variant="secondary"
            onClick={handleExitGame}
            className="bg-red-500/90 active:bg-red-500/60"
          >
            {"יציאה מהמשחק"}
          </GradientButton>
        </div>
      </DraggableDrawer>
    </>
  );
};
export default memo(ParticipentsBottomSheet);
