import hiraganaData from '@/resources/hiragana.json';
import katakanaData from '@/resources/katakana.json';

export interface PracticeCharacter {
  char: string;
  validAnswers: string[];
}

export const loadPracticeCharacters = (): PracticeCharacter[] => {
  return [
    ...hiraganaData.values.map((item: any) => ({
      char: item.character,
      validAnswers: item.answers,
    })),
    ...katakanaData.values.map((item: any) => ({
      char: item.character,
      validAnswers: item.answers,
    })),
  ];
};

export const getRandomCharacter = (
  characters: PracticeCharacter[],
  randomFn: () => number = Math.random,
): PracticeCharacter => {
  const randomIndex = Math.floor(randomFn() * characters.length);
  return characters[randomIndex];
};
