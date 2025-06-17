import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimer } from '../../src/lib/useTimer';
import { expectTimerState } from '../helpers';

describe('useTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('should initialize with total time', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useTimer({ totalTimeMs: 5000, onTimeout }),
    );

    expectTimerState(result.current, { timeLeft: 5000, total: 5000 });
  });

  it('should countdown over time', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useTimer({ totalTimeMs: 1000, onTimeout }),
    );

    expect(result.current.timeLeftMs).toBe(1000);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.timeLeftMs).toBe(800);
  });

  it('should call onTimeout when timer reaches zero', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useTimer({ totalTimeMs: 100, onTimeout }),
    );

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.timeLeftMs).toBe(0);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('should reset timer correctly', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useTimer({ totalTimeMs: 1000, onTimeout }),
    );

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.timeLeftMs).toBe(500);

    act(() => {
      result.current.resetTimer();
    });
    expect(result.current.timeLeftMs).toBe(1000);
  });

  it('should handle setTimeLeftMs', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useTimer({ totalTimeMs: 1000, onTimeout }),
    );

    act(() => {
      result.current.setTimeLeftMs(500);
    });

    expect(result.current.timeLeftMs).toBe(500);
  });

  it('should trigger timeout when setTimeLeftMs is set to 0', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useTimer({ totalTimeMs: 1000, onTimeout }),
    );

    act(() => {
      result.current.setTimeLeftMs(0);
    });

    expect(result.current.timeLeftMs).toBe(0);
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('should handle initialization with zero time', () => {
    const onTimeout = vi.fn();
    const { result } = renderHook(() =>
      useTimer({ totalTimeMs: 0, onTimeout }),
    );

    expectTimerState(result.current, { timeLeft: 0, total: 0 });
    expect(onTimeout).toHaveBeenCalledTimes(1);
  });

  it('should clean up intervals on unmount', () => {
    const onTimeout = vi.fn();
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');
    const { unmount } = renderHook(() =>
      useTimer({ totalTimeMs: 1000, onTimeout }),
    );

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
