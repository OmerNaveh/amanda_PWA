import { AnimatePresence, motion } from "framer-motion";
import { cn } from "lib/utils";
import { HTMLAttributes } from "react";

type props = {
  num: number;
  text?: string;
  containerClassName?: HTMLAttributes<HTMLDivElement>["className"];
};
const CountdownItem = ({ num, text, containerClassName }: props) => {
  return (
    <div
      className={cn(
        "font-mono w-full flex flex-col gap-1 md:gap-2 items-center justify-center",
        containerClassName
      )}
    >
      <div className="w-full text-center relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={num}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "-100%" }}
            transition={{ ease: "backIn", duration: 0.75 }}
            className="block text-base md:text-lg font-medium"
          >
            {num}
          </motion.span>
        </AnimatePresence>
      </div>
      {!!text && (
        <span className="text-xs md:text-sm font-light text-slate-500">
          {text}
        </span>
      )}
    </div>
  );
};

export default CountdownItem;
