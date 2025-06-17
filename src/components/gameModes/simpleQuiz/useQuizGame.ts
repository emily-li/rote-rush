import { useCallback, useRef, useState } from 'react';
import {
  getRandomCharacter,
  loadPracticeCharacters,
  type PracticeCharacter,
} from '@/lib/characterLoading';
import { useTimer } from '@/lib/useTimer';
import {
  checkAnswerMatch,
  checkValidStart,
  normalizeInput,
} from './inputValidation';
import type { QuizGameInterface } from './types';

export type {
  QuizGameState,
  QuizInputState,
  QuizTimerState,
  QuizGameHandlers,
  QuizGameInterface,
} from './types';

const practiceCharacters = loadPracticeCharacters();
const totalTimeMs = 5000;

export function useQuizGame(): QuizGameInterface {
  const [currentChar, setCurrentChar] = useState<PracticeCharacter>(
    practiceCharacters[0],
  );
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const getRandomChar = useCallback(() => {
    return getRandomCharacter(practiceCharacters);
  }, []);

  const resetQuizState = useCallback(() => {
    setCurrentChar(getRandomChar());
    setUserInput('');
    setIsInputDisabled(false);
  }, [getRandomChar]);

  // Flow control state
  const timeoutRef = useRef<number | null>(null);

  const clearPendingTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // Timer setup
  const handleTimeout = useCallback(() => {
    setCombo(0);
    setIsInputDisabled(true);
    // Show timeout and proceed after delay
    clearPendingTimeout();
    timeoutRef.current = window.setTimeout(() => {
      resetQuizState();
      resetTimer();
    }, 1500);
  }, [clearPendingTimeout, resetQuizState]);

  const {
    timeLeftMs,
    resetTimer,
    totalTimeMs: timerTotalTimeMs,
  } = useTimer({
    totalTimeMs: totalTimeMs,
    onTimeout: handleTimeout,
  });

  // Flow control functions
  const proceedToNext = useCallback(() => {
    clearPendingTimeout();
    resetQuizState();
    resetTimer();
  }, [clearPendingTimeout, resetQuizState, resetTimer]);

  const showIncorrectAndProceed = useCallback(() => {
    clearPendingTimeout();
    timeoutRef.current = window.setTimeout(() => {
      resetQuizState();
      resetTimer();
    }, 1000);
  }, [clearPendingTimeout, resetQuizState, resetTimer]);

  const handleSubmit = useCallback(
    (input: string) => {
      const isCorrect = checkAnswerMatch(input, currentChar.validAnswers);

      if (isCorrect) {
        setScore((prev) => prev + 1);
        setCombo((prev) => prev + 1);
        proceedToNext();
      } else {
        setCombo(0);
        setIsInputDisabled(true);
        showIncorrectAndProceed();
      }
    },
    [currentChar, proceedToNext, showIncorrectAndProceed],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isInputDisabled) return;

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

      if (checkValidStart(currentInput, currentChar.validAnswers)) {
        // Valid input - continue typing
      } else {
        setIsInputDisabled(true);
        setCombo(0);
        showIncorrectAndProceed();
      }
    },
    [isInputDisabled, currentChar, showIncorrectAndProceed, handleSubmit],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSubmit(userInput);
      }
    },
    [handleSubmit, userInput],
  );

  return {
    gameState: {
      currentChar,
      userInput,
      score,
      combo,
    },
    input: {
      isWrongAnswer: isInputDisabled,
    },
    timer: {
      totalTimeMs: timerTotalTimeMs,
      timeLeftMs,
    },
    handlers: {
      handleSubmit,
      handleInputChange,
      handleKeyPress,
    },
  };
}
