/**
 * Test helpers and utilities for the test suite
 */

import { expect, vi } from 'vitest';
import type { PracticeCharacter } from '@/lib/characterLoading';

// Common test data
export const MOCK_CHARACTERS: PracticeCharacter[] = [
  { char: 'あ', validAnswers: ['a'] },
  { char: 'ち', validAnswers: ['chi', 'ti'] },
];

// Common mock functions factory
export const createMockTimeoutManager = () => ({
  setTimeout: vi.fn((_callback: () => void, _delay: number) => {
    // Return a timeout ID but don't execute automatically for controlled testing
    return 123;
  }),
  clearTimeout: vi.fn(),
});

// Helper to create consistent timer mock
export const createMockTimer = () => ({
  timeLeftMs: 5000,
  resetTimer: vi.fn(),
  totalTimeMs: 5000,
  setTimeLeftMs: vi.fn(),
});

// Helper to create input validation mocks
export const createMockInputValidation = () => ({
  normalizeInput: vi.fn((input: string) => input.toLowerCase().trim()),
  checkAnswerMatch: vi.fn(),
  checkValidStart: vi.fn(),
});

// Helper to create character loading mocks
export const createMockCharacterLoading = () => ({
  loadPracticeCharacters: vi.fn(() => MOCK_CHARACTERS),
  getRandomCharacter: vi.fn((chars: PracticeCharacter[]) => chars[1]),
});

// Test event factories
export const createInputChangeEvent = (
  value: string,
): React.ChangeEvent<HTMLInputElement> =>
  ({
    target: { value },
  }) as React.ChangeEvent<HTMLInputElement>;

export const createKeyboardEvent = (
  key: string,
): React.KeyboardEvent<HTMLInputElement> =>
  ({
    key,
  }) as React.KeyboardEvent<HTMLInputElement>;

// Async test helpers
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Custom matchers for better assertions
export const expectTimerState = (
  timer: any,
  expected: { timeLeft: number; total: number },
) => {
  expect(timer.timeLeftMs).toBe(expected.timeLeft);
  expect(timer.totalTimeMs).toBe(expected.total);
};

export const expectGameState = (
  gameState: any,
  expected: Partial<{
    score: number;
    combo: number;
    userInput: string;
    currentChar: PracticeCharacter;
  }>,
) => {
  if (expected.score !== undefined) {
    expect(gameState.score).toBe(expected.score);
  }
  if (expected.combo !== undefined) {
    expect(gameState.combo).toBe(expected.combo);
  }
  if (expected.userInput !== undefined) {
    expect(gameState.userInput).toBe(expected.userInput);
  }
  if (expected.currentChar !== undefined) {
    expect(gameState.currentChar).toEqual(expected.currentChar);
  }
};
