import { useEffect, useState } from "react";

type CountdownTimerProps = {
  initialSeconds: number;
  onCountdownComplete?: () => void;
};

const CountdownTimer = ({
  initialSeconds,
  onCountdownComplete,
}: CountdownTimerProps) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft === 0) {
      if (onCountdownComplete) {
        onCountdownComplete();
      }
      return;
    }

    const timerId = setTimeout(() => {
      setSecondsLeft(secondsLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [secondsLeft, onCountdownComplete]);

  return (
    <div className="flex items-center justify-center font-bold w-full">
      <p className="flex items-center justify-center font-bold border border-card h-8 w-8 rounded-full">
        {secondsLeft}
      </p>
    </div>
  );
};

export default CountdownTimer;
