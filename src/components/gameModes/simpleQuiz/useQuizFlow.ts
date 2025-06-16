import { useCallback, useRef } from 'react';

export interface UseQuizFlowOptions {
  onNextCharacter: () => void;
  onResetTimer: () => void;
}

export interface UseQuizFlowReturn {
  showIncorrectAndProceed: (delay?: number) => void;
  showTimeoutAndProceed: (delay?: number) => void;
  proceedToNext: () => void;
}

export function useQuizFlow({ onNextCharacter, onResetTimer }: UseQuizFlowOptions): UseQuizFlowReturn {
  const timeoutRef = useRef<number | null>(null);

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const proceedToNext = useCallback(() => {
    clearPendingTimeout();
    onNextCharacter();
    onResetTimer();
  }, [clearPendingTimeout, onNextCharacter, onResetTimer]);

  const showIncorrectAndProceed = useCallback((delay = 1000) => {
    clearPendingTimeout();
    timeoutRef.current = window.setTimeout(() => {
      proceedToNext();
    }, delay);
  }, [clearPendingTimeout, proceedToNext]);

  const showTimeoutAndProceed = useCallback((delay = 1500) => {
    clearPendingTimeout();
    timeoutRef.current = window.setTimeout(() => {
      proceedToNext();
    }, delay);
  }, [clearPendingTimeout, proceedToNext]);

  return {
    showIncorrectAndProceed,
    showTimeoutAndProceed,
    proceedToNext,
  };
}