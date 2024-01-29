import { Crown } from "lucide-react";
import { useMutation } from "react-query";
import { Button } from "components/ui/Button";
import { User } from "models/user";
import { startSession } from "services/apiClient";
import CircularProgress from "components/ui/CircularProgress";
import { QuestionTypeResponse } from "models/responses";
type props = {
  spaceId: number;
  userId: number;
  gameSummary: User[];
  selectedQuestionType: QuestionTypeResponse | null;
  resetAllStates: () => void;
};
const GameResults = ({
  spaceId,
  gameSummary,
  userId,
  selectedQuestionType,
  resetAllStates,
}: props) => {
  const { mutate, isLoading } = useMutation(
    () =>
      startSession({
        spaceId,
        userId,
        questionTypeId: selectedQuestionType?.id,
      }),
    {}
  );
  const playNewGame = async () => {
    mutate();
  };
  const goBack = () => {
    resetAllStates();
  };
  console.log(gameSummary);
  return (
    <div className="flex flex-col gap-4 h-full">
      <h1 className="text-3xl font-bold text-center">
        {"נו מי שתה הכי הרבה?"}
      </h1>
      <div className="flex flex-col items-center gap-2">
        <Crown className="text-yellow-400 h-8 w-8" />
        <h3 className="text-xl font-semibold">
          {gameSummary.length >= 2 ? "צ׳אמפס" : "צ׳אמפ"}:
        </h3>
        <ul>
          {gameSummary.map((winner) => (
            <li
              key={winner.id}
              className="mt-2 p-2"
              style={{
                backgroundColor: `rgb(${winner.color})`,
              }}
            >
              {winner.name}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto flex flex-col gap-4">
        <Button onClick={playNewGame}>
          {isLoading ? <CircularProgress /> : "עוד הפעם"}
        </Button>
        <Button onClick={goBack}>{"נחזור נפרוס אופציות"}</Button>
      </div>
    </div>
  );
};

export default GameResults;
