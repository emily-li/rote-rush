import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import * as quizConfig from '../../src/config/quiz';
import { getComboMultiplier } from '../../src/lib/quizUtils';

describe('quizUtils', () => {
  describe('getComboMultiplier', () => {
    beforeEach(() => {
      vi.spyOn(quizConfig, 'COMBO_MULTIPLIER_CONFIG', 'get').mockReturnValue({
        LEVEL_1: { STREAK: 5, MULTIPLIER: 1.5 },
        LEVEL_2: { STREAK: 25, MULTIPLIER: 2.0 },
        LEVEL_3: { STREAK: 50, MULTIPLIER: 3.0 },
      });
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('returns 1.0 for streak less than first level', () => {
      expect(getComboMultiplier(0)).toBe(1.0);
      expect(getComboMultiplier(4)).toBe(1.0);
    });

    it('returns first level multiplier for streak at or above first level', () => {
      expect(getComboMultiplier(5)).toBe(1.5);
      expect(getComboMultiplier(24)).toBe(1.5);
    });

    it('returns second level multiplier for streak at or above second level', () => {
      expect(getComboMultiplier(25)).toBe(2.0);
      expect(getComboMultiplier(49)).toBe(2.0);
    });

    it('returns third level multiplier for streak at or above third level', () => {
      expect(getComboMultiplier(50)).toBe(3.0);
      expect(getComboMultiplier(100)).toBe(3.0);
    });
  });
});
