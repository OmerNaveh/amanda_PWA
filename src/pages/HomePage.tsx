import React, { useState } from "react";
import { useMutation } from "react-query";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { useToast } from "components/ui/useToast";
import { hexToRgb } from "lib/colorHandling";
import { getErrorMessage } from "lib/errorHandling";
import { CreateOrJoinSpaceRequest } from "models/requests";
import { createSpace } from "services/apiClient";
import { useNavigate } from "react-router-dom";
import { HexColorPicker } from "react-colorful";

const HomePage = () => {
  const amandaIdRef = React.useRef<HTMLInputElement>(null);
  const [color, setColor] = useState("#0080ff");
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
    const nickname = nicknameRef.current?.value;
    if (!amandaId || !color || !nickname) {
      toast({ title: "Please fill out all fields", variant: "destructive" });
      return;
    }
    mutate({ amandaId, name: nickname, color: hexToRgb(color) });
  };

  return (
    <div className="page-height flex flex-col w-full mx-auto max-w-md p-4 gap-4">
      <h1 className="text-4xl font-bold text-white text-center">
        Amanda - Light up the Night
      </h1>
      <form
        onSubmit={handleStartGame}
        className="space-y-4 bg-gray-700 p-4 rounded-xl shadow-lg"
      >
        <div>
          <label
            htmlFor="amandaId"
            className="block text-sm font-medium text-gray-300"
          >
            Amanda ID
          </label>
          <input
            ref={amandaIdRef}
            type="text"
            id="amandaId"
            className="mt-1 block w-full border-0 bg-gray-600 p-3 rounded-md text-white placeholder-gray-400 focus-visible:outline-none focus:ring-4 focus:ring-purple-600 focus:ring-opacity-50"
            placeholder="Enter your Amanda ID"
          />
        </div>

        <div>
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-300"
          >
            Choose Color
          </label>
          <HexColorPicker
            color={color}
            onChange={setColor}
            className="mt-1 max-h-32"
          />
        </div>

        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-300"
          >
            Nickname
          </label>
          <input
            ref={nicknameRef}
            type="text"
            id="nickname"
            className="mt-1 block w-full border-0 bg-gray-600 p-3 rounded-md text-white placeholder-gray-400 focus-visible:outline-none focus:ring-4 focus:ring-purple-600 focus:ring-opacity-50"
            placeholder="Choose a nickname"
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <CircularProgress /> : "Join"}
        </Button>
      </form>
    </div>
  );
};

export default HomePage;
