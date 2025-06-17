import { useCallback, useRef, useState } from 'react';
import {
  getRandomCharacter,
  loadPracticeCharacters,
  type PracticeCharacter,
} from '@/lib/characterLoading';
import { useTimer } from '@/lib/useTimer';
import type { QuizGameInterface } from './types';
import { useQuizFlow } from './useQuizFlow';

export type {
  QuizGameState,
  QuizInputState,
  QuizTimerState,
  QuizGameHandlers,
  QuizGameInterface,
} from './types';

const practiceCharacters = loadPracticeCharacters();

const TOTAL_TIME_MS = 5000;

const normalizeInput = (input: string): string => input.toLowerCase().trim();

const checkAnswerMatch = (input: string, validAnswers: string[]): boolean => {
  const normalized = normalizeInput(input);
  return validAnswers.some((ans) => normalizeInput(ans) === normalized);
};

const checkValidStart = (input: string, validAnswers: string[]): boolean => {
  const normalized = normalizeInput(input);
  return validAnswers.some((ans) => normalizeInput(ans).startsWith(normalized));
};

export function useQuizGame(): QuizGameInterface {
  const [currentChar, setCurrentChar] = useState<PracticeCharacter>(
    practiceCharacters[0],
  );
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isInputValid, setIsInputValid] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const getRandomChar = useCallback(() => {
    return getRandomCharacter(practiceCharacters);
  }, []);

  const resetQuizState = useCallback(() => {
    setCurrentChar(getRandomChar());
    setUserInput('');
    setIsInputValid(true);
    setIsInputDisabled(false);
  }, [getRandomChar]);

  const resetTimerRef = useRef<(() => void) | null>(null);

  const { showIncorrectAndProceed, showTimeoutAndProceed, proceedToNext } =
    useQuizFlow({
      onNextCharacter: resetQuizState,
      onResetTimer: () => resetTimerRef.current?.(),
    });

  const handleTimeout = useCallback(() => {
    setCombo(0);
    setIsInputDisabled(true);
    showTimeoutAndProceed();
  }, [showTimeoutAndProceed]);

  const {
    timeLeftMs,
    resetTimer,
    totalTimeMs: timerTotalTimeMs,
  } = useTimer({
    totalTimeMs: TOTAL_TIME_MS,
    onTimeout: handleTimeout,
  });

  resetTimerRef.current = resetTimer;

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
        setIsInputValid(true);
        return;
      }

      if (checkAnswerMatch(currentInput, currentChar.validAnswers)) {
        handleSubmit(value);
        return;
      }

      if (checkValidStart(currentInput, currentChar.validAnswers)) {
        setIsInputValid(true);
      } else {
        setIsInputValid(false);
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
    currentChar,
    userInput,
    score,
    combo,
    isInputValid,
    isWrongAnswer: isInputDisabled,
    totalTimeMs: timerTotalTimeMs,
    timeLeftMs,
    handleSubmit,
    handleInputChange,
    handleKeyPress,
  };
}
