import { Button } from "components/ui/Button";
import QuestionCard from "./QuestionCard";
import CircularProgress from "components/ui/CircularProgress";
import { User } from "models/user";
import UserSlider from "./UserSlider";

type props = {
  showResult: () => void;
  isAdmin: boolean;
  isLoading: boolean;
  currentAnswerSelection: User | null;
};
const Loader = ({
  showResult,
  isAdmin,
  isLoading,
  currentAnswerSelection,
}: props) => {
  const rennderAdminButtons = () => {
    return (
      <Button disabled={isLoading} onClick={showResult} className="px-4">
        {isLoading ? <CircularProgress /> : <p>{"הצג תוצאות"}</p>}
      </Button>
    );
  };
  return (
    <div className="flex flex-col gap-4 h-full">
      <QuestionCard
        question="נחכה שכולם יענו"
        renderButtons={!isAdmin ? undefined : rennderAdminButtons}
      />
      {!!currentAnswerSelection && (
        <div
          dir="rtl"
          className="flex justify-center items-center snap-x snap-mandatory overflow-x-auto h-[60%] w-full py-2 flex-shrink-0"
        >
          <UserSlider user={currentAnswerSelection} />
        </div>
      )}
    </div>
  );
};

export default Loader;
