import { motion } from "framer-motion";
import logo from "assets/amanda_logo.png";

interface HeaderProps {
  mode?: "welcome" | "compact";
  onLogoClick?: () => void;
}

export default function Header({ mode = "welcome", onLogoClick }: HeaderProps) {
  const isWelcome = mode === "welcome";

  return (
    <motion.header
      className={`w-full ${
        isWelcome
          ? "flex flex-col items-center justify-center py-8"
          : "flex items-center px-4 py-3 bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-20"
      }`}
      layout
      transition={{
        layout: { duration: 0.25, ease: "easeInOut" },
      }}
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <motion.img
        src={logo}
        alt="Amanda Logo"
        className={isWelcome ? "h-24 w-24 mb-4" : "w-8 h-8 flex-shrink-0"}
        animate={{
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        initial={{ scale: 0.95, rotate: isWelcome ? -10 : 0 }}
        onClick={onLogoClick}
        style={{ cursor: onLogoClick ? "pointer" : "default" }}
      />

      {isWelcome ? (
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Amanda
          </h1>
          <h3 className="text-xl font-light text-white/80">
            Light up the Night
          </h3>
        </motion.div>
      ) : (
        <motion.div
          className="text-lg font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent truncate ml-2"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          Amanda
        </motion.div>
      )}
    </motion.header>
  );
}
