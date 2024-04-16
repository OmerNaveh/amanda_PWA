import CountdownItem from "components/ui/CountdownItem";
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

  return <CountdownItem num={secondsLeft} text={"שניות"} />;
};

export default CountdownTimer;
