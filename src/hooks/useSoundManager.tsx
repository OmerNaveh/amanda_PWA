import { useEffect } from "react";
import gameTrack from "assets/sounds/game-track.mp3";

type SoundManagerProps = {
  isSoundOn: boolean;
};
const useSoundManager = ({ isSoundOn }: SoundManagerProps) => {
  useEffect(() => {
    if (!isSoundOn) return;

    const audio = new Audio(gameTrack);
    audio.loop = true;

    const play = async () => {
      try {
        await audio.play();
      } catch (err) {
        console.error("Autoplay failed:", err);
      }
    };

    play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isSoundOn]);
};

export default useSoundManager;
