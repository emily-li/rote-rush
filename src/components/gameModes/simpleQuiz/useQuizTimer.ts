import { useTimer as useBaseTimer } from '@/lib/useTimer';

const TOTAL_TIME_MS = 5000;

export interface UseQuizTimerState {
  totalTimeMs: number;
  timeLeftMs: number;
}

export interface UseQuizTimerActions {
  resetTimer: () => void;
}

export interface UseQuizTimerOptions {
  onTimeout: () => void;
}

export interface UseQuizTimerReturn extends UseQuizTimerState {
  actions: UseQuizTimerActions;
}

/**
 * Timer logic for quiz questions
 */
export function useQuizTimer({
  onTimeout,
}: UseQuizTimerOptions): UseQuizTimerReturn {
  const { timeLeftMs, resetTimer, totalTimeMs } = useBaseTimer({
    totalTimeMs: TOTAL_TIME_MS,
    onTimeout,
  });

  return {
    totalTimeMs,
    timeLeftMs,
    actions: {
      resetTimer,
    },
  };
}
