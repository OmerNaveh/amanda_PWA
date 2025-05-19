import React from "react";
import CircularProgress from "components/ui/CircularProgress";

const Loader = () => {
  return (
    <div className="flex-1 flex flex-col justify-center gap-4">
      <h3 className="font-bold text-xl">{"כבר מתחילים את הערב"}</h3>
      <CircularProgress className="h-12 w-12" />
    </div>
  );
};

export default Loader;
