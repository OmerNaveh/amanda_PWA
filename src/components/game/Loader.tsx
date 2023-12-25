import React from "react";
import { Button } from "components/ui/Button";

type props = {
  showResult: () => void;
};
const Loader = ({ showResult }: props) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      <h2 className="text-2xl font-bold mb-4">
        Waiting for everyone to answer...
      </h2>
      <Button onClick={showResult} className="mt-auto w-[33%] ml-auto">
        Show Results
      </Button>
    </div>
  );
};

export default Loader;
