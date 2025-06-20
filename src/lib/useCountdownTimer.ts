import { useCallback, useEffect, useState } from 'react';

export function useCountdownTimer(
  totalTimeMs: number,
  onTimeout: () => void
) {
  const [timeLeft, setTimeLeft] = useState(totalTimeMs);

  const resetTimer = useCallback(() => {
    setTimeLeft(totalTimeMs);
  }, [totalTimeMs]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 50));
    }, 50);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeout]);

  const timeRemainingPct = (timeLeft / totalTimeMs) * 100;

  return {
    timeLeft,
    resetTimer,
    timeRemainingPct
  };
}
