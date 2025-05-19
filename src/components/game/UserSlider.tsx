import { useRef } from "react";
import { Crown } from "lucide-react";
import CircularProgress from "components/ui/CircularProgress";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { User } from "models/user";
import GradientButton from "components/ui/GradientButton";

type props = {
  user: User;
  onClick?: (User: User) => void;
  isActiveUser?: boolean;
  isGameSummmary?: boolean;
  isWinner?: boolean;
  isLoading?: boolean;
};
const UserSlider = ({
  user,
  onClick,
  isActiveUser,
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
      className="flex flex-col gap-4 bg-card rounded-lg p-4 border-2 border-card max-w-md mx-auto flex-1"
    >
      <div className="relative mx-auto flex items-center justify-center">
        <div
          className="w-24 h-24 rounded-full"
          style={{ backgroundColor: `rgb(${user.color})` }}
        />
        {isActiveUser && (
          <div className="absolute bg-black/10 p-2 text-white text-sm rounded-full animate-pulse">
            אני
          </div>
        )}
      </div>
      <p dir="rtl" className="font-medium text-lg truncate mx-auto w-full">
        {user.name}
      </p>

      {isGameSummmary && (
        <div dir="rtl" className="flex flex-col gap-1">
          {isWinner && (
            <div className="flex justify-center">
              <Crown className="h-5 w-5 fill-yellow-400" />
            </div>
          )}
          <p className="font-semibold text-lg"> {user?.score || 0} נק׳</p>
        </div>
      )}
      {!!onClick && (
        <GradientButton
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
        </GradientButton>
      )}
    </div>
  );
};
export default UserSlider;
