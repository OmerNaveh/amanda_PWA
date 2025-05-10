import React, { ReactNode } from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "lib/utils";
type GradientButtonProps = HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: "primary" | "secondary";
  fromColor?: string;
  toColor?: string;
};
export default function GradientButton({
  children,
  className,
  variant = "primary",
  fromColor = "from-pink-500",
  toColor = "to-purple-500",
  ...props
}: GradientButtonProps) {
  if (variant === "primary") {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "relative inline-flex items-center justify-center overflow-hidden rounded-lg px-5 py-3 font-medium text-white shadow-lg transition-all duration-300",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "absolute inset-0 bg-gradient-to-r opacity-100 transition-opacity",
            fromColor,
            toColor
          )}
        />
        <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 transition-opacity active:opacity-50" />

        <span className="relative flex items-center justify-center">
          {children}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-white/30 bg-white/10 px-5 py-3 font-medium text-white backdrop-blur-sm active:bg-white/20 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
