import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as inputValidation from '../../../../src/components/gameModes/simpleQuiz/inputValidation';
import { useQuizGame } from '../../../../src/components/gameModes/simpleQuiz/useQuizGame';
import * as characterLoading from '../../../../src/lib/characterLoading';
import * as useTimer from '../../../../src/lib/useTimer';
import {
  createInputChangeEvent,
  createKeyboardEvent,
  createMockInputValidation,
  createMockTimeoutManager,
  createMockTimer,
  expectGameState,
} from '../../../helpers';

// Mock dependencies
vi.mock('@/lib/characterLoading', () => ({
  loadPracticeCharacters: vi.fn(() => [
    { char: 'あ', validAnswers: ['a'] },
    { char: 'か', validAnswers: ['ka'] },
    { char: 'さ', validAnswers: ['sa'] },
  ]),
  getRandomCharacter: vi.fn(),
}));

vi.mock('@/lib/useTimer', () => ({
  useTimer: vi.fn(),
}));

vi.mock('@/components/gameModes/simpleQuiz/inputValidation', () => ({
  checkAnswerMatch: vi.fn(),
  checkValidStart: vi.fn(),
  normalizeInput: vi.fn(),
}));

const TEST_CHARACTERS = [
  { char: 'あ', validAnswers: ['a'] },
  { char: 'か', validAnswers: ['ka'] },
  { char: 'さ', validAnswers: ['sa'] },
];

describe('useQuizGame', () => {
  let mockTimeoutManager: ReturnType<typeof createMockTimeoutManager>;
  let mockTimer: ReturnType<typeof createMockTimer>;
  let mockInputValidation: ReturnType<typeof createMockInputValidation>;

  beforeEach(() => {
    vi.useFakeTimers();
    mockTimeoutManager = createMockTimeoutManager();
    mockTimer = createMockTimer();
    mockInputValidation = createMockInputValidation();

    vi.mocked(useTimer.useTimer).mockReturnValue(mockTimer);
    vi.mocked(characterLoading.getRandomCharacter).mockReturnValue(
      TEST_CHARACTERS[0],
    );
    vi.mocked(inputValidation.normalizeInput).mockImplementation(
      mockInputValidation.normalizeInput,
    );
    vi.mocked(inputValidation.checkAnswerMatch).mockReturnValue(false);
    vi.mocked(inputValidation.checkValidStart).mockReturnValue(true);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useQuizGame(mockTimeoutManager));

    expectGameState(result.current.gameState, {
      currentChar: TEST_CHARACTERS[0],
      userInput: '',
      score: 0,
      combo: 0,
    });
  });

  it('should handle user input correctly', () => {
    const { result } = renderHook(() => useQuizGame(mockTimeoutManager));

    act(() => {
      result.current.handlers.handleInputChange(createInputChangeEvent('a'));
    });

    expect(result.current.gameState.userInput).toBe('a');
  });

  it('should handle correct answer', () => {
    vi.mocked(inputValidation.checkAnswerMatch).mockReturnValue(true);
    const { result } = renderHook(() => useQuizGame(mockTimeoutManager));

    act(() => {
      result.current.handlers.handleInputChange(createInputChangeEvent('a'));
    });

    expect(result.current.gameState.score).toBe(1);
    expect(result.current.gameState.combo).toBe(1);
    expect(result.current.gameState.userInput).toBe('');
  });

  it('should handle incorrect answer', () => {
    vi.mocked(inputValidation.checkValidStart).mockReturnValue(false);
    const { result } = renderHook(() => useQuizGame(mockTimeoutManager));

    act(() => {
      result.current.handlers.handleInputChange(createInputChangeEvent('x'));
    });

    expect(result.current.gameState.combo).toBe(0);
  });

  it('should reset combo on timer timeout', () => {
    const { result } = renderHook(() => useQuizGame(mockTimeoutManager));

    // Get the timeout callback that was passed to useTimer
    const timerConfig = vi.mocked(useTimer.useTimer).mock.calls[0][0];

    // Trigger timer timeout
    act(() => {
      timerConfig.onTimeout();
    });

    expect(result.current.gameState.combo).toBe(0);
  });
});
