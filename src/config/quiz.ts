import type { QuizConfig } from '@/types';

export const QUIZ_CONFIG: QuizConfig = {
  DEFAULT_TIME_MS: 4000,
  MIN_TIME_MS: 1500,
  TIMER_STEP: 1000,
  WEIGHT_DECREASE: -2,
  WEIGHT_INCREASE: 2,
  MIN_WEIGHT: 1,
} as const;
