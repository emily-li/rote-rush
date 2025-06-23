/**
 * Shared utility functions for quiz components
 */

import type { PracticeCharacter } from '@/types';

/**
 * Calculate score multiplier based on the current streak.
 * Rewards consistent correct answers with increasing multipliers:
 * - 1.0x : Default multiplier
 * - 1.5x : After 10 consecutive correct answers
 * - 2.0x : After 50 consecutive correct answers
 * - 3.0x : After 100 consecutive correct answers
 */
export function getComboMultiplier(streak: number): number {
  if (streak >= 100) return 3.0;
  if (streak >= 50) return 2.0;
  if (streak >= 10) return 1.5;
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
