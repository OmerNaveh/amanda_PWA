import React from "react";
import { motion } from "framer-motion";
import GradientButton from "components/ui/GradientButton";
import { ChevronRight } from "lucide-react";
import { Step } from "models/welcome";
import JoinForm from "./JoinForm";

type JoinSectionProps = {
  step: Step;
  handleWelcomePageClick: (step: Step) => void;
  color: string | null;
  setColor: React.Dispatch<React.SetStateAction<string | null>>;
  amandaIdRef: React.RefObject<HTMLInputElement>;
  nicknameRef: React.RefObject<HTMLInputElement>;
  handleStartGame: (e: React.FormEvent) => void;
  isLoading: boolean;
};
const JoinSection = ({
  step,
  handleWelcomePageClick,
  color,
  setColor,
  amandaIdRef,
  nicknameRef,
  handleStartGame,
  isLoading,
}: JoinSectionProps) => {
  return (
    <motion.div
      key={step}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 25,
      }}
      className="w-full"
    >
      <GradientButton
        variant="secondary"
        onClick={() => handleWelcomePageClick("welcome")}
        className="flex items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        dir="rtl"
      >
        חזור
        <ChevronRight className="w-5 h-5 rotate-180 mr-1" />
      </GradientButton>

      <JoinForm
        color={color}
        setColor={setColor}
        amandaIdRef={amandaIdRef}
        nicknameRef={nicknameRef}
        handleStartGame={handleStartGame}
        isLoading={isLoading}
      />
    </motion.div>
  );
};

export default JoinSection;
