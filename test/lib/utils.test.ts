import { describe, expect, it } from 'vitest';
import { cn } from '../../src/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should combine classes and resolve conflicts', () => {
      const result = cn('text-red-500', 'p-2', { 'bg-blue-500': true }, 'p-4');
      expect(result).toBe('text-red-500 bg-blue-500 p-4');
    });

    it('should handle empty inputs', () => {
      const result = cn('', undefined, null);
      expect(result).toBe('');
    });
  });
});
