import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseTimerOptions {
  initialTime: number;
  onTimeout: () => void;
}

export interface UseTimerReturn {
  timeLeft: number;
  timerPercentage: number;
  resetTimer: () => void;
  setTimeLeft: (time: number) => void;
}

export function useTimer({
  initialTime,
  onTimeout,
}: UseTimerOptions): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const onTimeoutRef = useRef(onTimeout);

  // Keep the callback ref updated
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // Timer logic
  useEffect(() => {
    const interval: number | null =
      timeLeft > 0
        ? window.setInterval(() => {
            setTimeLeft((timeLeft) => timeLeft - 1);
          }, 1000)
        : null;
    if (timeLeft === 0) {
      if (interval !== null) clearInterval(interval);
      onTimeoutRef.current();
    }
    return () => {
      if (interval !== null) clearInterval(interval);
    };
  }, [timeLeft]);

  const resetTimer = useCallback(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  const timerPercentage = (timeLeft / initialTime) * 100;

  return {
    timeLeft,
    timerPercentage,
    resetTimer,
    setTimeLeft,
  };
}
