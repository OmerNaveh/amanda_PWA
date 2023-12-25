import React from "react";
import { Crown } from "lucide-react";
import { useMutation } from "react-query";
import { Button } from "components/ui/Button";
import { User } from "models/user";
import { startSession } from "services/apiClient";
import CircularProgress from "components/ui/CircularProgress";
import { useNavigate } from "react-router-dom";
type props = {
  spaceId: number;
  gameSummary: User[];
};
const GameResults = ({ spaceId, gameSummary }: props) => {
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(() => startSession(spaceId), {});
  const playNewGame = async () => {
    mutate();
  };
  const goBack = () => {
    navigate("/");
  };
  return (
    <div className="flex flex-col gap-4 h-full">
      <h1 className="text-3xl font-bold text-center">Game Results</h1>
      <div className="flex flex-col items-center gap-2">
        <Crown className="text-yellow-400 h-8 w-8" />
        <h3 className="text-xl font-semibold">
          {gameSummary.length >= 2 ? "Winners" : "Winner"}:
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
          {isLoading ? <CircularProgress /> : "Play Again"}
        </Button>
        <Button onClick={goBack}>Menu</Button>
      </div>
    </div>
  );
};

export default GameResults;
