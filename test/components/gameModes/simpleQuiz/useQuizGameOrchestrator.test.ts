import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuizGameOrchestrator } from '../../../../src/components/gameModes/simpleQuiz/useQuizGameOrchestrator';

// Mock the character loading module
vi.mock('../../../../src/lib/characterLoading', () => ({
  loadPracticeCharacters: vi.fn(() => [
    { char: 'あ', validAnswers: ['a'] },
    { char: 'か', validAnswers: ['ka'] },
    { char: 'さ', validAnswers: ['sa'] },
  ]),
  getRandomCharacter: vi.fn((chars) => chars[0]), // Always return first character for predictability
}));

describe('useQuizGameOrchestrator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useQuizGameOrchestrator());

    expect(result.current.gameState.currentChar.char).toBe('あ');
    expect(result.current.gameState.userInput).toBe('');
    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.combo).toBe(0);
    expect(result.current.input.isWrongAnswer).toBe(false);
    expect(result.current.timer.timeLeftMs).toBe(5000);
  });

  it('should handle correct answer correctly', () => {
    const { result } = renderHook(() => useQuizGameOrchestrator());

    const mockEvent = {
      target: { value: 'a' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handlers.handleInputChange(mockEvent);
    });

    expect(result.current.gameState.score).toBe(1);
    expect(result.current.gameState.combo).toBe(1);
    expect(result.current.gameState.userInput).toBe('');
    expect(result.current.timer.timeLeftMs).toBe(5000); // Timer reset
  });

  it('should handle incorrect answer correctly', () => {
    const { result } = renderHook(() => useQuizGameOrchestrator());

    const mockEvent = {
      target: { value: 'x' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handlers.handleInputChange(mockEvent);
    });

    expect(result.current.gameState.score).toBe(0);
    expect(result.current.gameState.combo).toBe(0);
    expect(result.current.input.isWrongAnswer).toBe(true);

    // Should proceed after delay
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.gameState.userInput).toBe('');
    expect(result.current.input.isWrongAnswer).toBe(false);
  });

  it('should handle timer timeout correctly', () => {
    const { result } = renderHook(() => useQuizGameOrchestrator());

    act(() => {
      vi.advanceTimersByTime(5500);
    });

    expect(result.current.gameState.combo).toBe(0);

    // Should proceed after timeout delay
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(result.current.timer.timeLeftMs).toBe(5000);
  });
});
