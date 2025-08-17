import { useEffect, useRef, useState } from "react";

export default function useTimer(start = false) {
  const [seconds, setSeconds] = useState(0);
  const runningRef = useRef(start);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (runningRef.current) startTimer();
    return () => stopTimer();
  }, []);

  function startTimer() {
    if (intervalRef.current) return;
    runningRef.current = true;
    intervalRef.current = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
  }
  function stopTimer() {
    runningRef.current = false;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }
  function resetTimer() {
    setSeconds(0);
  }

  return {
    seconds,
    startTimer,
    stopTimer,
    resetTimer,
    running: runningRef.current,
  };
}
