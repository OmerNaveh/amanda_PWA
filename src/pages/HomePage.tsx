import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useToast } from "components/ui/useToast";
import { extractRGB } from "lib/colorHandling";
import { getErrorMessage } from "lib/errorHandling";
import { CreateOrJoinSpaceRequest } from "models/requests";
import { createSpace } from "services/apiClient";
import { useGameStore } from "context/gameStore";
import { useAuthContext } from "context/AuthContext";
import { GAME_STATUS } from "models/game";
import WelcomeSection from "components/welcome/WelcomeSection";
import { Step } from "models/welcome";
import JoinSection from "components/welcome/JoinSection";

const HomePage = () => {
  const [step, setStep] = useState<Step>("welcome");

  const setSpace = useGameStore((state) => state.setSpace);
  const setParticipents = useGameStore((state) => state.setParticipents);
  const setGameStatus = useGameStore((state) => state.setGameStatus);

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

  const handleStartGame = async ({
    amandaId,
    name,
    color,
  }: CreateOrJoinSpaceRequest) => {
    if (!amandaId || !color || !name) return;

    mutate({ amandaId, name, color: extractRGB(color) });
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
    <div className="flex flex-col items-center flex-1">
      <AnimatePresence mode="wait">
        {step === "welcome" && (
          <WelcomeSection
            key={step}
            handleWelcomePageClick={handleWelcomePageClick}
          />
        )}

        {step === "join" && (
          <JoinSection
            step={step}
            handleWelcomePageClick={handleWelcomePageClick}
            handleStartGame={handleStartGame}
            isLoading={isLoading}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
