import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import SimpleQuizMode from '../../src/components/SimpleQuizMode';
import { vi, beforeEach, afterEach, describe, it, expect } from 'vitest';
import type { PracticeCharacter } from '../../src/types';

// Constants for testing
const WEIGHT_DECREASE = 1;
const WEIGHT_INCREASE = 2;
const MIN_WEIGHT = 1;
const DEFAULT_TIMEOUT = 10000;
const WRONG_ANSWER_DISPLAY_TIME = 1500;

// Helper functions
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

// Mock the character loading functions
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

describe('SimpleQuizMode functionality', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
  });

  it('maintains character display after answering or skipping', () => {
    render(<SimpleQuizMode />);
    const input = screen.getByPlaceholderText(/romanized/i);
    
    // Enter correct answer
    fireEvent.change(input, { target: { value: 'a' } });
    
    act(() => {
      vi.advanceTimersByTime(10);
    });
    
    expect(screen.getByText('あ')).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(screen.getByText('あ')).toBeInTheDocument();
  });

  it('resets timeout count on correct answer', () => {
    render(<SimpleQuizMode />);
    const input = screen.getByPlaceholderText(/romanized/i);

    // First timeout
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });
    
    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });

    // Give correct answer to reset timeout count
    fireEvent.change(input, { target: { value: 'a' } });
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(screen.getByText('Score: 1')).toBeInTheDocument();

    // Trigger another timeout
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });
    
    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });

    // Enter input again
    fireEvent.change(input, { target: { value: 'a' } });
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(screen.getByText('Score: 2')).toBeInTheDocument();
  });

  it('pauses after two consecutive timeouts', () => {
    render(<SimpleQuizMode />);
    const input = screen.getByPlaceholderText(/romanized/i);

    // Trigger first timeout
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });
    
    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });

    // Trigger second timeout
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });
    
    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });

    // Advance time while paused
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT * 2);
    });

    // Test input after pause
    fireEvent.change(input, { target: { value: 'a' } });
    
    expect(input).toHaveValue('a');
  });

  it('captures first keystroke after pause correctly', () => {
    render(<SimpleQuizMode />);
    const input = screen.getByPlaceholderText(/romanized/i);

    // Trigger two timeouts to pause the game
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });
    
    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });

    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });
    
    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });

    // Type after pause
    fireEvent.change(input, { target: { value: 'a' } });
    
    expect(input).toHaveValue('a');
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(screen.getByText('Score: 1')).toBeInTheDocument();
  });
  
  it('validates first character after pause for correct answers', () => {
    render(<SimpleQuizMode />);
    const input = screen.getByPlaceholderText(/romanized/i);

    // Trigger two timeouts to pause the game
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });
    
    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });

    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });
    
    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });

    // Enter correct answer as first keystroke after pause
    fireEvent.change(input, { target: { value: 'a' } });
    
    // Without waiting for any user action, score should increase immediately
    expect(screen.getByText('Score: 1')).toBeInTheDocument();
    
    // Need to wait for the nextCharacter setTimeout to run
    act(() => {
      vi.advanceTimersByTime(10);
    });
    
    // Input should be cleared for the next character
    expect(input).toHaveValue('');
  });
  
  it('validates first character after pause for incorrect answers', () => {
    render(<SimpleQuizMode />);
    const input = screen.getByPlaceholderText(/romanized/i);

    // Trigger two timeouts to pause the game
    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });
    
    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });

    act(() => {
      vi.advanceTimersByTime(DEFAULT_TIMEOUT);
    });
    
    act(() => {
      vi.advanceTimersByTime(WRONG_ANSWER_DISPLAY_TIME);
    });

    // Enter incorrect answer as first keystroke after pause
    fireEvent.change(input, { target: { value: 'z' } });
    
    // Should show error state immediately
    expect(input).toHaveClass('border-fuchsia-800');
    
    // Score should remain at 0
    expect(screen.getByText('Score: 0')).toBeInTheDocument();
  });
});

describe('Weight adjustment mechanics', () => {
  const testCharacters: PracticeCharacter[] = [
    { char: 'あ', validAnswers: ['a'], weight: 5 },
    { char: 'い', validAnswers: ['i'], weight: 3 },
  ];

  it('decreases weight for correct answers with lower bound', () => {
    const result = decreaseWeight(testCharacters, 'あ');
    expect(result.find(c => c.char === 'あ')?.weight).toBe(4);
    expect(result.find(c => c.char === 'い')?.weight).toBe(3);
    
    const minTest = decreaseWeight([{ char: 'う', validAnswers: ['u'], weight: 1 }], 'う');
    expect(minTest[0].weight).toBe(1);
  });

  it('increases weight for incorrect answers', () => {
    const result = increaseWeight(testCharacters, 'い');
    expect(result.find(c => c.char === 'い')?.weight).toBe(5);
    expect(result.find(c => c.char === 'あ')?.weight).toBe(5);
  });
});
