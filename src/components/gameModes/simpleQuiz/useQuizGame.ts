import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getRandomCharacter,
  loadPracticeCharacters,
  type PracticeCharacter,
} from '@/lib/characterLoading';
import { useTimer } from '@/lib/useTimer';
import { useQuizFlow } from './useQuizFlow';

const practiceCharacters = loadPracticeCharacters();

export interface UseQuizGameState {
  currentChar: PracticeCharacter;
  userInput: string;
  score: number;
  combo: number;
  isInputValid: boolean;
  isWrongAnswer: boolean;
  totalTimeMs: number;
  timeLeftMs: number;
  handleSubmit: (input: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

export function useQuizGame(): UseQuizGameState {
  // State
  const [currentChar, setCurrentChar] = useState<PracticeCharacter>(
    practiceCharacters[0],
  );
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [isInputValid, setIsInputValid] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState(false);

  // Helpers
  const getRandomChar = useCallback(
    () => getRandomCharacter(practiceCharacters),
    [],
  );

  const resetQuizState = useCallback(() => {
    setCurrentChar(getRandomChar());
    setUserInput('');
    setIsInputValid(true);
    setIsInputDisabled(false);
    setIsWrongAnswer(false);
  }, [getRandomChar]);

  // Timer
  const resetTimerRef = useRef<(() => void) | null>(null);
  const totalTimeMs = 5000;
  const {
    timeLeftMs,
    resetTimer,
    totalTimeMs: timerTotalTimeMs,
  } = useTimer({
    totalTimeMs,
    onTimeout: useCallback(() => {
      setCombo(0);
      setIsInputDisabled(true);
      setIsWrongAnswer(true);
      showTimeoutAndProceed();
    }, [currentChar]),
  });
  useEffect(() => {
    resetTimerRef.current = resetTimer;
  }, [resetTimer]);

  // Quiz flow
  const { showIncorrectAndProceed, showTimeoutAndProceed, proceedToNext } =
    useQuizFlow({
      onNextCharacter: resetQuizState,
      onResetTimer: () => resetTimerRef.current?.(),
    });

  // Handlers
  const handleSubmit = useCallback(
    (input: string) => {
      if (isInputDisabled) return;
      const normalized = input.toLowerCase().trim();
      const isCorrect = currentChar.validAnswers.some(
        (ans) => normalized === ans.toLowerCase(),
      );
      setIsInputDisabled(true);
      if (isCorrect) {
        setScore((s) => s + 1);
        setCombo((c) => c + 1);
        setIsWrongAnswer(false);
        proceedToNext();
      } else {
        setCombo(0);
        setIsWrongAnswer(true);
        showIncorrectAndProceed();
      }
    },
    [isInputDisabled, currentChar, proceedToNext, showIncorrectAndProceed],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isInputDisabled) return;
      const value = e.target.value;
      setUserInput(value);
      if (value.length === 1) {
        setIsWrongAnswer(false);
      }
      const normalized = value.toLowerCase().trim();
      if (!normalized) {
        setIsInputValid(true);
        return;
      }
      const validStart = currentChar.validAnswers.some((ans) =>
        ans.toLowerCase().startsWith(normalized),
      );
      setIsInputValid(validStart);
      if (!validStart) return;
      const isExact = currentChar.validAnswers.some(
        (ans) => normalized === ans.toLowerCase(),
      );
      if (isExact) handleSubmit(value);
    },
    [isInputDisabled, currentChar, handleSubmit],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSubmit(userInput);
    },
    [handleSubmit, userInput],
  );

  return {
    currentChar,
    userInput,
    score,
    combo,
    isInputValid,
    isWrongAnswer,
    totalTimeMs: timerTotalTimeMs,
    timeLeftMs,
    handleSubmit,
    handleInputChange,
    handleKeyPress,
  };
}
