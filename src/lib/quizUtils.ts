/**
 * Shared utility functions for quiz components
 */

/**
 * Determines score multiplier from streak of correct answers using configuration.
 */
import { COMBO_MULTIPLIER_CONFIG } from '@/config/quiz';
import type { PracticeCharacter } from '@/types';

export function getComboMultiplier(streak: number): number {
  const levels = Object.values(COMBO_MULTIPLIER_CONFIG).sort(
    (a, b) => b.STREAK - a.STREAK,
  );

  for (const level of levels) {
    if (streak >= level.STREAK) {
      return level.MULTIPLIER;
    }
  }
  return 1.0;
}

/**
 * Adjust the probability weight of a character based on user performance.
 * - Correct answers decrease the weight (character appears less frequently)
 * - Wrong answers increase the weight (character appears more frequently)
 * @param characters List of practice characters
 * @param char Character to adjust weight for
 * @param delta Amount to adjust weight by (positive or negative)
 * @param minWeight Minimum weight to clamp to
 * @returns New array of characters with adjusted weights
 */
export function adjustWeight(
  characters: PracticeCharacter[],
  char: string,
  delta: number,
  minWeight: number = 1,
): PracticeCharacter[] {
  return characters.map((c) =>
    c.char === char
      ? { ...c, weight: Math.max(minWeight, (c.weight || 1) + delta) }
      : c,
  );
}

/**
 * Reset the input field and error state when moving to a new character.
 * Called after both correct answers and timeouts.
 */
export const resetForNextCharacter = (
  setUserInput: (s: string) => void,
  setIsWrongAnswer: (b: boolean) => void,
): void => {
  setUserInput('');
  setIsWrongAnswer(false);
};
