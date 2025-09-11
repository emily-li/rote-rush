import { useCallback, useEffect, useRef, useState } from 'react';
import { SPIRAL_TIMER_CONFIG } from '@/config/spiral';
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
  
  // Use ref to store current characters array for callback access
  const charactersRef = useRef<PracticeCharacter[]>([]);

  // --- Stable advanceCharacters ---
  const advanceCharacters = useCallback(() => {
    setSpiralCharacters((prev: SpiralCharacter[]) => {
      // Remove the first character (head), shift all others forward, add a new one at the end
      const newChars = prev.slice(1);
      const newChar: SpiralCharacter = {
        char: getWeightedRandomCharacter(charactersRef.current),
        id: getUniqueSpiralId(),
      };
      return [...newChars, newChar];
    });
  }, []);

  const quizGame = useQuizGame({
    timerConfig: SPIRAL_TIMER_CONFIG,
    onCharacterComplete: advanceCharacters,
    getNextCharacter: () => {
      if (spiralCharacters.length > 1) {
        return spiralCharacters[1].char;
      }
      return undefined; // No more characters in spiral
    },
  });

  const initializeSpiral = useCallback((currentChar: PracticeCharacter, characters: PracticeCharacter[]) => {
    const characterCount = getVisibleCharacterCount(width, height);
    const initialSpiral: SpiralCharacter[] = [];
    initialSpiral.push({
      char: currentChar,
      id: getUniqueSpiralId('spiral-0'),
    });
    for (let i = 1; i < characterCount; i++) {
      initialSpiral.push({
        char: getWeightedRandomCharacter(characters),
        id: getUniqueSpiralId(`spiral-${i}`),
      });
    }
    setSpiralCharacters(initialSpiral);
  }, [
    width,
    height,
  ]);

  // Initialize spiral once when the quiz game is ready, then never again except for window size changes
  useEffect(() => {
    if (spiralCharacters.length === 0 && quizGame.characterState.characters.length > 0) {
      // Use the current character at the time of initialization
      const currentChar = quizGame.characterState.currentChar;
      if (currentChar) {
        initializeSpiral(currentChar, quizGame.characterState.characters);
      }
    }
  }, [initializeSpiral, spiralCharacters.length, quizGame.characterState.characters.length]);

  // Keep charactersRef updated
  useEffect(() => {
    charactersRef.current = quizGame.characterState.characters;
  }, [quizGame.characterState.characters]);

  return {
    gameState: quizGame,
    spiralCharacters,
  };
};
