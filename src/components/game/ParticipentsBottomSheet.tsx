import { useMemo, useState } from "react";
import { Button } from "components/ui/Button";
import { useAuthContext } from "context/AuthContext";
import { useGameContext } from "context/GameContext";
import { GAME_STATUS } from "models/game";
import CircularProgress from "components/ui/CircularProgress";
import DraggableDrawer from "components/ui/DraggableDrawer";
import { useNavigate } from "react-router-dom";
import GradientButton from "components/ui/GradientButton";

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
  const { participents, gameStatus, session, space } = useGameContext();

  const sortedParticipents = useMemo(
    () =>
      participents.sort((a, b) => {
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
      {!open && (
        <div
          onClick={() => {
            setOpen(true);
          }}
          className="h-full w-full bg-black/30 rounded-t-2xl shadow backdrop-blur text-center flex flex-col pt-2 active:opacity-60 cursor-pointer"
        >
          <div className="bg-white/10 rounded-full w-[calc(100%-8rem)] h-2 self-center" />
          <h4 dir="rtl" className="w-full font-bold my-auto text-base">
            {gameStatus === GAME_STATUS.PRE_GAME
              ? `${participents.length} משתתפים מוכנים לשחק`
              : `${participents.length} משתתפים במשחק`}
          </h4>
        </div>
      )}
      <DraggableDrawer
        open={open}
        setOpen={() => {
          setOpen(false);
        }}
      >
        <h4 dir="rtl" className="w-full font-bold text-center text-base">
          {gameStatus === GAME_STATUS.PRE_GAME
            ? `${participents.length} משתתפים מוכנים לשחק`
            : `${participents.length} משתתפים במשחק`}
        </h4>

        <div className="flex flex-col gap-4 py-2 max-h-[80%] overflow-y-auto">
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

        <div className="mt-auto flex flex-col gap-2 shrink-0">
          {String(user!.id) === String(session?.adminId) && (
            <GradientButton onClick={finishGame} disabled={!!loadingFinishGame}>
              {!!loadingFinishGame ? (
                <CircularProgress />
              ) : (
                <p>{"סיים משחק"}</p>
              )}
            </GradientButton>
          )}
          <GradientButton
            type="button"
            variant="secondary"
            onClick={handleExitGame}
            className="bg-red-500/90 active:bg-red-500/60"
          >
            {"צא מהמשחק"}
          </GradientButton>
        </div>
      </DraggableDrawer>
    </>
  );
};

export default ParticipentsBottomSheet;
