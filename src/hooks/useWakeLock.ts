import { useEffect, useRef } from "react";

const useWakeLock = () => {
  const wakeLockRef = useRef<any>(null);
  const isWakeLockSupported = () => "wakeLock" in navigator;

  useEffect(() => {
    const requestWakeLock = async () => {
      if (isWakeLockSupported() && !wakeLockRef.current) {
        try {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        } catch (err) {}
      }
    };

    const releaseWakeLock = async () => {
      if (isWakeLockSupported() && !!wakeLockRef.current) {
        try {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        } catch (err) {}
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        await requestWakeLock();
      } else {
        await releaseWakeLock();
      }
    };

    if (isWakeLockSupported()) {
      document.addEventListener("visibilitychange", handleVisibilityChange);
      requestWakeLock();
    }

    return () => {
      if (isWakeLockSupported()) {
        releaseWakeLock();
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
      }
    };
  }, []);
};

export default useWakeLock;
