import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { User } from "models/user";

const TOTAL_ANIMATION_DURATION = 5000;
const CYCLE_INTERVAL = 300;

const showFireworks = () => {
  const colors = ["#FFFFFF", "#211134", "#97A9F6"];
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors,
  });
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors,
  });
};

const useHighlightWinner = (result: User[] | null, participents: User[]) => {
  const [currentHighlight, setCurrentHighlight] = useState<number>(0);
  const [animationInProgress, setAnimationInProgress] = useState<boolean>(true);

  useEffect(() => {
    const winnerId = result?.[0]?.id;
    if (!winnerId || !animationInProgress) return;

    if (participents.length <= 1) {
      showFireworks();
      return;
    }

    const cycleInterval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % participents.length);
    }, CYCLE_INTERVAL);

    const stopAnimationTimeout = setTimeout(() => {
      clearInterval(cycleInterval);
      const winnerIndex = participents.findIndex((p) => p.id === winnerId);
      if (winnerIndex !== -1) {
        setCurrentHighlight(winnerIndex);
      }
      setAnimationInProgress(false);
      showFireworks();
    }, TOTAL_ANIMATION_DURATION);

    return () => {
      clearInterval(cycleInterval);
      clearTimeout(stopAnimationTimeout);
      setCurrentHighlight(0);
    };
  }, [animationInProgress, participents, result]);

  return { currentHighlight };
};

export default useHighlightWinner;
