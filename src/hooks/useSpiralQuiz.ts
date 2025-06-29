import { useCallback, useEffect, useState } from 'react';
import { SPIRAL_CONFIG } from '@/config/spiral';
import { useQuizGame } from '@/hooks/useQuizGame';
import { getWeightedRandomCharacter } from '@/lib/characterLoading';
import { getVisibleCharacterCount } from '@/lib/spiralMath';
import type { PracticeCharacter, QuizModeState } from '@/types';
import { useWindowSize } from './useWindowSize';

export type SpiralCharacter = {
  readonly char: PracticeCharacter;
  readonly id: string;
};

type UseSpiralQuizReturn = {
  gameState: QuizModeState;
  spiralCharacters: SpiralCharacter[];
};

// --- Unique ID generator ---
let spiralIdCounter = 0;
function getUniqueSpiralId(prefix = 'spiral') {
  spiralIdCounter += 1;
  return `${prefix}-${spiralIdCounter}`;
}

export const useSpiralQuiz = (): UseSpiralQuizReturn => {
  const { width, height } = useWindowSize();
  const [spiralCharacters, setSpiralCharacters] = useState<SpiralCharacter[]>(
    [],
  );

  // --- Stable advanceCharacters ---
  const advanceCharacters = useCallback(() => {
    setSpiralCharacters((prev: SpiralCharacter[]) => {
      // Remove the first character (head), shift all others forward, add a new one at the end
      const newChars = prev.slice(1);
      const newChar: SpiralCharacter = {
        char: getWeightedRandomCharacter(quizGame.characterState.characters),
        id: getUniqueSpiralId(),
      };
      return [...newChars, newChar];
    });
  }, []);

  const quizGame = useQuizGame({
    timerConfig: SPIRAL_CONFIG,
    onCharacterComplete: advanceCharacters,
  });

  // Sync spiralCharacters[0].char with currentChar, but only on correct answer
  useEffect(() => {
    if (
      quizGame.characterState.currentChar &&
      !quizGame.scoreState.isWrongAnswer
    ) {
      setSpiralCharacters((prev: SpiralCharacter[]) => {
        if (prev.length === 0) return prev;
        const updated = [
          { ...prev[0], char: quizGame.characterState.currentChar },
          ...prev.slice(1),
        ];
        return updated;
      });
    }
  }, [quizGame.characterState.currentChar, quizGame.scoreState.isWrongAnswer]);

  const initializeSpiral = useCallback(() => {
    const characterCount = getVisibleCharacterCount(width, height);
    const initialSpiral: SpiralCharacter[] = [];
    initialSpiral.push({
      char: quizGame.characterState.currentChar,
      id: getUniqueSpiralId('spiral-0'),
    });
    for (let i = 1; i < characterCount; i++) {
      initialSpiral.push({
        char: getWeightedRandomCharacter(quizGame.characterState.characters),
        id: getUniqueSpiralId(`spiral-${i}`),
      });
    }
    setSpiralCharacters(initialSpiral);
  }, [
    quizGame.characterState.characters,
    quizGame.characterState.currentChar,
    width,
    height,
  ]);

  useEffect(() => {
    initializeSpiral();
  }, [initializeSpiral]);

  return {
    gameState: quizGame,
    spiralCharacters,
  };
};
