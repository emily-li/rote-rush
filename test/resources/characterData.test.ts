
import { describe, expect, it } from 'vitest';
import hiraganaData from '../../src/resources/hiragana.json';
import katakanaData from '../../src/resources/katakana.json';

const hiraganaTyped = hiraganaData as CharacterData;
const katakanaTyped = katakanaData as CharacterData;
type CharacterEntry = {
  character: string;
  answers: string[];
};

type CharacterData = {
  locale: string;
  set_name: string;
  values: CharacterEntry[];
};

describe('Character Data Files', () => {
  describe('hiragana.json', () => {
    it('should have correct structure', () => {
      expect(hiraganaTyped).toHaveProperty('locale');
      expect(hiraganaTyped).toHaveProperty('set_name');
      expect(hiraganaTyped).toHaveProperty('values');

      expect(hiraganaTyped.locale).toBe('ja-JP');
      expect(hiraganaTyped.set_name).toBe('hiragana');
      expect(Array.isArray(hiraganaTyped.values)).toBe(true);
    });

    it('should have valid character entries', () => {
      expect(hiraganaTyped.values.length).toBeGreaterThan(0);

      hiraganaTyped.values.forEach((entry) => {
        expect(entry).toHaveProperty('character');
        expect(entry).toHaveProperty('answers');

        expect(typeof entry.character).toBe('string');
        expect(entry.character.length).toBeGreaterThan(0);

        expect(Array.isArray(entry.answers)).toBe(true);
        expect(entry.answers.length).toBeGreaterThan(0);

        entry.answers.forEach((answer) => {
          expect(typeof answer).toBe('string');
          expect(answer.length).toBeGreaterThan(0);
          // Romanji should only contain lowercase letters
          expect(answer).toMatch(/^[a-z]+$/);
        });
      });
    });

    it('should contain basic hiragana characters', () => {
      const characters = hiraganaTyped.values.map(
        (entry) => entry.character,
      );

      // Check for some basic hiragana
      const basicHiragana = ['あ', 'い', 'う', 'え', 'お'];

      basicHiragana.forEach((char) => {
        expect(characters).toContain(char);
      });
    });

    it('should have valid romanji mappings', () => {
      const vowels = hiraganaTyped.values.filter((entry) =>
        ['あ', 'い', 'う', 'え', 'お'].includes(entry.character),
      );

      expect(vowels.length).toBe(5);

      const aChar = vowels.find((entry) => entry.character === 'あ');
      expect(aChar?.answers).toContain('a');

      const iChar = vowels.find((entry) => entry.character === 'い');
      expect(iChar?.answers).toContain('i');
    });
  });

  describe('katakana.json', () => {
    it('should have correct structure', () => {
      expect(katakanaTyped).toHaveProperty('locale');
      expect(katakanaTyped).toHaveProperty('set_name');
      expect(katakanaTyped).toHaveProperty('values');

      expect(katakanaTyped.locale).toBe('ja-JP');
      expect(katakanaTyped.set_name).toBe('katakana');
      expect(Array.isArray(katakanaTyped.values)).toBe(true);
    });

    it('should have valid character entries', () => {
      expect(katakanaTyped.values.length).toBeGreaterThan(0);

      katakanaTyped.values.forEach((entry) => {
        expect(entry).toHaveProperty('character');
        expect(entry).toHaveProperty('answers');

        expect(typeof entry.character).toBe('string');
        expect(entry.character.length).toBeGreaterThan(0);

        expect(Array.isArray(entry.answers)).toBe(true);
        expect(entry.answers.length).toBeGreaterThan(0);

        entry.answers.forEach((answer) => {
          expect(typeof answer).toBe('string');
          expect(answer.length).toBeGreaterThan(0);
          // Romanji should only contain lowercase letters
          expect(answer).toMatch(/^[a-z]+$/);
        });
      });
    });

    it('should contain basic katakana characters', () => {
      const characters = katakanaTyped.values.map(
        (entry) => entry.character,
      );

      // Check for some basic katakana
      const basicKatakana = ['ア', 'イ', 'ウ', 'エ', 'オ'];

      basicKatakana.forEach((char) => {
        expect(characters).toContain(char);
      });
    });

    it('should have valid romanji mappings', () => {
      const vowels = katakanaTyped.values.filter((entry) =>
        ['ア', 'イ', 'ウ', 'エ', 'オ'].includes(entry.character),
      );

      expect(vowels.length).toBe(5);

      const aChar = vowels.find((entry) => entry.character === 'ア');
      expect(aChar?.answers).toContain('a');

      const iChar = vowels.find((entry) => entry.character === 'イ');
      expect(iChar?.answers).toContain('i');
    });
  });

  describe('Data consistency', () => {
    it('should have unique characters within each set', () => {
      const hiraganaChars = hiraganaTyped.values.map(
        (entry) => entry.character,
      );
      const katakanaChars = katakanaTyped.values.map(
        (entry) => entry.character,
      );

      // Check for duplicates within hiragana
      const uniqueHiragana = new Set(hiraganaChars);
      expect(uniqueHiragana.size).toBe(hiraganaChars.length);

      // Check for duplicates within katakana
      const uniqueKatakana = new Set(katakanaChars);
      expect(uniqueKatakana.size).toBe(katakanaChars.length);
    });

    it('should have both single and multiple answer options', () => {
      const allEntries = [...hiraganaTyped.values, ...katakanaTyped.values];

      const singleAnswers = allEntries.filter(
        (entry) => entry.answers.length === 1,
      );
      const multipleAnswers = allEntries.filter(
        (entry) => entry.answers.length > 1,
      );

      expect(singleAnswers.length).toBeGreaterThan(0);
      expect(multipleAnswers.length).toBeGreaterThan(0);
    });

    it('should have reasonable data sizes', () => {
      // Should have a reasonable number of characters for a complete set
      expect(hiraganaTyped.values.length).toBeGreaterThan(40);
      expect(hiraganaTyped.values.length).toBeLessThan(200);

      expect(katakanaTyped.values.length).toBeGreaterThan(40);
      expect(katakanaTyped.values.length).toBeLessThan(200);
    });

    it('should not have empty answers arrays', () => {
      const allEntries = [...hiraganaTyped.values, ...katakanaTyped.values];

      allEntries.forEach((entry) => {
        expect(entry.answers.length).toBeGreaterThan(0);
      });
    });

    it('should not have duplicate answers within single character', () => {
      const allEntries = [...hiraganaTyped.values, ...katakanaTyped.values];

      allEntries.forEach((entry) => {
        const uniqueAnswers = new Set(entry.answers);
        expect(uniqueAnswers.size).toBe(entry.answers.length);
      });
    });
  });
});
