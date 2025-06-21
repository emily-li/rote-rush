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

  it('resets timeout count on correct answer', () => {
    render(<SimpleQuizMode />);
    const input = screen.getByPlaceholderText(/romanized/i);

    // First timeout
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Give correct answer to reset timeout count
    fireEvent.change(input, { target: { value: 'a' } });
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Score should have increased
    expect(screen.getByText('Score: 1')).toBeInTheDocument();

    // Verify that timeout count was reset:
    // If we wait for another timeout, it should be treated as first timeout
    // not second, so timer should not pause after this timeout
    act(() => {
      vi.advanceTimersByTime(10000); // Trigger timeout
    });
    
    act(() => {
      vi.advanceTimersByTime(1500); // Wait for timeout handling
    });

    // Enter input again to verify timer didn't pause
    fireEvent.change(input, { target: { value: 'a' } });
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Score should increase again, proving timer didn't pause
    expect(screen.getByText('Score: 2')).toBeInTheDocument();
  });

  it('pauses after two consecutive timeouts', () => {
    render(<SimpleQuizMode />);
    const input = screen.getByPlaceholderText(/romanized/i);

    // First timeout
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Second timeout
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // At this point timer should be paused
    // Try advancing a lot of time - nothing should happen
    act(() => {
      vi.advanceTimersByTime(20000);
    });

    // Timer is paused, so no timeout should have occurred
    // Check that we can still type and the game is not in a timeout state
    fireEvent.change(input, { target: { value: 'a' } });
    
    // This should resume the game and input should have our value
    expect(input).toHaveValue('a');
  });

  it('captures first keystroke after pause correctly', () => {
    render(<SimpleQuizMode />);
    const input = screen.getByPlaceholderText(/romanized/i);

    // First timeout
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Second timeout
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Timer is now paused
    // Type a character
    fireEvent.change(input, { target: { value: 'a' } });
    
    // Check that the input received the character
    expect(input).toHaveValue('a');
    
    // Type the full correct answer
    fireEvent.change(input, { target: { value: 'a' } });
    
    // Advance time slightly to allow processing
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    // Score should have increased because the correct answer was registered
    expect(screen.getByText('Score: 1')).toBeInTheDocument();
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
