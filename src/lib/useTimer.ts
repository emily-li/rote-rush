import { useCallback, useEffect, useState } from 'react';

interface UseTimerOptions {
  totalTimeMs: number;
  onTimeout: () => void;
}

export function useTimer({ totalTimeMs, onTimeout }: UseTimerOptions) {
  const [timeLeftMs, setTimeLeftMs] = useState(totalTimeMs);

  const resetTimer = useCallback(() => {
    setTimeLeftMs(totalTimeMs);
  }, [totalTimeMs]);

  useEffect(() => {
    if (timeLeftMs <= 0) {
      onTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeftMs((prev) => Math.max(0, prev - 10));
    }, 10);

    return () => clearInterval(timer);
  }, [timeLeftMs, onTimeout]);

  return {
    timeLeftMs,
    totalTimeMs,
    resetTimer,
  };
}
