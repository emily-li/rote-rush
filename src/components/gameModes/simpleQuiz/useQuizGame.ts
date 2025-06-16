import { useCallback, useRef, useState } from 'react';
import {
  getRandomCharacter,
  loadPracticeCharacters,
  type PracticeCharacter,
} from '@/lib/characterLoading';
import { useTimer } from '@/lib/useTimer';
import { useQuizFlow } from './useQuizFlow';

const practiceCharacters = loadPracticeCharacters();

export interface UseQuizGameState {
  // State
  currentChar: PracticeCharacter;
  userInput: string;
  score: number;
  combo: number;
  feedback: string;
  isInputValid: boolean;
  isInputDisabled: boolean;
  timeLeft: number;
  timerPercentage: number;

  // Actions
  handleSubmit: (input: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

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

  // Create a ref to store resetTimer function for quiz flow
  const resetTimerRef = useRef<(() => void) | null>(null);

  const { showIncorrectAndProceed, showTimeoutAndProceed, proceedToNext } =
    useQuizFlow({
      onNextCharacter: resetQuizState,
      onResetTimer: () => resetTimerRef.current?.(),
    });

  const handleTimeout = useCallback(() => {
    setFeedback(`Time's up! The answer was "${currentChar.validAnswers[0]}"`);
    setCombo(0);
    setIsInputDisabled(true);
    showTimeoutAndProceed();
  }, [currentChar, showTimeoutAndProceed]);

  const { timeLeft, timerPercentage, resetTimer } = useTimer({
    initialTime: 10,
    onTimeout: handleTimeout,
  });

  // Store resetTimer in the ref for quiz flow to use
  resetTimerRef.current = resetTimer;

  const handleSubmit = useCallback(
    (input: string) => {
      // Accept any valid answer in validAnswers
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

      // Clear any existing feedback when user starts typing
      if (feedback && value.length === 1) {
        setFeedback('');
      }

      // Check if current input is a valid start of any correct answer
      const currentInput = value.toLowerCase().trim();
      const validStarts = currentChar.validAnswers.some((ans: string) =>
        ans.toLowerCase().startsWith(currentInput),
      );

      if (currentInput.length > 0) {
        // If input doesn't match the beginning of any correct answer, immediately mark as incorrect
        if (!validStarts) {
          const feedbackMessage = `Incorrect. The answer was "${currentChar.validAnswers[0]}"`;
          setFeedback(feedbackMessage);
          setIsInputValid(false);
          setIsInputDisabled(true);
          setCombo(0);
          showIncorrectAndProceed();
        }
        // If input exactly matches any answer, auto-submit
        else if (
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
    isInputDisabled,
    timeLeft,
    timerPercentage,
    handleSubmit,
    handleInputChange,
    handleKeyPress,
  };
}
