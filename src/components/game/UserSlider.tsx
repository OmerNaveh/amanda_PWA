import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import useIntersectionObserver from "hooks/useIntersectionObserver";
import { User } from "models/user";
import { useRef } from "react";

type props = {
  user: User;
  onClick?: (User: User) => void;
  isLoading?: boolean;
};
const UserSlider = ({ user, onClick, isLoading }: props) => {
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
      className="h-full aspect-square flex flex-col gap-4 bg-card rounded-lg p-2 border-2 border-card snap-center"
    >
      <div
        className="relative w-full aspect-square mx-auto rounded-lg"
        style={{ backgroundColor: `rgb(${user.color})` }}
      >
        <h5 className="absolute bottom-0 left-0 right-0 backdrop-blur py-1 text-base font-bold rounded-lg">
          {user.name}
        </h5>
      </div>

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
            <p className="text-xl font-semibold text-center tracking-wider">
              {"בחר"}
            </p>
          )}
        </Button>
      )}
    </div>
  );
};

export default UserSlider;
