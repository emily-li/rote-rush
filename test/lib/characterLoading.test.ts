import { beforeEach, describe, expect, it } from 'vitest';
import {
  getRandomCharacter,
  loadPracticeCharacters,
  type PracticeCharacter,
} from '../../src/lib/characterLoading';

describe('characterLoading', () => {
  // Load characters once for all tests in this suite
  const loadedCharacters = loadPracticeCharacters();

  describe('loadPracticeCharacters', () => {
    it('should include hiragana characters', () => {
      const hiraganaChars = loadedCharacters.filter((char) =>
        ['あ', 'ち'].includes(char.char),
      );

      expect(hiraganaChars.length).equals(2);
    });

    it('should include katakana characters', () => {
      const katakanaChars = loadedCharacters.filter((char) =>
        ['ア', 'カ', 'サ'].includes(char.char),
      );

      expect(katakanaChars.length).equals(3);
    });

    it('should have characters with valid romaji answers', () => {
      loadedCharacters.forEach((char) => {
        char.validAnswers.forEach((answer) => {
          expect(answer.length).toBeGreaterThan(0);
          // Romaji should only contain lowercase letters
          expect(answer).toMatch(/^[a-z]+$/);
        });
      });
    });
  });

  describe('getRandomCharacter', () => {
    const characters: PracticeCharacter[] = [
      { char: 'あ', validAnswers: ['a'] },
      { char: 'か', validAnswers: ['ka'] },
    ];

    it('should return a character from the provided array', () => {
      const randomChar = getRandomCharacter(characters);

      expect(characters).toContain(randomChar);
    });
    it('should return different characters over multiple calls', () => {
      const firstChar = getRandomCharacter(characters, () => 0); // index 0
      const secondChar = getRandomCharacter(characters, () => 0.9); // index 1

      expect(firstChar.char).toBe('あ');
      expect(secondChar.char).toBe('か');
    });

    it('should work with the actual loaded characters', () => {
      const randomChar = getRandomCharacter(loadedCharacters);

      expect(loadedCharacters).toContain(randomChar);
    });
  });
});
