import { describe, expect, it } from 'vitest';
import {
  checkAnswerMatch,
  checkValidStart,
  normalizeInput,
} from '../../../../src/components/gameModes/simpleQuiz/inputValidation';

describe('inputValidation', () => {
  describe('normalizeInput', () => {
    it('should convert input to lowercase', () => {
      expect(normalizeInput('ABC')).toBe('abc');
      expect(normalizeInput('MiXeD')).toBe('mixed');
    });

    it('should trim whitespace', () => {
      expect(normalizeInput('  hello  ')).toBe('hello');
      expect(normalizeInput('\t\nworld\t\n')).toBe('world');
    });

    it('should handle empty string', () => {
      expect(normalizeInput('')).toBe('');
      expect(normalizeInput('   ')).toBe('');
    });
  });

  describe('checkAnswerMatch', () => {
    const validAnswers = ['hello', 'WORLD'];

    it('should return true for exact matches', () => {
      expect(checkAnswerMatch('hEllo', validAnswers)).toBe(true);
      expect(checkAnswerMatch('world', validAnswers)).toBe(true);
    });

    it('should return false for non-matches', () => {
      expect(checkAnswerMatch('goodbye', validAnswers)).toBe(false);
    });
  });

  describe('checkValidStart', () => {
    const validAnswers = ['hello', 'world', 'test'];

    it('should return true for valid prefixes', () => {
      expect(checkValidStart('h', validAnswers)).toBe(true);
      expect(checkValidStart('he', validAnswers)).toBe(true);
      expect(checkValidStart('hel', validAnswers)).toBe(true);
      expect(checkValidStart('hell', validAnswers)).toBe(true);
      expect(checkValidStart('hello', validAnswers)).toBe(true);
    });

    it('should return true for valid prefixes of other answers', () => {
      expect(checkValidStart('w', validAnswers)).toBe(true);
      expect(checkValidStart('t', validAnswers)).toBe(true);
    });

    it('should return false for invalid prefixes', () => {
      expect(checkValidStart('x', validAnswers)).toBe(false);
      expect(checkValidStart('he1', validAnswers)).toBe(false);
    });

    it('should handle case insensitive matching', () => {
      expect(checkValidStart('H', validAnswers)).toBe(true);
    });

    it('should handle whitespace', () => {
      expect(checkValidStart('  h  ', validAnswers)).toBe(true);
    });

    it('should return false for empty input', () => {
      expect(checkValidStart('', validAnswers)).toBe(false);
      expect(checkValidStart('   ', validAnswers)).toBe(false);
    });

    it('should handle empty valid answers array', () => {
      expect(checkValidStart('h', [])).toBe(false);
    });

    it('should handle multiple valid answers with common prefixes', () => {
      const answers = ['shi', 'si'];
      expect(checkValidStart('s', answers)).toBe(true);
      expect(checkValidStart('sh', answers)).toBe(true);
      expect(checkValidStart('shi', answers)).toBe(true);
      expect(checkValidStart('si', answers)).toBe(true);
      expect(checkValidStart('sho', answers)).toBe(false);
    });
  });
});
