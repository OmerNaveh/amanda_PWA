import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface props {
  resetAll: () => void;
}
const useScreenChange = ({ resetAll }: props) => {
  const navigate = useNavigate();
  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState !== "hidden" || !resetAll) return;
      resetAll();
      navigate("/");
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return;
};

export default useScreenChange;
