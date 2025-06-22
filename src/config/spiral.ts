import type { TimerConfig } from '@/types';

export const SPIRAL_CONFIG: TimerConfig = {
  DEFAULT_TIME_MS: 6000, // Longer default time for spiral mode
  MIN_TIME_MS: 2000, // Higher minimum time
  TIMER_STEP: 800, // Smaller steps for more gradual acceleration
} as const;
