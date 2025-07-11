import { describe, expect, it } from 'vitest';
import {
  getMultipleRandomCharacters,
  loadPracticeCharacters,
} from '../../src/lib/characterLoading';
import type { PracticeCharacter } from '../../src/types';

// Test suite for character loading utilities

describe('characterLoading', () => {
  // Load characters once for all tests in this suite
  const loadedCharacters: PracticeCharacter[] = loadPracticeCharacters();

  describe('loadPracticeCharacters', () => {
    it('should include hiragana characters', () => {
      const hiraganaChars = loadedCharacters.filter((char) =>
        ['あ', 'ち'].includes(char.char),
      );
      expect(hiraganaChars.length).toBe(2);
    });

    it('should include katakana characters', () => {
      const katakanaChars = loadedCharacters.filter((char) =>
        ['ア', 'カ', 'サ'].includes(char.char),
      );
      expect(katakanaChars.length).toBe(3);
    });

    it('should have characters with valid romaji answers', () => {
      loadedCharacters.forEach((char) => {
        char.validAnswers.forEach((answer) => {
          expect(typeof answer).toBe('string');
          expect(answer.length).toBeGreaterThan(0);
          // Romaji should only contain lowercase letters
          expect(answer).toMatch(/^[a-z]+$/);
        });
      });
    });
  });

  describe('getMultipleRandomCharacters', () => {
    it('should not select characters with conflicting answers', () => {
      const selectedChars = getMultipleRandomCharacters(4);
      const allAnswers = selectedChars.flatMap((char) => char.validAnswers);
      const uniqueAnswers = new Set(allAnswers);
      expect(allAnswers.length).toBe(uniqueAnswers.size);
    });

    it('should return different characters on subsequent calls', () => {
      const selection1 = getMultipleRandomCharacters(4).map((c) => c.char);
      const selection2 = getMultipleRandomCharacters(4).map((c) => c.char);
      expect(selection1).not.toEqual(selection2);
    });
  });
});
