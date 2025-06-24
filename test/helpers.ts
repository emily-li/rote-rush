/**
 * Test helpers and utilities for the test suite
 */

import { expect, vi } from 'vitest';
import type { PracticeCharacter } from '../src/types';

// Common test data
export const MOCK_CHARACTERS: PracticeCharacter[] = [
  { char: 'あ', validAnswers: ['a'] },
  { char: 'ち', validAnswers: ['chi', 'ti'] },
  { char: 'く', validAnswers: ['ku'] },
  { char: 'ろ', validAnswers: ['ro'] },
];

export type TimerStateExpectation = {
  timeLeft: number;
  total: number;
};

/**
 * Helper to assert timer state matches expectations
 */
export function expectTimerState(
  timerState: { timeLeftMs: number; totalTimeMs: number },
  expected: TimerStateExpectation,
) {
  expect(timerState.timeLeftMs).toBe(expected.timeLeft);
  expect(timerState.totalTimeMs).toBe(expected.total);
}
