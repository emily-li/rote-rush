import type { CharacterStats, PracticeCharacter } from '@/types';

const STATS_KEY = 'characterStats' as const;

export type CharacterStatsData = {
  [char: string]: {
    attempts: number;
    correct: number;
  };
};

/**
 * Load character statistics from localStorage
 */
export const loadCharacterStats = (): CharacterStatsData => {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (error) {
    console.warn('Failed to load character stats:', error);
    return {};
  }
};

/**
 * Save character statistics to localStorage
 */
export const saveCharacterStats = (stats: CharacterStatsData): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save character stats:', error);
  }
};

/**
 * Record a character attempt (correct or incorrect)
 */
export const recordCharacterAttempt = (
  char: string,
  isCorrect: boolean,
): void => {
  const stats = loadCharacterStats();

  if (!stats[char]) {
    stats[char] = { attempts: 0, correct: 0 };
  }

  stats[char].attempts += 1;
  if (isCorrect) {
    stats[char].correct += 1;
  }

  saveCharacterStats(stats);
};

/**
 * Get character statistics with success rates
 */
export const getCharacterStatsWithRates = (
  characters: readonly PracticeCharacter[],
): CharacterStats[] => {
  const statsData = loadCharacterStats();

  return characters.map((character) => {
    const data = statsData[character.char] || { attempts: 0, correct: 0 };
    const successRate =
      data.attempts > 0 ? (data.correct / data.attempts) * 100 : 0;

    return {
      char: character.char,
      attempts: data.attempts,
      correct: data.correct,
      successRate: Math.round(successRate * 10) / 10, // Round to 1 decimal place
    };
  });
};

/**
 * Reset all character statistics
 */
export const resetCharacterStats = (): void => {
  try {
    localStorage.removeItem(STATS_KEY);
  } catch (error) {
    console.warn('Failed to reset character stats:', error);
  }
};
