import { act, renderHook } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import { useQuizGame } from '@/hooks/useQuizGame';
import { QUIZ_CONFIG } from '@/config/quiz';
import { getWeightedRandomCharacter } from '@/lib/characterLoading';

// Mock the character loading utility
vi.mock('@/lib/characterLoading', () => ({
  loadPracticeCharacters: vi.fn(() => [{ char: 'あ', validAnswers: ['a'] }]) as Mock,
  getWeightedRandomCharacter: vi.fn(() => ({ char: 'あ', validAnswers: ['a'] })) as Mock,
  saveCharacterWeights: vi.fn() as Mock,
}));

// Mock the character stats utility
vi.mock('@/lib/characterStats', () => ({
  recordCharacterAttempt: vi.fn() as Mock,
}));

describe('useQuizGame', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should use getNextCharacter when provided for next character', () => {
    const mockCharacters = [
      { char: 'あ', validAnswers: ['a'] },
      { char: 'い', validAnswers: ['i'] },
      { char: 'う', validAnswers: ['u'] },
    ];

    // Mock getWeightedRandomCharacter to return the first character initially
    getWeightedRandomCharacter.mockReturnValue(mockCharacters[0]);

    const mockGetNextCharacter = vi.fn() as Mock;
    mockGetNextCharacter
      .mockReturnValueOnce(mockCharacters[1]) // Next char after 'あ'
      .mockReturnValueOnce(mockCharacters[2]) // Next char after 'い'
      .mockReturnValue(undefined); // No more characters

    const { result } = renderHook(() =>
      useQuizGame({
        timerConfig: QUIZ_CONFIG,
        getNextCharacter: mockGetNextCharacter,
      }),
    );

    // Initial character should be 'あ'
    expect(result.current.characterState.currentChar).toEqual(mockCharacters[0]);

    // Simulate correct answer for 'あ'
    act(() => {
      result.current.actions.handleInputChange({ target: { value: 'a' } });
    });

    // Should call getNextCharacter to get the next character
    expect(mockGetNextCharacter).toHaveBeenCalledTimes(1);
    // Current character should now be 'い'
    expect(result.current.characterState.currentChar).toEqual(mockCharacters[1]);

    // Simulate correct answer for 'い'
    act(() => {
      result.current.actions.handleInputChange({ target: { value: 'i' } });
    });

    // Should call getNextCharacter again
    expect(mockGetNextCharacter).toHaveBeenCalledTimes(2);
    // Current character should now be 'う'
    expect(result.current.characterState.currentChar).toEqual(mockCharacters[2]);

    // Simulate correct answer for 'u'
    act(() => {
      result.current.actions.handleInputChange({ target: { value: 'u' } });
    });

    // Should call getNextCharacter again, which returns undefined
    expect(mockGetNextCharacter).toHaveBeenCalledTimes(3);
    // Game should be paused as no more characters are available
    expect(result.current.timerState.isPaused).toBe(true);
  });

  it('should use getNextCharacter when provided after a timeout', () => {
    const mockCharacters = [
      { char: 'あ', validAnswers: ['a'] },
      { char: 'い', validAnswers: ['i'] },
    ];

    getWeightedRandomCharacter.mockReturnValue(mockCharacters[0]);

    const mockGetNextCharacter = vi.fn() as Mock;
    mockGetNextCharacter.mockReturnValueOnce(mockCharacters[1]);

    const { result } = renderHook(() =>
      useQuizGame({
        timerConfig: QUIZ_CONFIG,
        getNextCharacter: mockGetNextCharacter,
      }),
    );

    expect(result.current.characterState.currentChar).toEqual(mockCharacters[0]);

    // Directly call handleTimeout
    act(() => {
      result.current.actions.handleTimeout();
    });

    // Advance timers past the wrong answer display time to trigger nextCharacter
    act(() => {
      vi.advanceTimersByTime(QUIZ_CONFIG.WRONG_ANSWER_DISPLAY_MS);
    });

    // Now, nextCharacter should have been called
    expect(mockGetNextCharacter).toHaveBeenCalledTimes(1);
    expect(result.current.characterState.currentChar).toEqual(mockCharacters[1]);
  });
});
