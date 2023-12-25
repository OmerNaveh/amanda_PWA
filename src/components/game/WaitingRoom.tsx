import { useMutation } from "react-query";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { User } from "models/user";
import { startSession } from "services/apiClient";

type props = {
  participents: User[];
  spaceId: number;
};
const WaitingRoom = ({ participents, spaceId }: props) => {
  const { mutate, isLoading } = useMutation(() => startSession(spaceId), {});
  const startGame = async () => {
    mutate();
  };
  return (
    <div className="flex flex-col text-center gap-4 h-full">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-bold">Waiting for more players...</h3>
        <p className="text-white">
          {participents.length}{" "}
          {participents.length >= 2 ? "players have" : "player has"} joined the
          game
        </p>
      </div>
      <div className="flex flex-wrap gap-4 px-4 max-h-[60%] overflow-y-auto">
        {participents.map((user) => (
          <div
            key={user.id}
            className="flex flex-col items-center text-white bg-gray-800 rounded-lg shadow p-4 w-[calc(25%-1rem)]"
          >
            <div
              className="h-10 w-10 rounded-full mb-2"
              style={{ backgroundColor: `rgb(${user.color})` }}
            />
            <span className="text-sm line-clamp-1">{user.name}</span>
          </div>
        ))}
      </div>
      <Button onClick={startGame} className="mt-auto">
        {isLoading ? <CircularProgress /> : "Start Game"}
      </Button>
    </div>
  );
};

export default WaitingRoom;
