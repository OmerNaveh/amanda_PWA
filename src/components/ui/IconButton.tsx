import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "lib/utils";
import React from "react";

type IconButtonProps = HTMLMotionProps<"button"> & {
  children: React.ReactNode;
};

const IconButton = ({ children, className, ...props }: IconButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-flex bg-white/20 p-1.5 rounded-full text-white active:bg-white/10 transition-all duration-300",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default IconButton;
