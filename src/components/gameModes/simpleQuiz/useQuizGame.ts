import { useCallback, useEffect, useRef, useState } from 'react';
import { useTimer } from '@/lib/useTimer';
import {
  checkAnswerMatch,
  checkValidStart,
  normalizeInput,
} from './inputValidation';
import type { QuizGameInterface } from './types';
import { useQuizGameState } from './useQuizGameState';

const TOTAL_TIME_MS = 5000;

export function useQuizGame(): QuizGameInterface {
  const {
    currentChar,
    score,
    combo,
    actions: gameStateActions,
  } = useQuizGameState();

  const [userInput, setUserInput] = useState('');
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);

  const timeoutRef = useRef<number | null>(null);
  const resetTimerRef = useRef<() => void>(() => {});

  const cancelPendingTransition = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const clearInput = useCallback(() => {
    setUserInput('');
    setIsWrongAnswer(false);
  }, []);

  const proceedToNext = useCallback(() => {
    cancelPendingTransition();
    gameStateActions.nextCharacter();
    clearInput();
    resetTimerRef.current();
  }, [cancelPendingTransition, gameStateActions, clearInput]);

  const proceedWithDelay = useCallback(
    (delay: number) => {
      cancelPendingTransition();
      timeoutRef.current = window.setTimeout(proceedToNext, delay);
    },
    [cancelPendingTransition, proceedToNext],
  );

  const handleCorrectAnswer = useCallback(() => {
    gameStateActions.incrementScore();
    proceedToNext();
  }, [gameStateActions, proceedToNext]);

  const handleIncorrectAnswer = useCallback(() => {
    gameStateActions.resetCombo();
    setIsWrongAnswer(true);
    proceedWithDelay(1000);
  }, [gameStateActions, proceedWithDelay]);

  const handleSubmit = useCallback(
    (input: string) => {
      const isCorrect = checkAnswerMatch(input, currentChar.validAnswers);
      if (isCorrect) {
        handleCorrectAnswer();
      } else {
        handleIncorrectAnswer();
      }
    },
    [currentChar.validAnswers, handleCorrectAnswer, handleIncorrectAnswer],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isWrongAnswer) return;

      const value = e.target.value;
      setUserInput(value);

      const currentInput = normalizeInput(value);

      if (currentInput.length === 0) {
        return;
      }

      if (checkAnswerMatch(currentInput, currentChar.validAnswers)) {
        handleSubmit(value);
        return;
      }

      if (!checkValidStart(currentInput, currentChar.validAnswers)) {
        handleSubmit(value); // This will trigger incorrect flow
      }
    },
    [isWrongAnswer, currentChar.validAnswers, handleSubmit],
  );

  const handleTimeout = useCallback(() => {
    gameStateActions.resetCombo();
    setIsWrongAnswer(true);
    proceedWithDelay(1500);
  }, [gameStateActions, proceedWithDelay]);

  const {
    timeLeftMs,
    resetTimer,
    totalTimeMs: timerTotalTimeMs,
  } = useTimer({
    totalTimeMs: TOTAL_TIME_MS,
    onTimeout: handleTimeout,
  });

  useEffect(() => {
    resetTimerRef.current = resetTimer;
  }, [resetTimer]);

  return {
    gameState: {
      currentChar,
      userInput,
      score,
      combo,
    },
    input: {
      isWrongAnswer: isWrongAnswer,
    },
    timer: {
      totalTimeMs: timerTotalTimeMs,
      timeLeftMs,
    },
    handlers: {
      handleSubmit,
      handleInputChange,
    },
  };
}
