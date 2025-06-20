import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuizFlowControl } from '../../../../src/components/gameModes/simpleQuiz/useQuizFlowControl';

describe('useQuizFlowControl', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should proceed to next question immediately', () => {
    const onNextQuestion = vi.fn();
    const onResetTimer = vi.fn();

    const { result } = renderHook(() =>
      useQuizFlowControl({ onNextQuestion, onResetTimer }),
    );

    act(() => {
      result.current.actions.proceedToNext();
    });

    expect(onNextQuestion).toHaveBeenCalledTimes(1);
    expect(onResetTimer).toHaveBeenCalledTimes(1);
  });

  it('should show incorrect feedback then proceed', () => {
    const onNextQuestion = vi.fn();
    const onResetTimer = vi.fn();

    const { result } = renderHook(() =>
      useQuizFlowControl({ onNextQuestion, onResetTimer }),
    );

    act(() => {
      result.current.actions.showIncorrectAndProceed();
    });

    // Should not proceed immediately
    expect(onNextQuestion).not.toHaveBeenCalled();

    // Should proceed after default delay
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(onNextQuestion).toHaveBeenCalledTimes(1);
    expect(onResetTimer).toHaveBeenCalledTimes(1);
  });

  it('should show timeout feedback then proceed', () => {
    const onNextQuestion = vi.fn();
    const onResetTimer = vi.fn();

    const { result } = renderHook(() =>
      useQuizFlowControl({ onNextQuestion, onResetTimer }),
    );

    act(() => {
      result.current.actions.showTimeoutAndProceed();
    });

    // Should not proceed immediately
    expect(onNextQuestion).not.toHaveBeenCalled();

    // Should proceed after default delay
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onNextQuestion).toHaveBeenCalledTimes(1);
    expect(onResetTimer).toHaveBeenCalledTimes(1);
  });
});
