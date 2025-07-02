import { TimerConfig } from '@/types';

export const QUIZ_CONFIG: TimerConfig = {
  DEFAULT_TIME_MS: 4000,
  MIN_TIME_MS: 1500,
  TIMER_STEP_MS: 1000,
  WRONG_ANSWER_DISPLAY_MS: 1000,
} as const;

export const COMBO_MULTIPLIER_CONFIG = {
  LEVEL_1: { STREAK: 5, MULTIPLIER: 1.5 },
  LEVEL_2: { STREAK: 25, MULTIPLIER: 2.0 },
  LEVEL_3: { STREAK: 50, MULTIPLIER: 3.0 },
} as const;
