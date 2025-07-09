import hiraganaData from '@/resources/hiragana.json';
import katakanaData from '@/resources/katakana.json';
import type { PracticeCharacter } from '@/types';

/**
 * Character loading and weight management utilities
 */

/** Local storage key for persisting character weights */
const WEIGHTS_KEY = 'practiceCharacterWeights';

/** Default weight for new characters */
const INITIAL_WEIGHT = 5;

/** Minimum allowed weight (ensures all characters stay in rotation) */
const MIN_WEIGHT = 1;

/** Maximum allowed weight (prevents one character from dominating) */
const MAX_WEIGHT = 20;

/**
 * Character weight data structure for localStorage
 */
type CharacterWeights = Record<string, number>;

/**
 * Save character weights to localStorage with error handling
 * @param characters - Array of practice characters with current weights
 */
export const saveCharacterWeights = (
  characters: readonly PracticeCharacter[],
): void => {
  try {
    const weights: CharacterWeights = {};
    characters.forEach((character) => {
      weights[character.char] = character.weight ?? INITIAL_WEIGHT;
    });
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights));
  } catch (error) {
    // Silently handle localStorage quota errors or access issues
    console.warn('Failed to save character weights:', error);
  }
};

/**
 * Load saved character weights from localStorage with error handling
 * @returns Object mapping character to its weight, or empty object if loading fails
 */
export const loadSavedWeights = (): CharacterWeights => {
  try {
    const raw = localStorage.getItem(WEIGHTS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      const weights: CharacterWeights = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entries = Object.entries(parsed as Record<string, any>);
      for (const [key, value] of entries) {
        if (typeof key === 'string' && typeof value === 'number') {
          weights[key] = value;
        }
      }
      return weights;
    }
    return {};
  } catch (error) {
    console.warn('Failed to load character weights:', error);
    return {};
  }
};

/**
 * Load practice characters from JSON data files with saved weights applied
 * @returns Array of practice characters ready for use
 */
export const loadPracticeCharacters = (): PracticeCharacter[] => {
  const savedWeights = loadSavedWeights();

  const mapCharacterData = (item: {
    character: string;
    answers: string[];
  }): PracticeCharacter => ({
    char: item.character,
    validAnswers: item.answers,
    weight: clampWeight(savedWeights[item.character] ?? INITIAL_WEIGHT),
  });

  return [
    ...(hiraganaData.values as { character: string; answers: string[] }[]).map(
      mapCharacterData,
    ),
    ...(katakanaData.values as { character: string; answers: string[] }[]).map(
      mapCharacterData,
    ),
  ];
};

/**
 * Clamp a weight value within the defined min/max bounds
 * @param weight - Weight value to clamp
 * @returns Clamped weight between MIN_WEIGHT and MAX_WEIGHT
 */
const clampWeight = (weight: number): number => {
  return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight));
};

/**
 * Select a random character using weighted probability distribution
 * Characters with higher weights are more likely to be selected
 * @param characters - Array of available practice characters
 * @param randomFn - Random number generator function (0-1), defaults to Math.random
 * @returns Randomly selected character based on weights
 * @throws Error if characters array is empty
 */
export const getWeightedRandomCharacter = (
  characters: readonly PracticeCharacter[],
  randomFn: () => number = Math.random,
): PracticeCharacter => {
  if (characters.length === 0) {
    throw new Error('Cannot select from empty characters array');
  }

  const totalWeight = characters.reduce(
    (sum, character) => sum + (character.weight ?? INITIAL_WEIGHT),
    0,
  );

  let randomValue = randomFn() * totalWeight;

  for (const character of characters) {
    randomValue -= character.weight ?? INITIAL_WEIGHT;
    if (randomValue <= 0) {
      return character;
    }
  }

  // Fallback to last character (should rarely happen due to floating point precision)
  return characters[characters.length - 1];
};

/**
 * Select multiple unique random characters
 * @param count - Number of unique characters to select
 * @param exclude - Characters to exclude from selection
 * @param randomFn - Random number generator function (0-1), defaults to Math.random
 * @returns Array of unique character strings
 * @throws Error if requested count exceeds available characters
 */
export const getMultipleRandomCharacters = (
  count: number,
  exclude: string[] = [],
  randomFn: () => number = Math.random,
): PracticeCharacter[] => {
  const practiceChars = loadPracticeCharacters();
  const available = practiceChars
    .filter((pc) => pc.char.length === 1 && !exclude.includes(pc.char));

  if (count > available.length) {
    throw new Error(
      'Requested character count exceeds available unique characters',
    );
  }

  // Fisher-Yates (Knuth) shuffle
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }

  return available.slice(0, count);
};
