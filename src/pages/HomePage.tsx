import React from "react";
import { useMutation } from "react-query";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { useToast } from "components/ui/useToast";
import { hexToRgb } from "lib/colorHandling";
import { getErrorMessage } from "lib/errorHandling";
import { CreateOrJoinSpaceRequest } from "models/requests";
import { createSpace } from "services/apiClient";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const amandaIdRef = React.useRef<HTMLInputElement>(null);
  const colorRef = React.useRef<HTMLInputElement>(null);
  const nicknameRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation(
    ({ amandaId, color, name }: CreateOrJoinSpaceRequest) =>
      createSpace({ amandaId, name, color }),
    {
      onSuccess: (data) => {
        console.log(data);
        navigate("/game", { state: { spaceData: data } });
      },
      onError: (error) => {
        const message = getErrorMessage(error);
        toast({ title: message, variant: "destructive" });
      },
    }
  );

  const handleStartGame = async (e: React.FormEvent) => {
    e.preventDefault();
    const amandaId = amandaIdRef.current?.value;
    const color = colorRef.current?.value;
    const nickname = nicknameRef.current?.value;
    if (!amandaId || !color || !nickname) {
      toast({ title: "Please fill out all fields", variant: "destructive" });
      return;
    }
    mutate({ amandaId, name: nickname, color: hexToRgb(color) });
  };
  return (
    <div className="flex flex-col text-center gap-4 px-4 pt-4 page-height">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-bold">Amanda - Light up the Night</h3>
      </div>
      <form onSubmit={handleStartGame} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 items-start">
          <label htmlFor="amandaId" className="font-medium text-white">
            Amanda ID
          </label>
          <input
            ref={amandaIdRef}
            type="text"
            id="amandaId"
            className="w-full text-primary text-lg focus-visible:outline-secondary px-4 py-2 rounded-md"
          />
        </div>

        <div className="flex flex-col gap-1 items-start">
          <label htmlFor="color" className=" font-medium text-white">
            Input Color
          </label>
          <input
            ref={colorRef}
            type="color"
            id="color"
            className="w-full text-primary text-lg focus-visible:outline-secondary px-4 py-2 rounded-md"
          />
        </div>

        <div className="flex flex-col gap-1 items-start">
          <label htmlFor="nickname" className=" font-medium text-white">
            Nickname
          </label>
          <input
            ref={nicknameRef}
            type="text"
            id="nickname"
            className="w-full text-primary text-lg focus-visible:outline-secondary px-4 py-2 rounded-md"
          />
        </div>
        <Button type="submit" className="mt-4">
          {isLoading ? <CircularProgress /> : "Join"}
        </Button>
      </form>
    </div>
  );
};

export default HomePage;
