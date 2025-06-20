import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuizInput } from '../../../../src/components/gameModes/simpleQuiz/useQuizInput';
import type { PracticeCharacter } from '../../../../src/lib/characterLoading';

describe('useQuizInput', () => {
  const mockCharacter: PracticeCharacter = {
    char: 'あ',
    validAnswers: ['a'],
  };

  const mockCharacterMultipleAnswers: PracticeCharacter = {
    char: 'し',
    validAnswers: ['shi', 'si'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty input', () => {
    const onCorrectAnswer = vi.fn();
    const onIncorrectAnswer = vi.fn();

    const { result } = renderHook(() =>
      useQuizInput({
        currentChar: mockCharacter,
        onCorrectAnswer,
        onIncorrectAnswer,
      }),
    );

    expect(result.current.userInput).toBe('');
    expect(result.current.isWrongAnswer).toBe(false);
  });
  it('should call onCorrectAnswer when complete correct input is entered', () => {
    const onCorrectAnswer = vi.fn();
    const onIncorrectAnswer = vi.fn();

    const { result } = renderHook(() =>
      useQuizInput({
        currentChar: mockCharacter,
        onCorrectAnswer,
        onIncorrectAnswer,
      }),
    );

    const mockEvent = {
      target: { value: 'a' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handlers.handleInputChange(mockEvent);
    });

    expect(onCorrectAnswer).toHaveBeenCalledTimes(1);
  });

  it('should call onIncorrectAnswer when invalid input is entered', () => {
    const onCorrectAnswer = vi.fn();
    const onIncorrectAnswer = vi.fn();

    const { result } = renderHook(() =>
      useQuizInput({
        currentChar: mockCharacter,
        onCorrectAnswer,
        onIncorrectAnswer,
      }),
    );

    const mockEvent = {
      target: { value: 'x' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handlers.handleInputChange(mockEvent);
    });

    expect(onIncorrectAnswer).toHaveBeenCalledTimes(1);
    expect(result.current.isWrongAnswer).toBe(true);
  });

  it('should allow valid partial input', () => {
    const onCorrectAnswer = vi.fn();
    const onIncorrectAnswer = vi.fn();

    const { result } = renderHook(() =>
      useQuizInput({
        currentChar: mockCharacterMultipleAnswers,
        onCorrectAnswer,
        onIncorrectAnswer,
      }),
    );

    // Enter partial input for 'shi'
    const mockEvent = {
      target: { value: 's' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handlers.handleInputChange(mockEvent);
    });

    expect(onIncorrectAnswer).not.toHaveBeenCalled();
    expect(result.current.userInput).toBe('s');
  });
});
