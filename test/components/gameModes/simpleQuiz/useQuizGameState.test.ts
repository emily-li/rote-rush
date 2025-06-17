import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuizGameState } from '../../../../src/components/gameModes/simpleQuiz/useQuizGameState';
import { expectGameState } from '../../../helpers';

// Mock the character loading module
vi.mock('../../../../src/lib/characterLoading', () => ({
  loadPracticeCharacters: vi.fn(() => [
    { char: 'あ', validAnswers: ['a'] },
    { char: 'か', validAnswers: ['ka'] },
    { char: 'さ', validAnswers: ['sa'] },
    { char: 'た', validAnswers: ['ta'] },
    { char: 'な', validAnswers: ['na'] },
  ]),
  getRandomCharacter: vi.fn(
    (chars) => chars[Math.floor(Math.random() * chars.length)],
  ),
}));

describe('useQuizGameState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useQuizGameState());

    expectGameState(result.current, { score: 0, combo: 0 });
  });

  it('should increment score and combo when incrementScore is called', () => {
    const { result } = renderHook(() => useQuizGameState());

    act(() => {
      result.current.actions.incrementScore();
    });

    expectGameState(result.current, { score: 1, combo: 1 });

    act(() => {
      result.current.actions.incrementScore();
    });

    expectGameState(result.current, { score: 2, combo: 2 });
  });

  it('should reset combo to zero', () => {
    const { result } = renderHook(() => useQuizGameState());

    // First increment combo
    act(() => {
      result.current.actions.incrementScore();
      result.current.actions.incrementScore();
    });

    expect(result.current.combo).toBe(2);

    // Reset combo
    act(() => {
      result.current.actions.resetCombo();
    });

    expect(result.current.combo).toBe(0);
    expect(result.current.score).toBe(2); // Score should remain unchanged
  });
  it('should get next character', () => {
    const { result } = renderHook(() => useQuizGameState());

    act(() => {
      result.current.actions.nextCharacter();
    });

    // Character should be defined (might be same due to random nature)
    expect(result.current.currentChar).toBeDefined();
    expect(result.current.currentChar.char).toBeDefined();
    expect(result.current.currentChar.validAnswers).toBeDefined();
  });

  it('should reset game state', () => {
    const { result } = renderHook(() => useQuizGameState());

    // Build up some state
    act(() => {
      result.current.actions.incrementScore();
      result.current.actions.incrementScore();
    });

    expect(result.current.score).toBe(2);
    expect(result.current.combo).toBe(2);

    // Reset game
    act(() => {
      result.current.actions.resetGame();
    });

    expect(result.current.score).toBe(0);
    expect(result.current.combo).toBe(0);
    expect(result.current.currentChar).toBeDefined();
  });

  it('should maintain character structure after operations', () => {
    const { result } = renderHook(() => useQuizGameState());

    // Perform various operations
    act(() => {
      result.current.actions.incrementScore();
      result.current.actions.nextCharacter();
      result.current.actions.resetCombo();
    });

    // Character should always have proper structure
    expect(result.current.currentChar).toHaveProperty('char');
    expect(result.current.currentChar).toHaveProperty('validAnswers');
    expect(typeof result.current.currentChar.char).toBe('string');
    expect(Array.isArray(result.current.currentChar.validAnswers)).toBe(true);
    expect(result.current.currentChar.validAnswers.length).toBeGreaterThan(0);
  });

  it('should handle multiple score increments', () => {
    const { result } = renderHook(() => useQuizGameState());

    // Increment score multiple times
    act(() => {
      for (let i = 0; i < 10; i++) {
        result.current.actions.incrementScore();
      }
    });

    expect(result.current.score).toBe(10);
    expect(result.current.combo).toBe(10);
  });

  it('should handle score increment after combo reset', () => {
    const { result } = renderHook(() => useQuizGameState());

    // Increment, reset combo, then increment again
    act(() => {
      result.current.actions.incrementScore();
      result.current.actions.resetCombo();
      result.current.actions.incrementScore();
    });

    expect(result.current.score).toBe(2);
    expect(result.current.combo).toBe(1); // Combo should restart from 1
  });

  it('should provide all required actions', () => {
    const { result } = renderHook(() => useQuizGameState());

    expect(result.current.actions).toHaveProperty('nextCharacter');
    expect(result.current.actions).toHaveProperty('incrementScore');
    expect(result.current.actions).toHaveProperty('resetCombo');
    expect(result.current.actions).toHaveProperty('resetGame');

    expect(typeof result.current.actions.nextCharacter).toBe('function');
    expect(typeof result.current.actions.incrementScore).toBe('function');
    expect(typeof result.current.actions.resetCombo).toBe('function');
    expect(typeof result.current.actions.resetGame).toBe('function');
  });
});
