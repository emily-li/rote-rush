import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimpleQuizMode from '../../src/components/SimpleQuizMode';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import type { PracticeCharacter } from '../../src/types';

const WEIGHT_DECREASE = 1;
const WEIGHT_INCREASE = 2;
const MIN_WEIGHT = 1;

function decreaseWeight(characters: PracticeCharacter[], char: string) {
  return characters.map(c =>
    c.char === char ? { ...c, weight: Math.max(MIN_WEIGHT, (c.weight || 1) - WEIGHT_DECREASE) } : c
  );
}

function increaseWeight(characters: PracticeCharacter[], char: string) {
  return characters.map(c =>
    c.char === char ? { ...c, weight: (c.weight || 1) + WEIGHT_INCREASE } : c
  );
}

vi.mock('../../src/lib/characterLoading', () => {
  return {
    loadPracticeCharacters: () => [
      { char: 'あ', validAnswers: ['a'], weight: 5 },
      { char: 'い', validAnswers: ['i'], weight: 3 },
    ],
    getWeightedRandomCharacter: (chars: any[]) => chars[0],
    saveCharacterWeights: vi.fn(),
  };
});

describe('SimpleQuizMode bug regression', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it('does not immediately skip to the next character after answering or skipping', () => {
    render(<SimpleQuizMode />);
    const input = screen.getByPlaceholderText(/romanized/i);
    // Correct answer
    fireEvent.change(input, { target: { value: 'a' } });
    act(() => {
      vi.advanceTimersByTime(10);
    });
    // Should still be on the next character, not immediately skipped
    expect(screen.getByText('あ')).toBeInTheDocument();
    // Wait less than the timeout
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    // Should still be on the same character
    expect(screen.getByText('あ')).toBeInTheDocument();
  });
});

describe('weight adjustment helpers (from SimpleQuizMode)', () => {
  const base: PracticeCharacter[] = [
    { char: 'あ', validAnswers: ['a'], weight: 5 },
    { char: 'い', validAnswers: ['i'], weight: 3 },
  ];

  it('decreases weight for correct answer, but not below MIN_WEIGHT', () => {
    const result = decreaseWeight(base, 'あ');
    expect(result.find(c => c.char === 'あ')?.weight).toBe(4);
    expect(result.find(c => c.char === 'い')?.weight).toBe(3);
    // Should not go below MIN_WEIGHT
    const minTest = decreaseWeight([{ char: 'う', validAnswers: ['u'], weight: 1 }], 'う');
    expect(minTest[0].weight).toBe(1);
  });

  it('increases weight for incorrect answer', () => {
    const result = increaseWeight(base, 'い');
    expect(result.find(c => c.char === 'い')?.weight).toBe(5);
    expect(result.find(c => c.char === 'あ')?.weight).toBe(5);
  });
});
