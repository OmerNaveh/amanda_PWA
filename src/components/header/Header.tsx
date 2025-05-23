import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import logo from "assets/amanda_logo.png";
import { useState } from "react";
import useSoundManager from "hooks/useSoundManager";

type HeaderProps = {
  showHeader: boolean;
};

export default function Header({ showHeader }: HeaderProps) {
  const [isSoundOn, setIsSoundOn] = useState(false);
  useSoundManager({ isSoundOn: isSoundOn && showHeader });

  return (
    <AnimatePresence mode="wait">
      {showHeader && (
        <motion.header
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          exit={{ y: -60 }}
          className="flex justify-between items-center px-4 py-3 bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-10"
        >
          <div className="flex items-center">
            <img
              src={logo}
              alt="Amanda Logo"
              className="w-8 h-8 flex-shrink-0"
            />
            <p className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent truncate ml-2">
              Amanda
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsSoundOn(!isSoundOn)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label={isSoundOn ? "Mute sound" : "Unmute sound"}
            >
              {isSoundOn ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
