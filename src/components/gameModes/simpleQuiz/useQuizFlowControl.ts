import { useCallback, useRef } from 'react';

export interface UseQuizFlowOptions {
  onNextQuestion: () => void;
  onResetTimer: () => void;
}

export interface UseQuizFlowActions {
  proceedToNext: () => void;
  showIncorrectAndProceed: (delay?: number) => void;
  showTimeoutAndProceed: (delay?: number) => void;
  cancelPendingTransition: () => void;
}

export interface UseQuizFlowReturn {
  actions: UseQuizFlowActions;
}

/**
 * Flow control for quiz transitions and timing
 */
export function useQuizFlowControl({
  onNextQuestion,
  onResetTimer,
}: UseQuizFlowOptions): UseQuizFlowReturn {
  const timeoutRef = useRef<number | null>(null);

  const cancelPendingTransition = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const proceedToNext = useCallback(() => {
    cancelPendingTransition();
    onNextQuestion();
    onResetTimer();
  }, [cancelPendingTransition, onNextQuestion, onResetTimer]);

  const showIncorrectAndProceed = useCallback(
    (delay = 1000) => {
      cancelPendingTransition();
      timeoutRef.current = window.setTimeout(() => {
        proceedToNext();
      }, delay);
    },
    [cancelPendingTransition, proceedToNext],
  );

  const showTimeoutAndProceed = useCallback(
    (delay = 1500) => {
      cancelPendingTransition();
      timeoutRef.current = window.setTimeout(() => {
        proceedToNext();
      }, delay);
    },
    [cancelPendingTransition, proceedToNext],
  );

  return {
    actions: {
      proceedToNext,
      showIncorrectAndProceed,
      showTimeoutAndProceed,
      cancelPendingTransition,
    },
  };
}
