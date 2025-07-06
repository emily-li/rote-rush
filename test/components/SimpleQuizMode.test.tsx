

import { act, fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import SimpleQuizMode from '../../src/components/simple/SimpleQuizMode';
import { GameMode, type PracticeCharacter } from '../../src/types';

// Testing constants - match these with the app config for consistency
const WEIGHT_DECREASE = 1;
const WEIGHT_INCREASE = 2;
const MIN_WEIGHT = 1;
const DEFAULT_TIMEOUT = 10000;
const WRONG_ANSWER_DISPLAY_TIME = 1500;

/**
 * Helper function to simulate weight decrease for correct answers
 */
function decreaseWeight(characters: PracticeCharacter[], char: string) {
  return characters.map((c) =>
    c.char === char
      ? {
          ...c,
          weight: Math.max(MIN_WEIGHT, (c.weight || 1) - WEIGHT_DECREASE),
        }
      : c,
  );
}

/**
 * Helper function to simulate weight increase for incorrect answers
 */
function increaseWeight(characters: PracticeCharacter[], char: string) {
  return characters.map((c) =>
    c.char === char ? { ...c, weight: (c.weight || 1) + WEIGHT_INCREASE } : c,
  );
}

// Mock dependencies
vi.mock('../../src/lib/characterLoading', () => {
  return {
    loadPracticeCharacters: () => [
      { char: 'あ', validAnswers: ['a'], weight: 5 },
      { char: 'い', validAnswers: ['i'], weight: 3 },
    ],
    getWeightedRandomCharacter: (chars: PracticeCharacter[]) => chars[0],
    saveCharacterWeights: vi.fn(),
  };
});

describe('SimpleQuizMode functionality', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  /**
   * Helper to trigger a timeout in the game
   */
  function triggerTimeout() {
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });

    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });
  }
  describe('Basic gameplay', () => {
    it('maintains character display after answering or skipping', () => {
      render(
        <SimpleQuizMode
          currentGameMode={GameMode.SIMPLE}
          onGameModeChange={() => { /* do nothing */ }}
        />,
      );
      const input = screen.getByPlaceholderText(/romanized/i);

      // Enter correct answer
      fireEvent.change(input, { target: { value: 'a' } });

      // Need to wait for the validation delay
      act(() => {
        vi.advanceTimersByTime(10);
      });

      expect(screen.getByText('あ')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText('あ')).toBeInTheDocument();
    });
  });

  describe('Timeout handling', () => {
    it('resets timeout count on correct answer', () => {
      render(
        <SimpleQuizMode
          currentGameMode={GameMode.SIMPLE}
          onGameModeChange={() => { /* do nothing */ }}
        />,
      );
      const input = screen.getByPlaceholderText(/romanized/i);

      // First timeout
      triggerTimeout();

      // Give correct answer to reset timeout count
      fireEvent.change(input, { target: { value: 'a' } });

      // Need to wait for the validation delay
      act(() => {
        vi.advanceTimersByTime(10);
      });

      // Need more time for score update
      act(() => {
        vi.advanceTimersByTime(90);
      });

      expect(
        screen.getByLabelText((_, el) => el?.getAttribute('aria-label')?.startsWith('Score is')),
      ).toBeInTheDocument();

      // Trigger another timeout
      triggerTimeout();

      // Enter input again
      fireEvent.change(input, { target: { value: 'a' } });

      // Need to wait for the validation delay
      act(() => {
        vi.advanceTimersByTime(10);
      });

      // Need more time for score update
      act(() => {
        vi.advanceTimersByTime(90);
      });

      expect(
        screen.getByLabelText((_, el) => el?.getAttribute('aria-label')?.startsWith('Score is')),
      ).toBeInTheDocument();
    });
  });

  describe('Weight adjustment mechanics', () => {
    const testCharacters: PracticeCharacter[] = [
      { char: 'あ', validAnswers: ['a'], weight: 5 },
      { char: 'い', validAnswers: ['i'], weight: 3 },
    ];

    it('decreases weight for correct answers with lower bound', () => {
      const result = decreaseWeight(testCharacters, 'あ');
      expect(result.find((c) => c.char === 'あ')?.weight).toBe(4);
      expect(result.find((c) => c.char === 'い')?.weight).toBe(3);

      const minTest = decreaseWeight(
        [{ char: 'う', validAnswers: ['u'], weight: 1 }],
        'う',
      );
      expect(minTest[0].weight).toBe(1);
    });

    it('increases weight for incorrect answers', () => {
      const result = increaseWeight(testCharacters, 'い');
      expect(result.find((c) => c.char === 'い')?.weight).toBe(5);
      expect(result.find((c) => c.char === 'あ')?.weight).toBe(5);
    });
  });
});
