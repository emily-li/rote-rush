import hiraganaData from '@/resources/hiragana.json';
import katakanaData from '@/resources/katakana.json';
import type { PracticeCharacter } from '@/types';

// Load characters once at module initialization
const practiceCharacters: PracticeCharacter[] = [
  ...hiraganaData.values.map((item: any) => ({
    char: item.character,
    validAnswers: item.answers,
  })),
  ...katakanaData.values.map((item: any) => ({
    char: item.character,
    validAnswers: item.answers,
  })),
];

export const getPracticeCharacters = (): PracticeCharacter[] => {
  return practiceCharacters;
};

export const getRandomCharacter = (
  characters: PracticeCharacter[] = practiceCharacters,
  randomFn: () => number = Math.random,
): PracticeCharacter => {
  const randomIndex = Math.floor(randomFn() * characters.length);
  return characters[randomIndex];
};
