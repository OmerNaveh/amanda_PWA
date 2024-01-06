import React, { useState } from "react";
import { useMutation } from "react-query";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { useToast } from "components/ui/useToast";
import { extractRGB } from "lib/colorHandling";
import { getErrorMessage } from "lib/errorHandling";
import { CreateOrJoinSpaceRequest } from "models/requests";
import { createSpace } from "services/apiClient";
import { useNavigate } from "react-router-dom";
import { Input } from "components/ui/input";
import { COLORS } from "constants/colors";

const HomePage = () => {
  const amandaIdRef = React.useRef<HTMLInputElement>(null);
  const [color, setColor] = useState<string | null>(null);
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
    mutate({ amandaId, name: nickname, color: extractRGB(color) });
  };

  return (
    <div className="page-height flex flex-col w-full mx-auto max-w-md p-4 gap-4">
      <h1 className="text-4xl font-bold text-white text-center">
        Amanda - Light up the Night
      </h1>
      <form
        onSubmit={handleStartGame}
        className="space-y-4 bg-ring/90 p-4 rounded-xl shadow-lg text-end"
      >
        <div>
          <label
            htmlFor="amandaId"
            className="block text-sm font-medium text-gray-300"
          >
            {"מזהה"}
          </label>
          <Input
            ref={amandaIdRef}
            type="text"
            id="amandaId"
            className="mt-1 text-white placeholder-gray-400"
            placeholder={"הכנס מזהה"}
          />
        </div>

        <div>
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-300"
          >
            {"בחר צבע"}
          </label>
          <div dir="rtl" className="flex gap-4 overflow-x-auto px-2 py-4">
            {Object.keys(COLORS).map((colorKey) => {
              const colorSelection = COLORS[colorKey];
              return (
                <Button
                  type="button"
                  variant="ghost"
                  key={colorKey}
                  onClick={() => setColor(colorSelection)}
                  className={`flex-shrink-0 w-12 h-12 rounded-full cursor-pointer ${
                    colorSelection === color
                      ? "ring-2 ring-black ring-offset-2"
                      : ""
                  }`}
                  style={{ backgroundColor: `rgb(${colorSelection})` }}
                />
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="nickname"
            className="block text-sm font-medium text-gray-300"
          >
            {"בחר שם"}
          </label>
          <Input
            ref={nicknameRef}
            type="text"
            id="nickname"
            className="mt-1 text-white placeholder-gray-400"
            placeholder={"הכנס שם"}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <CircularProgress /> : <p>{"התחל"}</p>}
        </Button>
      </form>
    </div>
  );
};

export default HomePage;
