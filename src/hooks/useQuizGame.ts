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
import {
  checkAnswerMatch,
  checkValidStart,
  clamp,
  normalizeInput,
} from '@/lib/validation';
import type { PracticeCharacter, QuizModeState } from '@/types';

export type UseQuizGameParams = {
  timerConfig: typeof import('@/config/quiz').QUIZ_CONFIG;
  onCharacterComplete?: () => void;
};
const { WEIGHT_DECREASE, WEIGHT_INCREASE, MIN_WEIGHT } = WEIGHT_CONFIG;

/**
 * Core quiz game logic shared between different quiz mode components
 */
export const useQuizGame = ({
  timerConfig,
  onCharacterComplete,
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

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_TIME_MS);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(DEFAULT_TIME_MS);
  const [nextTimeMs, setNextTimeMs] = useState<number>(DEFAULT_TIME_MS);
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const pauseTimer = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Refs for cleanup and state tracking
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nextCharTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Update timer on combo threshold - reduces time for next character when combo increases
   * @param newMultiplier - The new combo multiplier value
   */
  const updateTimerOnComboThreshold = useCallback(
    (newMultiplier: number): void => {
      if (newMultiplier > comboMultiplier) {
        setNextTimeMs(
          clamp(currentTimeMs - TIMER_STEP_MS, MIN_TIME_MS, DEFAULT_TIME_MS),
        );
      }
    },
    [
      comboMultiplier,
      currentTimeMs,
      MIN_TIME_MS,
      DEFAULT_TIME_MS,
      TIMER_STEP_MS,
    ],
  );

  /**
   * Cancel all pending timeouts to ensure clean state transitions.
   * Called before any major game state change (new character, timeout, etc.)
   * to prevent race conditions between different game mechanics.
   */
  const clearAllTimeouts = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (nextCharTimeoutRef.current) {
      clearTimeout(nextCharTimeoutRef.current);
      nextCharTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    saveCharacterWeights(characters);
  }, [characters]);

  const nextCharacter = useCallback(
    (resetToDefault = false, resetTimeout = true) => {
      clearAllTimeouts();

      // Only reset timeout count when explicitly requested
      if (resetTimeout) {
        // timeoutCountRef.current = 0; // Removed logic
      }

      setIsPaused(false);
      setCurrentChar(getWeightedRandomCharacter(characters));
      resetForNextCharacter(setUserInput, setIsWrongAnswer);

      if (resetToDefault) {
        setCurrentTimeMs(DEFAULT_TIME_MS);
        setTimeLeft(DEFAULT_TIME_MS);
        setNextTimeMs(DEFAULT_TIME_MS);
      } else {
        setCurrentTimeMs(nextTimeMs);
        setTimeLeft(nextTimeMs > 0 ? nextTimeMs : DEFAULT_TIME_MS);
      }

      // Call the onCharacterComplete callback if provided
      if (onCharacterComplete) {
        onCharacterComplete();
      }
    },
    [
      characters,
      nextTimeMs,
      clearAllTimeouts,
      DEFAULT_TIME_MS,
      onCharacterComplete,
    ],
  );

  const handleTimeout = useCallback(() => {
    recordCharacterAttempt(currentChar.char, false);

    clearAllTimeouts();

    setStreak(0);
    setComboMultiplier(1.0);
    setIsWrongAnswer(true);
    // Remove timeoutCountRef logic and pause logic
    nextCharTimeoutRef.current = setTimeout(() => {
      nextCharacter(true, false);
    }, WRONG_ANSWER_DISPLAY_MS);
  }, [currentChar.char, nextCharacter, clearAllTimeouts]);

  const updateTimeLeft = useCallback(() => {
    setTimeLeft((prev) => Math.max(0, prev - 50));
  }, []);

  const validateAndHandleInput = useCallback(
    (value: string) => {
      if (!value) return;
      if (checkAnswerMatch(value, currentChar.validAnswers)) {
        recordCharacterAttempt(currentChar.char, true);
        // timeoutCountRef.current = 0; // Removed logic
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
        // timeoutCountRef.current = 0; // Removed logic
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
        nextCharTimeoutRef.current = setTimeout(
          () => nextCharacter(true),
          WRONG_ANSWER_DISPLAY_MS,
        );
      } else {
        // Allow partial valid inputs
        setUserInput(value);
      }
    },
    [currentChar, streak, nextCharacter, updateTimerOnComboThreshold],
  );

  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      if (timeLeft <= 0) {
        handleTimeout();
      }
      return;
    }

    const timerId = setInterval(updateTimeLeft, 50);
    timerRef.current = timerId;

    return () => {
      clearInterval(timerId);
      timerRef.current = null;
    };
  }, [timeLeft, isPaused, handleTimeout, updateTimeLeft]);

  /**
   * Handle user input changes with validation and game state management
   * @param e - Input change event
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      // Ignore input if wrong answer was already provided
      if (isWrongAnswer) return;

      const value = normalizeInput(e.target.value);

      // Handle input when game is paused after timeout
      if (isPaused) {
        setIsPaused(false);
        // Removed logic related to timeoutCountRef and setting timeLeft
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
    [isWrongAnswer, isPaused, validateAndHandleInput],
  );

  const timeRemainingPct = (timeLeft / currentTimeMs) * 100;

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
      timeLeft,
      currentTimeMs,
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
