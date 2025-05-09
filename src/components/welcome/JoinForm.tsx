import React from "react";
import { motion } from "framer-motion";
import { ReactComponent as Amanda } from "assets/amanda.svg";
import { ReactComponent as Person } from "assets/person.svg";
import { ReactComponent as Paint } from "assets/paintpalette.svg";
import { Input } from "components/ui/input";
import CircularProgress from "components/ui/CircularProgress";
import { COLORS } from "constants/colors";
import { CheckIcon, Flame } from "lucide-react";
import { cn } from "lib/utils";
import GradientButton from "components/ui/GradientButton";

type JoinFormProps = {
  color: string | null;
  setColor: (color: string) => void;
  amandaIdRef: React.RefObject<HTMLInputElement>;
  nicknameRef: React.RefObject<HTMLInputElement>;
  handleStartGame: (e: React.FormEvent) => void;
  isLoading: boolean;
};

const JoinForm: React.FC<JoinFormProps> = ({
  color,
  setColor,
  amandaIdRef,
  nicknameRef,
  handleStartGame,
  isLoading,
}) => {
  return (
    <motion.form
      dir="rtl"
      onSubmit={handleStartGame}
      className="py-8 flex flex-col gap-8"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -30, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.2,
      }}
    >
      <div className="flex flex-col gap-2 items-start w-full" dir="rtl">
        <div className="flex items-center gap-2 text-white">
          <Amanda className="h-6 w-6" />
          <span>קוד חדר</span>
        </div>
        <Input
          ref={amandaIdRef}
          type="text"
          placeholder="הקלידו את קוד החדר כאן"
        />
      </div>

      <div className="flex flex-col gap-2 items-start w-full" dir="rtl">
        <div className="flex items-center gap-2 text-white">
          <Person className="h-6 w-6" />
          <span>כינוי</span>
        </div>
        <Input ref={nicknameRef} placeholder={"איך נקרא לך?"} />
      </div>

      <div className="flex flex-col gap-2 items-start w-full" dir="rtl">
        <div className="flex items-center gap-2 text-white">
          <Paint className="h-6 w-6" />
          <span>מה הצבע שלך?</span>
        </div>
        <div
          className="py-2 px-1 flex flex-wrap gap-4 overflow-y-auto justify-center w-full
        max-h-28 xs:max-h-full
        "
        >
          {Object.keys(COLORS).map((colorKey) => {
            const colorSelection = COLORS[colorKey];
            return (
              <motion.button
                key={colorKey}
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => setColor(colorSelection)}
                className={cn(
                  "w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all",
                  colorSelection === color
                    ? "border-white"
                    : "border-transparent hover:border-white/50"
                )}
                style={{ backgroundColor: `rgb(${colorSelection})` }}
                aria-label={`Select color ${colorSelection}`}
              >
                {colorSelection === color && (
                  <CheckIcon className="w-5 h-5 text-white drop-shadow-md" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <GradientButton
        variant="primary"
        type="submit"
        disabled={isLoading}
        className="w-full text-lg py-6"
        dir="rtl"
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <p>{"יאללה בלאגן"}</p>
            <Flame className="mr-2 w-5 h-5" />
          </>
        )}
      </GradientButton>
    </motion.form>
  );
};

export default JoinForm;
