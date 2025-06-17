import { useCallback, useState } from 'react';
import type { PracticeCharacter } from '@/lib/characterLoading';
import {
  checkAnswerMatch,
  checkValidStart,
  normalizeInput,
} from './inputValidation';

export interface UseQuizInputState {
  userInput: string;
  isWrongAnswer: boolean;
}

export interface UseQuizInputActions {
  setUserInput: (input: string) => void;
  clearInput: () => void;
  markWrong: () => void;
  clearWrongState: () => void;
}

export interface UseQuizInputHandlers {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export interface UseQuizInputOptions {
  currentChar: PracticeCharacter;
  onCorrectAnswer: (input: string) => void;
  onIncorrectAnswer: () => void;
}

export interface UseQuizInputReturn extends UseQuizInputState {
  actions: UseQuizInputActions;
  handlers: UseQuizInputHandlers;
}

/**
 * Input handling and validation logic
 */
export function useQuizInput({
  currentChar,
  onCorrectAnswer,
  onIncorrectAnswer,
}: UseQuizInputOptions): UseQuizInputReturn {
  const [userInput, setUserInput] = useState('');
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);

  const clearInput = useCallback(() => {
    setUserInput('');
    setIsWrongAnswer(false);
  }, []);

  const markWrong = useCallback(() => {
    setIsWrongAnswer(true);
  }, []);

  const clearWrongState = useCallback(() => {
    setIsWrongAnswer(false);
  }, []);

  const handleSubmit = useCallback(
    (input: string) => {
      const isCorrect = checkAnswerMatch(input, currentChar.validAnswers);

      if (isCorrect) {
        onCorrectAnswer(input);
      } else {
        markWrong();
        onIncorrectAnswer();
      }
    },
    [currentChar, onCorrectAnswer, onIncorrectAnswer, markWrong],
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

      // Check for complete match
      if (checkAnswerMatch(currentInput, currentChar.validAnswers)) {
        handleSubmit(value);
        return;
      }

      // Check for valid prefix
      if (!checkValidStart(currentInput, currentChar.validAnswers)) {
        handleSubmit(value); // This will trigger incorrect flow
      }
    },
    [isWrongAnswer, currentChar, handleSubmit],
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
    userInput,
    isWrongAnswer,
    actions: {
      setUserInput,
      clearInput,
      markWrong,
      clearWrongState,
    },
    handlers: {
      handleInputChange,
      handleKeyPress,
    },
  };
}
