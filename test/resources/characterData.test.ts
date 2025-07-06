/// <reference types="vitest" />
import { describe, expect, it } from 'vitest';
import hiraganaData from '../../src/resources/hiragana.json';
import katakanaData from '../../src/resources/katakana.json';

describe('Character Data Files', () => {
  describe('hiragana.json', () => {
    it('should have correct structure', () => {
      expect(hiraganaData).toHaveProperty('locale');
      expect(hiraganaData).toHaveProperty('set_name');
      expect(hiraganaData).toHaveProperty('values');

      expect(hiraganaData.locale).toBe('ja-JP');
      expect(hiraganaData.set_name).toBe('hiragana');
      expect(Array.isArray(hiraganaData.values)).toBe(true);
    });

    it('should have valid character entries', () => {
      expect(hiraganaData.values.length).toBeGreaterThan(0);

      hiraganaData.values.forEach((entry: any) => {
        expect(entry).toHaveProperty('character');
        expect(entry).toHaveProperty('answers');

        expect(typeof entry.character).toBe('string');
        expect(entry.character.length).toBeGreaterThan(0);

        expect(Array.isArray(entry.answers)).toBe(true);
        expect(entry.answers.length).toBeGreaterThan(0);

        entry.answers.forEach((answer: any) => {
          expect(typeof answer).toBe('string');
          expect(answer.length).toBeGreaterThan(0);
          // Romanji should only contain lowercase letters
          expect(answer).toMatch(/^[a-z]+$/);
        });
      });
    });

    it('should contain basic hiragana characters', () => {
      const characters = hiraganaData.values.map(
        (entry: any) => entry.character,
      );

      // Check for some basic hiragana
      const basicHiragana = ['あ', 'い', 'う', 'え', 'お'];

      basicHiragana.forEach((char) => {
        expect(characters).toContain(char);
      });
    });

    it('should have valid romanji mappings', () => {
      const vowels = hiraganaData.values.filter((entry: any) =>
        ['あ', 'い', 'う', 'え', 'お'].includes(entry.character),
      );

      expect(vowels.length).toBe(5);

      const aChar = vowels.find((entry: any) => entry.character === 'あ');
      expect(aChar?.answers).toContain('a');

      const iChar = vowels.find((entry: any) => entry.character === 'い');
      expect(iChar?.answers).toContain('i');
    });
  });

  describe('katakana.json', () => {
    it('should have correct structure', () => {
      expect(katakanaData).toHaveProperty('locale');
      expect(katakanaData).toHaveProperty('set_name');
      expect(katakanaData).toHaveProperty('values');

      expect(katakanaData.locale).toBe('ja-JP');
      expect(katakanaData.set_name).toBe('katakana');
      expect(Array.isArray(katakanaData.values)).toBe(true);
    });

    it('should have valid character entries', () => {
      expect(katakanaData.values.length).toBeGreaterThan(0);

      katakanaData.values.forEach((entry: any) => {
        expect(entry).toHaveProperty('character');
        expect(entry).toHaveProperty('answers');

        expect(typeof entry.character).toBe('string');
        expect(entry.character.length).toBeGreaterThan(0);

        expect(Array.isArray(entry.answers)).toBe(true);
        expect(entry.answers.length).toBeGreaterThan(0);

        entry.answers.forEach((answer: any) => {
          expect(typeof answer).toBe('string');
          expect(answer.length).toBeGreaterThan(0);
          // Romanji should only contain lowercase letters
          expect(answer).toMatch(/^[a-z]+$/);
        });
      });
    });

    it('should contain basic katakana characters', () => {
      const characters = katakanaData.values.map(
        (entry: any) => entry.character,
      );

      // Check for some basic katakana
      const basicKatakana = ['ア', 'イ', 'ウ', 'エ', 'オ'];

      basicKatakana.forEach((char) => {
        expect(characters).toContain(char);
      });
    });

    it('should have valid romanji mappings', () => {
      const vowels = katakanaData.values.filter((entry: any) =>
        ['ア', 'イ', 'ウ', 'エ', 'オ'].includes(entry.character),
      );

      expect(vowels.length).toBe(5);

      const aChar = vowels.find((entry: any) => entry.character === 'ア');
      expect(aChar?.answers).toContain('a');

      const iChar = vowels.find((entry: any) => entry.character === 'イ');
      expect(iChar?.answers).toContain('i');
    });
  });

  describe('Data consistency', () => {
    it('should have unique characters within each set', () => {
      const hiraganaChars = hiraganaData.values.map(
        (entry: any) => entry.character,
      );
      const katakanaChars = katakanaData.values.map(
        (entry: any) => entry.character,
      );

      // Check for duplicates within hiragana
      const uniqueHiragana = new Set(hiraganaChars);
      expect(uniqueHiragana.size).toBe(hiraganaChars.length);

      // Check for duplicates within katakana
      const uniqueKatakana = new Set(katakanaChars);
      expect(uniqueKatakana.size).toBe(katakanaChars.length);
    });

    it('should have both single and multiple answer options', () => {
      const allEntries = [...hiraganaData.values, ...katakanaData.values];

      const singleAnswers = allEntries.filter(
        (entry: any) => entry.answers.length === 1,
      );
      const multipleAnswers = allEntries.filter(
        (entry: any) => entry.answers.length > 1,
      );

      expect(singleAnswers.length).toBeGreaterThan(0);
      expect(multipleAnswers.length).toBeGreaterThan(0);
    });

    it('should have reasonable data sizes', () => {
      // Should have a reasonable number of characters for a complete set
      expect(hiraganaData.values.length).toBeGreaterThan(40);
      expect(hiraganaData.values.length).toBeLessThan(200);

      expect(katakanaData.values.length).toBeGreaterThan(40);
      expect(katakanaData.values.length).toBeLessThan(200);
    });

    it('should not have empty answers arrays', () => {
      const allEntries = [...hiraganaData.values, ...katakanaData.values];

      allEntries.forEach((entry: any) => {
        expect(entry.answers.length).toBeGreaterThan(0);
      });
    });

    it('should not have duplicate answers within single character', () => {
      const allEntries = [...hiraganaData.values, ...katakanaData.values];

      allEntries.forEach((entry: any) => {
        const uniqueAnswers = new Set(entry.answers);
        expect(uniqueAnswers.size).toBe(entry.answers.length);
      });
    });
  });
});
