import { useRef } from "react";

import CircularProgress from "components/ui/CircularProgress";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { User } from "models/user";
import GradientButton from "components/ui/GradientButton";

type props = {
  user: User;
  onClick?: (User: User) => void;
  isActiveUser?: boolean;
  isLoading?: boolean;
};
const UserSlider = ({ user, onClick, isActiveUser, isLoading }: props) => {
  const cardRef = useRef(null);
  const isVisible = useIntersectionObserver(cardRef, {
    root: null, // Observe intersection relative to the viewport
    threshold: 0.6, // 60% visibility
  });

  if (!user) return null;
  return (
    <div
      ref={cardRef}
      key={user.id}
      dir="rtl"
      className="flex-1 flex flex-col gap-4 justify-center bg-card rounded-lg p-4 border-2 border-card max-w-md mx-auto h-full w-full"
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
