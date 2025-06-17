import { useCallback, useRef, useState } from 'react';
import {
  getRandomCharacter,
  loadPracticeCharacters,
  type PracticeCharacter,
} from '@/lib/characterLoading';
import { useTimer } from '@/lib/useTimer';
import { useQuizFlow } from './useQuizFlow';
import type { UseQuizGameState } from './types';

// Re-export types for convenience
export type {
  QuizGameState,
  QuizInputState,
  QuizTimerState,
  QuizGameHandlers,
  UseQuizGameState,
} from './types';

const practiceCharacters = loadPracticeCharacters();

export function useQuizGame(): UseQuizGameState {
  const [currentChar, setCurrentChar] = useState<PracticeCharacter>(
    practiceCharacters[0],
  );
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isInputValid, setIsInputValid] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const getRandomChar = useCallback(() => {
    return getRandomCharacter(practiceCharacters);
  }, []);

  const resetQuizState = useCallback(() => {
    setCurrentChar(getRandomChar());
    setUserInput('');
    setFeedback('');
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
    setFeedback(`${currentChar.validAnswers[0]}`);
    setCombo(0);
    setIsInputDisabled(true);
    showTimeoutAndProceed();
  }, [currentChar, showTimeoutAndProceed]);

  const totalTimeMs = 5000;

  const {
    timeLeftMs,
    resetTimer,
    totalTimeMs: timerTotalTimeMs,
  } = useTimer({
    totalTimeMs: totalTimeMs,
    onTimeout: handleTimeout,
  });

  resetTimerRef.current = resetTimer;

  const handleSubmit = useCallback(
    (input: string) => {
      const isCorrect = currentChar.validAnswers.some(
        (ans: string) => input.toLowerCase().trim() === ans.toLowerCase(),
      );

      if (isCorrect) {
        setScore((prev) => prev + 1);
        setCombo((prev) => prev + 1);
        setFeedback('Correct! ✓');
        proceedToNext();
      } else {
        setCombo(0);
        const feedbackMessage = `Incorrect. The answer was "${currentChar.validAnswers[0]}"`;
        setFeedback(feedbackMessage);
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

      if (feedback && value.length === 1) {
        setFeedback('');
      }

      const currentInput = value.toLowerCase().trim();
      const validStarts = currentChar.validAnswers.some((ans: string) =>
        ans.toLowerCase().startsWith(currentInput),
      );

      if (currentInput.length > 0) {
        if (!validStarts) {
          const feedbackMessage = `Incorrect. The answer was "${currentChar.validAnswers[0]}"`;
          setFeedback(feedbackMessage);
          setIsInputValid(false);
          setIsInputDisabled(true);
          setCombo(0);
          showIncorrectAndProceed();
        } else if (
          currentChar.validAnswers.some(
            (ans: string) => currentInput === ans.toLowerCase(),
          )
        ) {
          handleSubmit(value);
        } else {
          setIsInputValid(true);
        }
      } else {
        setIsInputValid(true);
        setFeedback('');
      }
    },
    [
      isInputDisabled,
      feedback,
      currentChar,
      showIncorrectAndProceed,
      handleSubmit,
    ],
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
    feedback,
    isInputValid,
    isWrongAnswer: isInputDisabled,
    totalTimeMs: timerTotalTimeMs,
    timeLeftMs,
    handleSubmit,
    handleInputChange,
    handleKeyPress,
  };
}
