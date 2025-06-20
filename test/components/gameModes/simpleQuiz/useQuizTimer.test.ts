import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useQuizTimer } from '../../../../src/components/gameModes/simpleQuiz/useQuizTimer';

describe('useQuizTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should initialize with default total time', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useQuizTimer({ onTimeout }));

    expect(result.current.totalTimeMs).toBe(5000);
    expect(result.current.timeLeftMs).toBe(5000);
  });

  it('should call onTimeout when timer expires', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useQuizTimer({ onTimeout }));

    // Advance time past the total time
    act(() => {
      vi.advanceTimersByTime(5500);
    });

    expect(result.current.timeLeftMs).toBe(0);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('should reset timer correctly', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useQuizTimer({ onTimeout }));

    // Let some time pass
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.timeLeftMs).toBeLessThan(5000);

    // Reset timer
    act(() => {
      result.current.actions.resetTimer();
    });

    expect(result.current.timeLeftMs).toBe(5000);
  });

  it('should countdown correctly', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useQuizTimer({ onTimeout }));

    expect(result.current.timeLeftMs).toBe(5000);

    // Advance time by 1000ms
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Should be approximately 4000ms left (accounting for 50ms intervals)
    expect(result.current.timeLeftMs).toBeLessThanOrEqual(4000);
    expect(result.current.timeLeftMs).toBeGreaterThan(3900);
  });
  it('should not call onTimeout multiple times', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() => useQuizTimer({ onTimeout }));

    // Advance time way past the total time
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.timeLeftMs).toBe(0);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });
});
