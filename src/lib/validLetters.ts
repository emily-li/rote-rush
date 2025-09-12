import hiraganaData from '@/resources/hiragana.json';
import katakanaData from '@/resources/katakana.json';

/**
 * Extract all unique letters from the valid romanized answers
 * This ensures only letters that are actually needed for the current character set are shown
 */
export const getValidLetters = (): string[] => {
  const letters = new Set<string>();

  // Combine both character sets and extract letters
  [...hiraganaData.values, ...katakanaData.values].forEach((item) => {
    item.answers.forEach((answer) => {
      for (const char of answer) {
        if (char >= 'a' && char <= 'z') {
          letters.add(char);
        }
      }
    });
  });

  return Array.from(letters).sort();
};

/**
 * Organize letters into rows for the keyboard layout following US QWERTY layout
 */
export const getKeyboardRows = (): string[][] => {
  const validLetters = getValidLetters();

  // Standard US QWERTY keyboard layout, filtered by valid letters
  const qwertyLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], // Top row
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], // Home row
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'], // Bottom row
  ];

  return qwertyLayout.map((row) =>
    row.filter((letter) => validLetters.includes(letter)),
  );
};
