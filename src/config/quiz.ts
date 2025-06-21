import type { QuizConfig } from '@/types';

/**
 * Quiz configuration constants for timing, scoring, and character weights
 */
export const QUIZ_CONFIG: QuizConfig = {
  /** Default time per character in milliseconds */
  DEFAULT_TIME_MS: 5000,
  /** Minimum time per character in milliseconds */
  MIN_TIME_MS: 1500,
  /** Time reduction step when reaching combo milestones */
  TIMER_STEP: 1000,
  /** Weight adjustment for correct answers (makes character appear less) */
  WEIGHT_DECREASE: -2,
  /** Weight adjustment for incorrect answers (makes character appear more) */
  WEIGHT_INCREASE: 2,
  /** Minimum weight value to ensure all characters stay in rotation */
  MIN_WEIGHT: 1,
} as const;
