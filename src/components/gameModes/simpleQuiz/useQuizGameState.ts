import { useCallback, useState } from 'react';
import {
  getRandomCharacter,
  loadPracticeCharacters,
  type PracticeCharacter,
} from '@/lib/characterLoading';

const practiceCharacters = loadPracticeCharacters();

export interface UseQuizGameState {
  currentChar: PracticeCharacter;
  score: number;
  combo: number;
}

export interface UseQuizGameActions {
  nextCharacter: () => void;
  incrementScore: () => void;
  resetCombo: () => void;
  resetGame: () => void;
}

export interface UseQuizGameReturn extends UseQuizGameState {
  actions: UseQuizGameActions;
}

/**
 * Pure game state management - score, combo, current character
 */
export function useQuizGameState(): UseQuizGameReturn {
  const [currentChar, setCurrentChar] = useState<PracticeCharacter>(
    practiceCharacters[0],
  );
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const getRandomChar = useCallback(() => {
    return getRandomCharacter(practiceCharacters);
  }, []);

  const nextCharacter = useCallback(() => {
    setCurrentChar(getRandomChar());
  }, [getRandomChar]);

  const incrementScore = useCallback(() => {
    setScore((prev) => prev + 1);
    setCombo((prev) => prev + 1);
  }, []);

  const resetCombo = useCallback(() => {
    setCombo(0);
  }, []);

  const resetGame = useCallback(() => {
    setCurrentChar(getRandomChar());
    setScore(0);
    setCombo(0);
  }, [getRandomChar]);

  return {
    currentChar,
    score,
    combo,
    actions: {
      nextCharacter,
      incrementScore,
      resetCombo,
      resetGame,
    },
  };
}
