import { beforeEach, describe, expect, it } from 'vitest';
import {
  loadPracticeCharacters,
} from '../../src/lib/characterLoading';
import type { PracticeCharacter } from '../../src/types';

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
});
