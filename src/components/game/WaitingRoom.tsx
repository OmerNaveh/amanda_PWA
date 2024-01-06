import { useMutation, useQuery } from "react-query";
import { Lock, ArrowBigLeft, X } from "lucide-react";
import { Button } from "components/ui/Button";
import CircularProgress from "components/ui/CircularProgress";
import { User } from "models/user";
import { getQuestionTypes, startSession } from "services/apiClient";
import { useState } from "react";
import BottomSheet from "components/ui/BottomSheet";
import { useNavigate } from "react-router-dom";

type props = {
  participents: User[];
  spaceId: number;
  userId: number;
};
const WaitingRoom = ({ participents, spaceId, userId }: props) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(0);
  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { data: questionTypes, isLoading: loadingQuestionTypes } = useQuery({
    queryKey: "questionTypes",
    queryFn: () => getQuestionTypes(),
  });
  const { mutate, isLoading } = useMutation(
    (questionTypeId?: number) =>
      startSession({
        spaceId,
        userId,
        questionTypeId,
      }),
    {}
  );
  const startGame = (questionTypeId?: number) => {
    mutate(questionTypeId);
  };
  return (
    <div className="flex flex-col text-center gap-4 h-full">
      {loadingQuestionTypes ? (
        <div className="h-full w-full flex justify-center items-center">
          <CircularProgress className="h-12 w-12" />
        </div>
      ) : !!questionTypes ? (
        <div className="flex flex-col gap-2 h-full w-full overflow-hidden">
          <div className="flex items-center">
            <Button
              variant={"ghost"}
              className="flex justify-end p-0"
              onClick={() => {
                navigate("/");
              }}
            >
              <ArrowBigLeft className="h-6 w-6" />
            </Button>
            <h3 className="text-2xl w-full">{"בחר סוג משחק"}</h3>
          </div>
          <div
            dir="rtl"
            className="px-2 flex gap-4 items-center overflow-x-auto flex-shrink-0"
          >
            {questionTypes.map((category, index) => {
              return (
                <div
                  className={`${
                    index === selectedCategory ? "font-bold underline" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategory(index);
                  }}
                  style={{ whiteSpace: "nowrap" }}
                  key={category.id}
                >
                  <div>{category.name}</div>
                </div>
              );
            })}
          </div>
          <div
            dir="rtl"
            className="p-2 grid grid-cols-2  gap-4 overflow-x-auto"
          >
            {selectedCategory !== null &&
              questionTypes[selectedCategory].questionTypes.map(
                (questionType) => {
                  return (
                    <div
                      key={questionType.id}
                      className="h-full w-full bg-ring/90 flex flex-col gap-2 items-center p-2 rounded-lg"
                    >
                      <h4 className=" font-bold">{questionType.name}</h4>
                      <img
                        src={questionType.picture}
                        alt="question type image"
                        className="h-28 w-28 object-contain rounded-lg"
                      />
                      <p>{questionType.description}</p>
                      <Button
                        disabled={
                          isLoading || !!questionType?.isSubscriptionBased
                        }
                        onClick={() => {
                          startGame(questionType.id);
                        }}
                        className="mt-auto"
                      >
                        {isLoading ? (
                          <CircularProgress />
                        ) : !!questionType?.isSubscriptionBased ? (
                          <Lock className="h-6 w-6" />
                        ) : (
                          <p>{"יאללה תן לשחק"}</p>
                        )}
                      </Button>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex justify-center items-center px-4">
          <p className="text-center text-4xl">
            {"סעמק משהו השתבש, יאללה תלחצו על ריפרש"}
          </p>
        </div>
      )}
      <div className="flex justify-center flex-shrink-0">
        <Button variant="outline" dir="rtl" onClick={() => setOpen(true)}>
          {participents.length}
          {" אנשים במשחק"}
        </Button>
      </div>
      <BottomSheet
        open={open}
        setOpenModal={() => {
          setOpen(false);
        }}
        className="page-height"
      >
        <div className="flex items-center">
          <h3 className="text-center text-xl font-bold w-full" dir="rtl">
            {"האלופים והאלופות"}
          </h3>
          <Button
            variant={"ghost"}
            className="flex p-0 w-fit"
            onClick={() => {
              setOpen(false);
            }}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 px-4 overflow-y-auto">
          {participents.map((user) => (
            <div
              key={user.id}
              className="flex flex-col items-center text-white bg-gray-800 rounded-lg shadow p-4 h-fit w-[calc(50%-1rem)]"
            >
              <div
                className="h-10 w-10 rounded-full mb-2"
                style={{ backgroundColor: `rgb(${user.color})` }}
              />
              <span className="text-sm line-clamp-1">{user.name}</span>
            </div>
          ))}
        </div>
      </BottomSheet>
    </div>
  );
};

export default WaitingRoom;
