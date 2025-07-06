import { useCallback, useEffect, useRef, useState } from 'react';

type UseTimerOptions = {
  totalTimeMs: number;
  onTimeout: () => void;
  autoStart?: boolean;
};

export function useTimer({
  totalTimeMs,
  onTimeout,
  autoStart = true,
}: UseTimerOptions) {
  const sanitizedTotalTimeMs = Math.max(0, totalTimeMs);
  const [timeLeftMs, setTimeLeftMs] = useState(sanitizedTotalTimeMs);
  const [isPaused, setIsPaused] = useState(!autoStart);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(
    (newTotalTime?: number) => {
      const timeToSet =
        newTotalTime !== undefined
          ? Math.max(0, newTotalTime)
          : sanitizedTotalTimeMs;
      setTimeLeftMs(timeToSet);
      setIsPaused(!autoStart);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    },
    [sanitizedTotalTimeMs, autoStart],
  );

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  useEffect(() => {
    if (isPaused || timeLeftMs <= 0) {
      if (timeLeftMs <= 0 && !isPaused) {
        // Only call onTimeout if timer actually ran out
        onTimeout();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeftMs((prev) => Math.max(0, prev - 10));
    }, 10);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPaused, onTimeout]);

  // Reset timer if totalTimeMs changes
  useEffect(() => {
    resetTimer(totalTimeMs);
  }, [totalTimeMs, resetTimer]);

  return {
    timeLeftMs,
    totalTimeMs: sanitizedTotalTimeMs,
    isPaused,
    resetTimer,
    pauseTimer,
    resumeTimer,
  };
}
