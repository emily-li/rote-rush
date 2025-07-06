import { useCallback, useEffect, useRef, useState } from 'react';
import { WEIGHT_CONFIG } from '@/config/weights';
import {
  getWeightedRandomCharacter,
  loadPracticeCharacters,
  saveCharacterWeights,
} from '@/lib/characterLoading';
import { recordCharacterAttempt } from '@/lib/characterStats';
import {
  adjustWeight,
  getComboMultiplier,
  resetForNextCharacter,
} from '@/lib/quizUtils';
import { useTimer } from '@/lib/useTimer';
import {
  checkAnswerMatch,
  checkValidStart,
  clamp,
  normalizeInput,
} from '@/lib/validation';
import type { PracticeCharacter, QuizModeState } from '@/types';

export type UseQuizGameParams = {
  timerConfig: typeof import('@/config/quiz').QUIZ_CONFIG;
  onCharacterComplete?: (characters: PracticeCharacter[]) => void;
  getNextCharacter?: () => PracticeCharacter | undefined;
};
const { WEIGHT_DECREASE, WEIGHT_INCREASE, MIN_WEIGHT } = WEIGHT_CONFIG;

/**
 * Core quiz game logic shared between different quiz mode components
 */
export const useQuizGame = ({
  timerConfig,
  onCharacterComplete,
  getNextCharacter,
}: UseQuizGameParams): QuizModeState => {
  const {
    DEFAULT_TIME_MS,
    MIN_TIME_MS,
    TIMER_STEP_MS,
    WRONG_ANSWER_DISPLAY_MS,
  } = timerConfig;

  // Character and game state
  const [characters, setCharacters] = useState<PracticeCharacter[]>(() =>
    loadPracticeCharacters(),
  );
  const [currentChar, setCurrentChar] = useState<PracticeCharacter>(() =>
    getWeightedRandomCharacter(loadPracticeCharacters()),
  );
  const [userInput, setUserInput] = useState('');

  // Score and progress state
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [comboMultiplier, setComboMultiplier] = useState<number>(1.0);
  const [isWrongAnswer, setIsWrongAnswer] = useState<boolean>(false);

  // Refs for cleanup and state tracking
  const nextCharTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    timeLeftMs,
    totalTimeMs,
    isPaused,
    resetTimer,
    pauseTimer,
    resumeTimer,
  } = useTimer({
    totalTimeMs: DEFAULT_TIME_MS,
    onTimeout: useCallback(() => {
      handleTimeout();
    }, []),
    autoStart: false, // Start paused, will be resumed by handleInputChange or nextCharacter
  });

  /**
   * Update timer on combo threshold - reduces time for next character when combo increases
   * @param newMultiplier - The new combo multiplier value
   */
  const updateTimerOnComboThreshold = useCallback(
    (newMultiplier: number): void => {
      if (newMultiplier > comboMultiplier) {
        const newTime = clamp(
          totalTimeMs - TIMER_STEP_MS,
          MIN_TIME_MS,
          DEFAULT_TIME_MS,
        );
        resetTimer(newTime);
      }
    },
    [
      comboMultiplier,
      totalTimeMs,
      MIN_TIME_MS,
      DEFAULT_TIME_MS,
      TIMER_STEP_MS,
      resetTimer,
    ],
  );

  /**
   * Cancel all pending timeouts to ensure clean state transitions.
   * Called before any major game state change (new character, timeout, etc.)
   * to prevent race conditions between different game mechanics.
   */
  const clearNextCharTimeout = useCallback(() => {
    if (nextCharTimeoutRef.current) {
      clearTimeout(nextCharTimeoutRef.current);
      nextCharTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    saveCharacterWeights(characters);
  }, [characters]);

  const nextCharacter = useCallback(
    (resetToDefault = false) => {
      clearNextCharTimeout();
      pauseTimer(); // Pause timer before getting next character

      const nextChar = getNextCharacter
        ? getNextCharacter()
        : getWeightedRandomCharacter(characters);
      if (nextChar) {
        setCurrentChar(nextChar);
      } else {
        // This case should ideally not be reached if characters are always available
        console.warn('No more characters available.');
        // Optionally, handle game completion here if needed
        return;
      }
      resetForNextCharacter(setUserInput, setIsWrongAnswer);

      if (resetToDefault) {
        resetTimer(DEFAULT_TIME_MS);
      } else {
        resetTimer(totalTimeMs);
      }
      resumeTimer(); // Resume timer after setting up next character

      // Call the onCharacterComplete callback if provided
      if (onCharacterComplete) {
        onCharacterComplete(characters);
      }
    },
    [
      characters,
      clearNextCharTimeout,
      DEFAULT_TIME_MS,
      onCharacterComplete,
      getNextCharacter,
      resetTimer,
      pauseTimer,
      resumeTimer,
      totalTimeMs,
    ],
  );

  const handleTimeout = useCallback(() => {
    recordCharacterAttempt(currentChar.char, false);

    clearNextCharTimeout();
    pauseTimer(); // Pause timer on timeout

    setStreak(0);
    setComboMultiplier(1.0);
    setIsWrongAnswer(true);

    nextCharTimeoutRef.current = setTimeout(() => {
      nextCharacter(true);
    }, WRONG_ANSWER_DISPLAY_MS);
  }, [
    currentChar.char,
    nextCharacter,
    clearNextCharTimeout,
    WRONG_ANSWER_DISPLAY_MS,
    pauseTimer,
  ]);

  const validateAndHandleInput = useCallback(
    (value: string) => {
      if (!value) return;
      if (checkAnswerMatch(value, currentChar.validAnswers)) {
        recordCharacterAttempt(currentChar.char, true);
        const newStreak = streak + 1;
        setStreak(newStreak);
        const newMultiplier = getComboMultiplier(newStreak);
        setComboMultiplier(newMultiplier);
        setScore((prev) => prev + Math.floor(10 * newMultiplier));
        updateTimerOnComboThreshold(newMultiplier);
        setCharacters((prevChars) =>
          adjustWeight(
            prevChars,
            currentChar.char,
            WEIGHT_DECREASE,
            MIN_WEIGHT,
          ),
        );
        nextCharacter(false);
      } else if (!checkValidStart(value, currentChar.validAnswers)) {
        recordCharacterAttempt(currentChar.char, false);
        setStreak(0);
        setComboMultiplier(1.0);
        setIsWrongAnswer(true);
        setCharacters((prevChars) =>
          adjustWeight(
            prevChars,
            currentChar.char,
            WEIGHT_INCREASE,
            MIN_WEIGHT,
          ),
        );
        setUserInput(value);
        pauseTimer(); // Pause timer on wrong answer
        nextCharTimeoutRef.current = setTimeout(
          () => nextCharacter(true),
          WRONG_ANSWER_DISPLAY_MS,
        );
      } else {
        // Allow partial valid inputs
        setUserInput(value);
      }
    },
    [
      currentChar,
      streak,
      nextCharacter,
      updateTimerOnComboThreshold,
      WRONG_ANSWER_DISPLAY_MS,
      pauseTimer,
    ],
  );

  /**
   * Handle user input changes with validation and game state management
   * @param e - Input change event
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      // Ignore input if wrong answer was already provided
      if (isWrongAnswer) return;

      const value = normalizeInput(e.target.value);

      // Handle input when game is paused (e.g., initial state or after timeout)
      if (isPaused) {
        resumeTimer(); // Resume timer on first input
        setUserInput(value);
        validateAndHandleInput(value);
        return;
      }

      // Normal input handling
      setUserInput(value);
      if (value) {
        validateAndHandleInput(value);
      }
    },
    [isWrongAnswer, isPaused, validateAndHandleInput, resumeTimer],
  );

  const timeRemainingPct = (timeLeftMs / totalTimeMs) * 100;

  return {
    characterState: {
      characters,
      currentChar,
      userInput,
      setUserInput,
    },
    scoreState: {
      score,
      streak,
      comboMultiplier,
      isWrongAnswer,
    },
    timerState: {
      timeLeft: timeLeftMs,
      currentTimeMs: totalTimeMs,
      isPaused,
      timeRemainingPct,
    },
    timerControl: {
      pauseTimer,
      resumeTimer,
    },
    actions: {
      handleInputChange,
      nextCharacter,
      validateAndHandleInput,
      handleTimeout,
    },
  };
};
