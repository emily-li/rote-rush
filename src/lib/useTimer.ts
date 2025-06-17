import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseTimerOptions {
  totalTimeMs: number;
  onTimeout: () => void;
}

export interface UseTimerReturn {
  totalTimeMs: number;
  timeLeftMs: number;
  resetTimer: () => void;
  setTimeLeftMs: (time: number) => void;
}

export function useTimer({
  totalTimeMs,
  onTimeout,
}: UseTimerOptions): UseTimerReturn {
  const [timeLeftMs, setTimeLeftMs] = useState(totalTimeMs);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    const intervalDuration = 50;
    const interval: number | null =
      timeLeftMs > 0
        ? window.setInterval(() => {
            setTimeLeftMs((prevTimeLeftMs) =>
              Math.max(0, prevTimeLeftMs - intervalDuration),
            );
          }, intervalDuration)
        : null;

    if (timeLeftMs === 0) {
      if (interval !== null) clearInterval(interval);
      onTimeoutRef.current();
    }

    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [timeLeftMs]);

  const resetTimer = useCallback(() => {
    setTimeLeftMs(totalTimeMs);
  }, [totalTimeMs]);

  return {
    totalTimeMs,
    timeLeftMs,
    resetTimer,
    setTimeLeftMs,
  };
}
