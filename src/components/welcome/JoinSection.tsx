import React from "react";
import { motion } from "framer-motion";
import GradientButton from "components/ui/GradientButton";
import { ChevronRight } from "lucide-react";
import { Step } from "models/welcome";
import { CreateOrJoinSpaceRequest } from "models/requests";
import JoinForm from "./JoinForm";

type JoinSectionProps = {
  step: Step;
  handleWelcomePageClick: (step: Step) => void;
  handleStartGame: (data: CreateOrJoinSpaceRequest) => void;
  isLoading: boolean;
};
const JoinSection = ({
  step,
  handleWelcomePageClick,
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
        dir="rtl"
      >
        חזור
        <ChevronRight className="w-5 h-5 rotate-180 mr-1" />
      </GradientButton>

      <JoinForm handleStartGame={handleStartGame} isLoading={isLoading} />
    </motion.div>
  );
};

export default JoinSection;
