import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { ReactComponent as Amanda } from "assets/amanda.svg";
import { ReactComponent as Person } from "assets/person.svg";
import { ReactComponent as Paint } from "assets/paintpalette.svg";
import { ReactComponent as TikTok } from "assets/TikTok.svg";
import { ReactComponent as Youtube } from "assets/YouTube.svg";
import { ReactComponent as Instagram } from "assets/Instagram.svg";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { useToast } from "components/ui/useToast";
import { extractRGB } from "lib/colorHandling";
import { getErrorMessage } from "lib/errorHandling";
import { CreateOrJoinSpaceRequest } from "models/requests";
import { createSpace } from "services/apiClient";
import { Input } from "components/ui/input";
import { COLORS } from "constants/colors";
import { useGameContext } from "context/GameContext";
import { useAuthContext } from "context/AuthContext";

const HomePage = () => {
  const [color, setColor] = useState<string | null>(null);
  const amandaIdRef = React.useRef<HTMLInputElement>(null);
  const nicknameRef = React.useRef<HTMLInputElement>(null);

  const { setSpace, setParticipents } = useGameContext();
  const { setUser } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { isLoading, mutate } = useMutation(
    ({ amandaId, color, name }: CreateOrJoinSpaceRequest) =>
      createSpace({ amandaId, name, color }),
    {
      onSuccess: (data) => {
        console.log(data);
        setSpace(data.space);
        setParticipents(data.space.users);
        setUser(data.user);
        navigate("/game");
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
    <div className="page-height flex flex-col w-full mx-auto max-w-md p-4">
      <form
        dir="rtl"
        onSubmit={handleStartGame}
        className="bg-card border-[1.5px] border-card bg-blend-overlay px-4 py-8 rounded-2xl flex flex-col gap-8"
      >
        <div className="flex items-center gap-4" dir="rtl">
          <Amanda className="h-8 w-8" />
          <Input ref={amandaIdRef} type="text" placeholder={"הכנס מזהה"} />
        </div>
        <div className="flex items-center gap-4" dir="rtl">
          <Person className="h-8 w-8" />
          <Input ref={nicknameRef} placeholder={"הכנס כינוי"} />
        </div>

        <div>
          <label htmlFor="color" className="block font-medium">
            {"בחר צבע"}
          </label>
          <div className="flex items-center gap-4 ">
            <Paint className="h-8 w-8 flex-shrink-0" />
            <div dir="rtl" className="flex gap-4 overflow-x-auto px-2 py-4">
              {Object.keys(COLORS).map((colorKey) => {
                const colorSelection = COLORS[colorKey];
                return (
                  <Button
                    type="button"
                    variant="ghost"
                    key={colorKey}
                    onClick={() => setColor(colorSelection)}
                    className={`flex-shrink-0 w-10 h-10 rounded-lg cursor-pointer ${
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
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <CircularProgress /> : <p>{"הצטרף"}</p>}
        </Button>
      </form>

      <footer className="mt-auto text-center flex flex-col gap-2">
        <p className="text-sm">{"עקבו אחרינו והצטרפו לטירוף"}</p>
        <div className="flex justify-center gap-2 items-center">
          <a
            href="https://www.instagram.com/cheerswithamanda/"
            target="_blank"
            rel="noreferrer"
            className="h-6 w-6 cursor-pointer active:opacity-50"
          >
            <TikTok className="h-6 w-6" />
          </a>
          <a
            href="https://www.instagram.com/cheerswithamanda/"
            target="_blank"
            rel="noreferrer"
            className="h-6 w-6 cursor-pointer active:opacity-50"
          >
            <Instagram className="h-6 w-6" />
          </a>
          <a
            href="https://www.instagram.com/cheerswithamanda/"
            target="_blank"
            rel="noreferrer"
            className="h-6 w-6 cursor-pointer active:opacity-50"
          >
            <Youtube className="h-6 w-6" />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
