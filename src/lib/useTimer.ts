import { useCallback, useEffect, useState } from 'react';

interface UseTimerOptions {
  totalTimeMs: number;
  onTimeout: () => void;
}

export function useTimer({ totalTimeMs, onTimeout }: UseTimerOptions) {
  // Handle negative totalTimeMs by defaulting to 0
  const sanitizedTotalTimeMs = Math.max(0, totalTimeMs);
  const [timeLeftMs, setTimeLeftMs] = useState(sanitizedTotalTimeMs);

  const resetTimer = useCallback(() => {
    setTimeLeftMs(sanitizedTotalTimeMs);
  }, [sanitizedTotalTimeMs]);

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
    totalTimeMs: sanitizedTotalTimeMs,
    resetTimer,
  };
}
