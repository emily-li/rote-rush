import { describe, expect, it } from 'vitest';
import {
  getRandomCharacter,
  getPracticeCharacters,
} from '../../src/lib/characterLoading';

describe('characterLoading', () => {
  const characters = getPracticeCharacters();

  describe('getPracticeCharacters', () => {
    it('should include hiragana characters', () => {
      const hiraganaChars = characters.filter((char) =>
        ['あ', 'ち'].includes(char.char),
      );
      expect(hiraganaChars.length).equals(2);
    });

    it('should include katakana characters', () => {
      const katakanaChars = characters.filter((char) =>
        ['ア', 'カ'].includes(char.char),
      );
      expect(katakanaChars.length).equals(2);
    });

    it('should have valid answers for each character', () => {
      characters.forEach((char) => {
        expect(char.validAnswers).toBeDefined();
        expect(char.validAnswers.length).toBeGreaterThan(0);
      });
    });

    it('should have characters from both character sets', () => {
      expect(characters.length).toBeGreaterThan(90);
    });

    it('should have unique characters', () => {
      const charStrings = characters.map((char) => char.char);
      const uniqueCharStrings = [...new Set(charStrings)];
      expect(charStrings.length).equals(uniqueCharStrings.length);
    });

    it('should have valid structure for each character', () => {
      characters.forEach((char) => {
        expect(char).toHaveProperty('char');
        expect(char).toHaveProperty('validAnswers');
        expect(typeof char.char).equals('string');
        expect(Array.isArray(char.validAnswers)).equals(true);
      });
    });
  });

  describe('getRandomCharacter', () => {
    it('should return a character from the character list', () => {
      const randomChar = getRandomCharacter();
      expect(characters).toContain(randomChar);
    });
  });
});
