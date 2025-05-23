import React, { useState } from "react";
import { motion } from "framer-motion";
import { ReactComponent as Amanda } from "assets/amanda.svg";
import { ReactComponent as Person } from "assets/person.svg";
import { ReactComponent as Paint } from "assets/paintpalette.svg";
import { Input } from "components/ui/input";
import CircularProgress from "components/ui/CircularProgress";
import { COLORS } from "constants/colors";
import { CreateOrJoinSpaceRequest } from "models/requests";
import { CheckIcon, Flame } from "lucide-react";
import { cn } from "lib/utils";
import GradientButton from "components/ui/GradientButton";
import { useToast } from "components/ui/useToast";

type JoinFormProps = {
  handleStartGame: (data: CreateOrJoinSpaceRequest) => void;
  isLoading: boolean;
};

const JoinForm: React.FC<JoinFormProps> = ({ handleStartGame, isLoading }) => {
  const { toast } = useToast();
  const [color, setColor] = useState<string | null>(null);
  const [amandaId, setAmandaId] = useState<string>("");
  const [nickname, setNickname] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amandaId || !color || !nickname) {
      toast({ title: "יש למלא את כל השדות", variant: "destructive" });
      return;
    }
    handleStartGame({
      amandaId,
      color,
      name: nickname,
    });
  };
  return (
    <motion.form
      dir="rtl"
      onSubmit={handleSubmit}
      className="py-8 flex flex-col gap-8 max-w-md mx-auto"
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
          value={amandaId}
          onChange={(e) => setAmandaId(e.target.value)}
          type="text"
          placeholder="הקלידו את קוד החדר כאן"
        />
      </div>

      <div className="flex flex-col gap-2 items-start w-full" dir="rtl">
        <div className="flex items-center gap-2 text-white">
          <Person className="h-6 w-6" />
          <span>כינוי</span>
        </div>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder={"איך נקרא לך?"}
        />
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
                    ? "border-black"
                    : "border-transparent hover:border-black/80"
                )}
                style={{ backgroundColor: `rgb(${colorSelection})` }}
                aria-label={`Select color ${colorSelection}`}
              >
                {colorSelection === color && (
                  <CheckIcon className="w-5 h-5 text-black/70 drop-shadow-md" />
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
          <CircularProgress wrapperClassName="h-7" />
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
