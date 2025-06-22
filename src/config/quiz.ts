import type { TimerConfig } from '@/types';

export const QUIZ_CONFIG: TimerConfig = {
  DEFAULT_TIME_MS: 4000,
  MIN_TIME_MS: 1500,
  TIMER_STEP: 1000,
} as const;
