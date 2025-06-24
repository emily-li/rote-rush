import { describe, expect, it } from 'vitest';
import { loadPracticeCharacters } from '../../src/lib/characterLoading';
import {
  checkAnswerMatch,
  checkValidStart,
  normalizeInput,
} from '../../src/lib/validation';

describe('Input Validation Utilities', () => {
  describe('normalizeInput', () => {
    it('should convert input to lowercase', () => {
      expect(normalizeInput('ABC')).toBe('abc');
      expect(normalizeInput('MiXeD')).toBe('mixed');
      expect(normalizeInput('123AbC')).toBe('123abc');
    });

    it('should trim whitespace from both ends', () => {
      expect(normalizeInput('  hello  ')).toBe('hello');
      expect(normalizeInput('\t\nworld\t\n')).toBe('world');
      expect(normalizeInput(' \t test \n ')).toBe('test');
    });

    it('should handle empty string and whitespace-only input', () => {
      expect(normalizeInput('')).toBe('');
      expect(normalizeInput('   ')).toBe('');
      expect(normalizeInput('\t\n')).toBe('');
    });

    it('should preserve non-alphabetic characters', () => {
      expect(normalizeInput('test-123')).toBe('test-123');
      expect(normalizeInput('こんにちは')).toBe('こんにちは');
      expect(normalizeInput('123!@#')).toBe('123!@#');
    });
  });

  describe('checkAnswerMatch', () => {
    const validAnswers = ['hello', 'WORLD', 'test-123'];

    it('should return true for exact matches regardless of case', () => {
      expect(checkAnswerMatch('hEllo', validAnswers)).toBe(true);
      expect(checkAnswerMatch('world', validAnswers)).toBe(true);
      expect(checkAnswerMatch('TEST-123', validAnswers)).toBe(true);
    });

    it('should return false for non-matches', () => {
      expect(checkAnswerMatch('goodbye', validAnswers)).toBe(false);
      expect(checkAnswerMatch('hell', validAnswers)).toBe(false);
      expect(checkAnswerMatch('worlds', validAnswers)).toBe(false);
    });

    it('should handle whitespace properly', () => {
      expect(checkAnswerMatch('  hello  ', validAnswers)).toBe(true);
      expect(checkAnswerMatch('\tworld\n', validAnswers)).toBe(true);
    });

    it('should handle empty inputs', () => {
      expect(checkAnswerMatch('', validAnswers)).toBe(false);
      expect(checkAnswerMatch('   ', validAnswers)).toBe(false);
    });

    it('should handle empty valid answers array', () => {
      expect(checkAnswerMatch('hello', [])).toBe(false);
    });

    it('should handle special Japanese characters', () => {
      const japaneseAnswers = ['か', 'さ', 'た'];
      expect(checkAnswerMatch('か', japaneseAnswers)).toBe(true);
      expect(checkAnswerMatch('が', japaneseAnswers)).toBe(false);
    });
  });

  describe('checkValidStart', () => {
    const validAnswers = ['hello', 'world', 'test'];

    it('should return true for valid prefixes of any length', () => {
      expect(checkValidStart('h', validAnswers)).toBe(true);
      expect(checkValidStart('he', validAnswers)).toBe(true);
      expect(checkValidStart('hel', validAnswers)).toBe(true);
      expect(checkValidStart('hell', validAnswers)).toBe(true);
      expect(checkValidStart('hello', validAnswers)).toBe(true);
    });

    it('should return true for valid prefixes of other answers', () => {
      expect(checkValidStart('w', validAnswers)).toBe(true);
      expect(checkValidStart('wo', validAnswers)).toBe(true);
      expect(checkValidStart('t', validAnswers)).toBe(true);
      expect(checkValidStart('te', validAnswers)).toBe(true);
    });

    it('should return false for invalid prefixes', () => {
      expect(checkValidStart('x', validAnswers)).toBe(false);
      expect(checkValidStart('he1', validAnswers)).toBe(false);
      expect(checkValidStart('worldly', validAnswers)).toBe(false);
    });

    it('should handle case insensitive matching', () => {
      expect(checkValidStart('H', validAnswers)).toBe(true);
      expect(checkValidStart('WORLD', validAnswers)).toBe(true);
      expect(checkValidStart('TeSt', validAnswers)).toBe(true);
    });

    it('should handle whitespace in input', () => {
      expect(checkValidStart('  h  ', validAnswers)).toBe(true);
      expect(checkValidStart(' wo ', validAnswers)).toBe(true);
    });

    it('should return false for empty or whitespace-only input', () => {
      expect(checkValidStart('', validAnswers)).toBe(false);
      expect(checkValidStart('   ', validAnswers)).toBe(false);
      expect(checkValidStart('\t\n', validAnswers)).toBe(false);
    });

    it('should handle empty valid answers array', () => {
      expect(checkValidStart('h', [])).toBe(false);
      expect(checkValidStart('hello', [])).toBe(false);
    });

    it('should handle multiple valid answers with common prefixes', () => {
      const answers = ['shi', 'si'];
      expect(checkValidStart('s', answers)).toBe(true);
      expect(checkValidStart('sh', answers)).toBe(true);
      expect(checkValidStart('shi', answers)).toBe(true);
      expect(checkValidStart('si', answers)).toBe(true);
      expect(checkValidStart('sho', answers)).toBe(false);
    });

    it('should handle Japanese character input', () => {
      const japaneseAnswers = ['かな', 'かた'];
      expect(checkValidStart('か', japaneseAnswers)).toBe(true);
      expect(checkValidStart('かな', japaneseAnswers)).toBe(true);
      expect(checkValidStart('き', japaneseAnswers)).toBe(false);
    });
  });
});
