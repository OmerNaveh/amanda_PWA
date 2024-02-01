import { useMemo, useState } from "react";
import BottomSheet from "components/ui/BottomSheet";
import { Button } from "components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "context/AuthContext";
import { useGameContext } from "context/GameContext";
import { GAME_STATUS } from "models/game";
import CircularProgress from "components/ui/CircularProgress";

type props = {
  finishGame: () => void;
  loadingFinishGame: boolean;
  resetGame: () => void;
};
const ParticipentsBottomSheet = ({
  finishGame,
  loadingFinishGame,
  resetGame,
}: props) => {
  const [open, setOpen] = useState<boolean>(false);
  const { user } = useAuthContext();
  const { participents, gameStatus, session } = useGameContext();

  const navigate = useNavigate();
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
    resetGame();
    navigate("/");
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
            {gameStatus !== GAME_STATUS.PRE_GAME
              ? `${participents.length} אנשים מוכנים לשחק`
              : `${participents.length} אנשים במשחק`}
          </h4>
        </div>
      )}

      <BottomSheet
        open={open}
        setOpenModal={() => {
          setOpen(false);
        }}
        className="page-height rounded-t-2xl gap-2"
      >
        <div className="bg-white/10 rounded-full w-[calc(100%-8rem)] h-2 self-center" />
        <h4 dir="rtl" className="w-full font-bold text-center text-base">
          {gameStatus === GAME_STATUS.PRE_GAME
            ? `${participents.length} אנשים מוכנים לשחק`
            : `${participents.length} אנשים במשחק`}
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
            <Button onClick={finishGame} disabled={!!loadingFinishGame}>
              {!!loadingFinishGame ? (
                <CircularProgress />
              ) : (
                <p>{"סיים משחק"}</p>
              )}
            </Button>
          )}
          <Button onClick={handleExitGame} className="bg-secondary">
            {"צא מהמשחק"}
          </Button>
        </div>
      </BottomSheet>
    </>
  );
};

export default ParticipentsBottomSheet;
