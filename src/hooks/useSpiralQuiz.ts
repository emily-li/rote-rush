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
  const charactersRef = useRef<PracticeCharacter[]>([]);
  const isInitializedRef = useRef(false);

  // Create a stable callback that doesn't depend on the current characters state
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

  // Keep charactersRef in sync with current characters
  useEffect(() => {
    charactersRef.current = quizGame.characterState.characters;
  }, [quizGame.characterState.characters]);

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

  // Initialize spiral when quiz game is ready
  useEffect(() => {
    if (quizGame.characterState.characters.length > 0 && quizGame.characterState.currentChar && !isInitializedRef.current) {
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
      isInitializedRef.current = true;
    }
    // Note: quizGame.characterState.characters is intentionally excluded from dependencies
    // to prevent infinite re-renders when the characters array is updated during gameplay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizGame.characterState.characters.length, quizGame.characterState.currentChar, width, height]);

  // Re-initialize when dimensions change
  useEffect(() => {
    if (isInitializedRef.current) {
      isInitializedRef.current = false; // Reset flag to trigger re-initialization
    }
  }, [width, height]);

  return {
    gameState: quizGame,
    spiralCharacters,
  };
};
