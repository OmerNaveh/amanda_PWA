import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ReactComponent as Amanda } from "assets/amanda.svg";
import { ReactComponent as Person } from "assets/person.svg";
import { ReactComponent as Paint } from "assets/paintpalette.svg";
import { ReactComponent as TikTok } from "assets/TikTok.svg";
import { ReactComponent as Youtube } from "assets/YouTube.svg";
import { ReactComponent as Instagram } from "assets/Instagram.svg";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { useToast } from "components/ui/useToast";
import { extractRGB } from "lib/colorHandling";
import { getErrorMessage } from "lib/errorHandling";
import { CreateOrJoinSpaceRequest } from "models/requests";
import { createSpace } from "services/apiClient";
import { Input } from "components/ui/input";
import { COLORS } from "constants/colors";
import { useGameContext } from "context/GameContext";
import { useAuthContext } from "context/AuthContext";
import { GAME_STATUS } from "models/game";

type Step = "welcome" | "create" | "join";

const HomePage = () => {
  const [color, setColor] = useState<string | null>(null);
  const amandaIdRef = React.useRef<HTMLInputElement>(null);
  const nicknameRef = React.useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("welcome");

  const { setSpace, setParticipents, setGameStatus } = useGameContext();
  const { setUser } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation(
    ({ amandaId, color, name }: CreateOrJoinSpaceRequest) =>
      createSpace({ amandaId, name, color }),
    {
      onSuccess: (data) => {
        setSpace(data.space);
        setParticipents(data.space.users);
        setUser(data.user);
        if (!!data.space.isSessionInPlay) {
          setGameStatus(GAME_STATUS.WAITING_FOR_ANSWERS);
        }
        navigate("/game");
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        toast({ title: message, variant: "destructive" });
      },
    }
  );

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const amandaId = amandaIdRef.current?.value;
    const nickname = nicknameRef.current?.value;
    if (!amandaId || !color || !nickname) {
      toast({ title: "יש למלא את כל השדות", variant: "destructive" });
      return;
    }
    mutate({ amandaId, name: nickname, color: extractRGB(color) });
  };

  const handleWelcomePageClick = (step: Step) => {
    if (step !== "welcome") {
      setGameStatus(GAME_STATUS.PRE_GAME);
    } else {
      setGameStatus(GAME_STATUS.WELCOME);
    }
    setStep(step);
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col flex-1 justify-center items-center min-h-[60vh]">
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <motion.div
            key="welcome"
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full flex flex-col items-center text-center px-2"
          >
            <motion.p className="text-lg mb-8 max-w-xs text-white/70 mx-auto">
              {"ה"}
              The ultimate "Who's Most Likely To..." party game to spark
              laughter and unforgettable moments
            </motion.p>
            <div className="space-y-4 w-full">
              <motion.div>
                <Button
                  onClick={() => handleWelcomePageClick("create")}
                  className="w-full text-lg py-6 bg-gradient-to-r from-pink-500 to-purple-500"
                >
                  Create a Game
                </Button>
              </motion.div>
              <motion.div>
                <Button
                  onClick={() => handleWelcomePageClick("join")}
                  variant="secondary"
                  className="w-full text-lg py-6"
                >
                  Join a Game
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}

        {(step === "create" || step === "join") && (
          <motion.div
            key="join-create"
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            <motion.button
              onClick={() => handleWelcomePageClick("welcome")}
              className="flex items-center text-white/70 hover:text-white mb-6 transition-colors"
              style={{ fontSize: 18 }}
            >
              ← Back
            </motion.button>
            <motion.h1 className="text-2xl font-bold mb-6">
              {step === "create"
                ? "Create a New Game"
                : "Join an Existing Game"}
            </motion.h1>
            <motion.form
              dir="rtl"
              onSubmit={handleStartGame}
              className="bg-card border-[1.5px] border-card bg-blend-overlay px-4 py-8 rounded-2xl flex flex-col gap-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.1,
              }}
            >
              {step === "join" && (
                <div className="flex items-center gap-4" dir="rtl">
                  <Amanda className="h-8 w-8" />
                  <Input
                    ref={amandaIdRef}
                    type="text"
                    placeholder={"הכנס מזהה"}
                  />
                </div>
              )}
              <div className="flex items-center gap-4" dir="rtl">
                <Person className="h-8 w-8" />
                <Input ref={nicknameRef} placeholder={"הכנס כינוי"} />
              </div>
              <div className="flex items-center gap-4 overflow-hidden">
                <Paint className="h-8 w-8 flex-shrink-0" />
                <div
                  dir="rtl"
                  className="py-2 px-1 flex flex-wrap gap-4 max-h-36 overflow-y-scroll justify-center"
                >
                  {Object.keys(COLORS).map((colorKey) => {
                    const colorSelection = COLORS[colorKey];
                    return (
                      <Button
                        type="button"
                        variant="ghost"
                        key={colorKey}
                        onClick={() => setColor(colorSelection)}
                        className={`flex-shrink-0 w-10 h-10 rounded-lg cursor-pointer transition-all duration-200 ${
                          colorSelection === color
                            ? "ring-2 ring-black ring-offset-2 scale-110"
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: `rgb(${colorSelection})` }}
                      />
                    );
                  })}
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 mt-4 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <CircularProgress />
                ) : (
                  <p>{step === "create" ? "Create Game" : "Join Game"}</p>
                )}
              </Button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.footer
        className="mt-auto text-center flex flex-col gap-2 w-full pb-4 pt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-sm">{"עקבו אחרינו והצטרפו לטירוף"}</p>
        <div className="flex justify-center gap-2 items-center">
          <a
            href="https://www.instagram.com/cheerswithamanda/"
            target="_blank"
            rel="noreferrer"
            className="h-6 w-6 cursor-pointer active:opacity-50 transition-transform hover:scale-110"
          >
            <TikTok className="h-6 w-6" />
          </a>
          <a
            href="https://www.instagram.com/cheerswithamanda/"
            target="_blank"
            rel="noreferrer"
            className="h-6 w-6 cursor-pointer active:opacity-50 transition-transform hover:scale-110"
          >
            <Instagram className="h-6 w-6" />
          </a>
          <a
            href="https://www.instagram.com/cheerswithamanda/"
            target="_blank"
            rel="noreferrer"
            className="h-6 w-6 cursor-pointer active:opacity-50 transition-transform hover:scale-110"
          >
            <Youtube className="h-6 w-6" />
          </a>
        </div>
      </motion.footer>
    </div>
  );
};

export default HomePage;
