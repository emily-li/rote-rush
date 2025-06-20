import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimer } from '../../src/lib/useTimer';
import { expectTimerState } from '../helpers';

describe('useTimer hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with the provided total time', () => {
      const onTimeout = vi.fn();
      const { result } = renderHook(() =>
        useTimer({ totalTimeMs: 5000, onTimeout }),
      );

      expectTimerState(result.current, { timeLeft: 5000, total: 5000 });
      expect(onTimeout).not.toHaveBeenCalled();
    });

    it('should immediately trigger timeout when initialized with zero time', () => {
      const onTimeout = vi.fn();
      const { result } = renderHook(() =>
        useTimer({ totalTimeMs: 0, onTimeout }),
      );

      expectTimerState(result.current, { timeLeft: 0, total: 0 });
      expect(onTimeout).toHaveBeenCalledTimes(1);
    });
    
    it('should initialize with negative time as zero and trigger timeout', () => {
      const onTimeout = vi.fn();
      const { result } = renderHook(() =>
        useTimer({ totalTimeMs: -1000, onTimeout }),
      );

      expectTimerState(result.current, { timeLeft: 0, total: 0 });
      expect(onTimeout).toHaveBeenCalledTimes(1);
    });
  });

  describe('countdown behavior', () => {
    it('should countdown time at the correct rate', () => {
      const onTimeout = vi.fn();
      const { result } = renderHook(() =>
        useTimer({ totalTimeMs: 1000, onTimeout }),
      );

      expect(result.current.timeLeftMs).toBe(1000);

      // Advance by 200ms and check
      act(() => {
        vi.advanceTimersByTime(200);
      });
      expect(result.current.timeLeftMs).toBe(800);
      
      // Advance by another 300ms and check
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(result.current.timeLeftMs).toBe(500);
      
      expect(onTimeout).not.toHaveBeenCalled();
    });

    it('should call onTimeout when timer reaches zero and stop at zero', () => {
      const onTimeout = vi.fn();
      const { result } = renderHook(() =>
        useTimer({ totalTimeMs: 100, onTimeout }),
      );

      // Advance past the total time
      act(() => {
        vi.advanceTimersByTime(150);
      });

      expect(result.current.timeLeftMs).toBe(0);
      expect(onTimeout).toHaveBeenCalledTimes(1);
      
      // Ensure timer doesn't go below zero
      act(() => {
        vi.advanceTimersByTime(100);
      });
      
      expect(result.current.timeLeftMs).toBe(0);
      expect(onTimeout).toHaveBeenCalledTimes(1); // Still only called once
    });
  });

  describe('timer control functions', () => {
    it('should reset timer correctly to initial value', () => {
      const onTimeout = vi.fn();
      const { result } = renderHook(() =>
        useTimer({ totalTimeMs: 1000, onTimeout }),
      );

      // Advance halfway through
      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(result.current.timeLeftMs).toBe(500);

      // Reset timer
      act(() => {
        result.current.resetTimer();
      });
      expect(result.current.timeLeftMs).toBe(1000);
      expect(onTimeout).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
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
});
