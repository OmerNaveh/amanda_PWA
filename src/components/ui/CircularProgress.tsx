import { cn } from "lib/utils";

type props = {
  wrapperClassName?: string;
  className?: string;
};
const CircularProgress = ({ wrapperClassName, className }: props) => {
  return (
    <div className={cn("flex justify-center items-center", wrapperClassName)}>
      <svg
        className={cn("animate-spin h-6 w-6 text-white", className)}
        viewBox="0 0 50 50"
      >
        <circle
          className="opacity-25"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <circle
          className="opacity-75"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeDasharray="80"
          strokeDashoffset="60"
        ></circle>
      </svg>
    </div>
  );
};

export default CircularProgress;
