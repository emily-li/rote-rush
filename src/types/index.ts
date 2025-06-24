/**
 * Character data for practice mode with adaptive weighting
 */
export type PracticeCharacter = {
  /** The Japanese character (hiragana/katakana) */
  readonly char: string;
  /** Array of valid romanized readings for this character */
  readonly validAnswers: readonly string[];
  /**
   * Weight for selection probability (higher = more likely to appear)
   * @default 5
   */
  weight?: number;
};

export type CharacterStats = {
  readonly char: string;
  readonly attempts: number;
  readonly correct: number;
  readonly successRate: number;
};

/**
 * Configuration for quiz timing
 */
export type TimerConfig = {
  readonly DEFAULT_TIME_MS: number;
  readonly MIN_TIME_MS: number;
  readonly TIMER_STEP: number;
};

/**
 * Configuration for character weight adjustments
 */
export type WeightConfig = {
  readonly WEIGHT_DECREASE: number;
  readonly WEIGHT_INCREASE: number;
  readonly MIN_WEIGHT: number;
};

/**
 * Configuration for quiz timing and scoring
 * @deprecated Use TimerConfig instead
 */
export type QuizConfig = TimerConfig & WeightConfig;

/**
 * Animation state for score display components
 */
export type AnimationState = {
  readonly shouldAnimateCombo: boolean;
  readonly shouldAnimateStreak: boolean;
  readonly shouldAnimateComboReset: boolean;
};

/**
 * Game modes available in the application
 */
export type GameMode = 'simple' | 'spiral';

/**
 * Shared properties for score-related components
 */
export type ScoreProps = {
  /** The current score */
  readonly score: number;
  /** The current streak of correct answers */
  readonly streak: number;
  /** The current combo multiplier */
  readonly comboMultiplier: number;
};
