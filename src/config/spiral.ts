import type { TimerConfig } from '@/types';

export const SPIRAL_CONFIG: TimerConfig = {
  DEFAULT_TIME_MS: 6000, // Longer default time for spiral mode
  MIN_TIME_MS: 2000, // Higher minimum time
  TIMER_STEP_MS: 800, // Smaller steps for more gradual acceleration
  WRONG_ANSWER_DISPLAY_MS: 1000, // Match QUIZ_CONFIG for consistency
} as const;
