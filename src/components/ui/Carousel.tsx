import { HTMLAttributes, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "lib/utils";

const DRAG_BUFFER = 20;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 300,
  damping: 50,
};
type props = {
  cards: any[];
  className?: HTMLAttributes<HTMLDivElement>["className"];
};
const Carousel = ({ cards, className }: props) => {
  const [imgIndex, setImgIndex] = useState(0);

  const dragX = useMotionValue(0);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x >= DRAG_BUFFER && imgIndex < cards.length - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x <= -DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden flex-1 flex flex-col gap-4",
        className
      )}
    >
      <motion.div
        dir="rtl"
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        style={{
          x: dragX,
        }}
        animate={{
          translateX: `${imgIndex * 100}%`,
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex-1 flex cursor-grab active:cursor-grabbing"
      >
        {cards.map((card, idx) => {
          return (
            <CardWrapper key={idx} idx={idx} imgIndex={imgIndex}>
              {card}
            </CardWrapper>
          );
        })}
      </motion.div>

      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} cards={cards} />
    </div>
  );
};
type wrapperProps = {
  imgIndex: number;
  idx: number;
  children?: React.ReactNode;
};
const CardWrapper = ({ imgIndex, idx, children }: wrapperProps) => {
  return (
    <motion.div
      key={idx}
      animate={{
        scale: imgIndex === idx ? 1 : 0.85,
      }}
      transition={SPRING_OPTIONS}
      className="w-full h-full min-w-full"
    >
      {children}
    </motion.div>
  );
};
type dotProps = {
  imgIndex: number;
  setImgIndex: React.Dispatch<React.SetStateAction<number>>;
  cards: any[];
};
const Dots = ({ imgIndex, setImgIndex, cards }: dotProps) => {
  return (
    <div
      dir="rtl"
      className="flex w-full h-3 items-center justify-center gap-2"
    >
      {cards.map((_, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${
              idx === imgIndex ? "bg-white" : "bg-white/10"
            }`}
          />
        );
      })}
    </div>
  );
};

export default Carousel;
