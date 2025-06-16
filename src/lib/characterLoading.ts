import hiraganaData from '@/resources/hiragana.json';
import katakanaData from '@/resources/katakana.json';

export interface PracticeCharacter {
  char: string;
  validAnswers: string[];
}

// Combine both sets if you want to practice both, or use one at a time
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
): PracticeCharacter => {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
};
