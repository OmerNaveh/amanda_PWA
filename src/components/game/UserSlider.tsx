import { useRef } from "react";
import { Crown } from "lucide-react";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { User } from "models/user";

type props = {
  user: User;
  onClick?: (User: User) => void;
  isGameSummmary?: boolean;
  isWinner?: boolean;
  isLoading?: boolean;
};
const UserSlider = ({
  user,
  onClick,
  isLoading,
  isGameSummmary,
  isWinner,
}: props) => {
  const cardRef = useRef(null);
  const isVisible = useIntersectionObserver(cardRef, {
    root: null, // Observe intersection relative to the viewport
    threshold: 0.6, // 60% visibility
  });
  return (
    <div
      ref={cardRef}
      key={user.id}
      dir="rtl"
      className="h-full max-h-full shrink-0 aspect-square flex flex-col gap-4 bg-card rounded-lg p-2 border-2 border-card snap-center"
    >
      <div
        className={`relative w-full mx-auto rounded-lg 
        ${!!onClick ? "h-[40%]" : "aspect-square"}`}
        style={{ backgroundColor: `rgb(${user.color})` }}
      >
        <h5 className="absolute bottom-0 left-0 right-0 backdrop-blur py-1 text-base font-bold rounded-lg">
          {user.name}
        </h5>
      </div>
      {isGameSummmary && (
        <div dir="rtl" className="mt-auto flex flex-col gap-1">
          {isWinner && (
            <div className="flex justify-center">
              <Crown className="h-4 w-4" />
            </div>
          )}
          <p> {user?.score || 0} נק׳</p>
        </div>
      )}
      {!!onClick && (
        <Button
          disabled={isLoading}
          onClick={() => {
            onClick(user);
          }}
          className={`mt-auto transition-opacity duration-500 ${
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <p className="font-semibold text-center tracking-wider">{"בחר"}</p>
          )}
        </Button>
      )}
    </div>
  );
};

export default UserSlider;
