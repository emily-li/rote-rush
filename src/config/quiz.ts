import { TimerConfig } from '@/types';

export const QUIZ_CONFIG: TimerConfig = {
  DEFAULT_TIME_MS: 4000,
  MIN_TIME_MS: 1500,
  TIMER_STEP_MS: 1000,
  WRONG_ANSWER_DISPLAY_MS: 1000,
} as const;
