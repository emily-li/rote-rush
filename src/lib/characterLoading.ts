import hiraganaData from '@/resources/hiragana.json';
import katakanaData from '@/resources/katakana.json';
import type { PracticeCharacter } from '@/types';

const WEIGHTS_KEY = 'practiceCharacterWeights';
const INITIAL_WEIGHT = 5;
const MIN_WEIGHT = 1;
const MAX_WEIGHT = 20;

/**
 * Save the weights of practice characters to localStorage.
 * @param characters - The array of practice characters to save.
 */
export const saveCharacterWeights = (characters: PracticeCharacter[]) => {
  try {
    const weights: Record<string, number> = {};
    characters.forEach(c => { weights[c.char] = c.weight || INITIAL_WEIGHT; });
    localStorage.setItem(WEIGHTS_KEY, JSON.stringify(weights));
  } catch (e) {
    // Fallback: ignore quota errors or localStorage issues
  }
};

/**
 * Load saved character weights from localStorage.
 * @returns An object mapping character to its weight.
 */
export const loadSavedWeights = (): Record<string, number> => {
  try {
    const raw = localStorage.getItem(WEIGHTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

/**
 * Load practice characters from the data files, applying saved weights.
 * @returns An array of practice characters with their weights.
 */
export const loadPracticeCharacters = (): PracticeCharacter[] => {
  const savedWeights = loadSavedWeights();
  return [
    ...hiraganaData.values.map((item: any) => ({
      char: item.character,
      validAnswers: item.answers,
      weight: clampWeight(savedWeights[item.character] ?? INITIAL_WEIGHT),
    })),
    ...katakanaData.values.map((item: any) => ({
      char: item.character,
      validAnswers: item.answers,
      weight: clampWeight(savedWeights[item.character] ?? INITIAL_WEIGHT),
    })),
  ];
};

/**
 * Clamp a weight value to be within the defined min and max bounds.
 * @param weight - The weight value to clamp.
 * @returns The clamped weight value.
 */
function clampWeight(weight: number) {
  return Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, weight));
}

/**
 * Get a weighted random character from the array of practice characters.
 * @param characters - The array of practice characters.
 * @param randomFn - Optional custom random function.
 * @returns A weighted random practice character.
 */
export const getWeightedRandomCharacter = (
  characters: PracticeCharacter[],
  randomFn: () => number = Math.random,
): PracticeCharacter => {
  const totalWeight = characters.reduce((sum, c) => sum + (c.weight || INITIAL_WEIGHT), 0);
  let rand = randomFn() * totalWeight;
  for (const c of characters) {
    rand -= c.weight || INITIAL_WEIGHT;
    if (rand <= 0) return c;
  }
  return characters[characters.length - 1]; // fallback
};
