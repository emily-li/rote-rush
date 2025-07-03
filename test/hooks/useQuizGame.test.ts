import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useQuizGame } from '@/hooks/useQuizGame';
import { QUIZ_CONFIG } from '@/config/quiz';
import { getWeightedRandomCharacter } from '@/lib/characterLoading';

// Mock the character loading utility
vi.mock('@/lib/characterLoading', () => ({
  loadPracticeCharacters: vi.fn(() => [{ char: 'あ', validAnswers: ['a'] }]),
  getWeightedRandomCharacter: vi.fn(() => ({ char: 'あ', validAnswers: ['a'] })),
  saveCharacterWeights: vi.fn(),
}));

// Mock the character stats utility
vi.mock('@/lib/characterStats', () => ({
  recordCharacterAttempt: vi.fn(),
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

  it('should use getNextCharacter when provided for next character', async () => {
    const mockCharacters = [
      { char: 'あ', validAnswers: ['a'] },
      { char: 'い', validAnswers: ['i'] },
      { char: 'う', validAnswers: ['u'] },
    ];

    // Mock getWeightedRandomCharacter to return the first character initially
    (getWeightedRandomCharacter as vi.Mock).mockReturnValue(mockCharacters[0]);

    const mockGetNextCharacter = vi.fn();
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
    await act(async () => {
      result.current.actions.handleInputChange({ target: { value: 'a' } } as React.ChangeEvent<HTMLInputElement>);
    });

    // Should call getNextCharacter to get the next character
    expect(mockGetNextCharacter).toHaveBeenCalledTimes(1);
    // Current character should now be 'い'
    expect(result.current.characterState.currentChar).toEqual(mockCharacters[1]);

    // Simulate correct answer for 'い'
    await act(async () => {
      result.current.actions.handleInputChange({ target: { value: 'i' } } as React.ChangeEvent<HTMLInputElement>);
    });

    // Should call getNextCharacter again
    expect(mockGetNextCharacter).toHaveBeenCalledTimes(2);
    // Current character should now be 'う'
    expect(result.current.characterState.currentChar).toEqual(mockCharacters[2]);

    // Simulate correct answer for 'u'
    await act(async () => {
      result.current.actions.handleInputChange({ target: { value: 'u' } } as React.ChangeEvent<HTMLInputElement>);
    });

    // Should call getNextCharacter again, which returns undefined
    expect(mockGetNextCharacter).toHaveBeenCalledTimes(3);
    // Game should be paused as no more characters are available
    expect(result.current.timerState.isPaused).toBe(true);
  });

  it('should use getNextCharacter when provided after a timeout', async () => {
    const mockCharacters = [
      { char: 'あ', validAnswers: ['a'] },
      { char: 'い', validAnswers: ['i'] },
    ];

    (getWeightedRandomCharacter as vi.Mock).mockReturnValue(mockCharacters[0]);

    const mockGetNextCharacter = vi.fn();
    mockGetNextCharacter.mockReturnValueOnce(mockCharacters[1]);

    const { result } = renderHook(() =>
      useQuizGame({
        timerConfig: QUIZ_CONFIG,
        getNextCharacter: mockGetNextCharacter,
      }),
    );

    expect(result.current.characterState.currentChar).toEqual(mockCharacters[0]);

    // Directly call handleTimeout
    await act(async () => {
      result.current.actions.handleTimeout();
    });

    // Advance timers past the wrong answer display time to trigger nextCharacter
    await act(async () => {
      vi.advanceTimersByTime(QUIZ_CONFIG.WRONG_ANSWER_DISPLAY_MS);
    });

    // Now, nextCharacter should have been called
    expect(mockGetNextCharacter).toHaveBeenCalledTimes(1);
    expect(result.current.characterState.currentChar).toEqual(mockCharacters[1]);
  });
});
