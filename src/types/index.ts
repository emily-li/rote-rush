/**
 * Character data for practice mode with adaptive weighting
 */
export interface PracticeCharacter {
  /** The Japanese character (hiragana/katakana) */
  readonly char: string;
  /** Array of valid romanized readings for this character */
  readonly validAnswers: readonly string[];
  /**
   * Weight for selection probability (higher = more likely to appear)
   * @default 5
   */
  weight?: number;
}

export interface CharacterStats {
  readonly char: string;
  readonly attempts: number;
  readonly correct: number;
  readonly successRate: number;
}

/**
 * Configuration for quiz timing
 */
export interface TimerConfig {
  readonly DEFAULT_TIME_MS: number;
  readonly MIN_TIME_MS: number;
  readonly TIMER_STEP: number;
}

/**
 * Configuration for character weight adjustments
 */
export interface WeightConfig {
  readonly WEIGHT_DECREASE: number;
  readonly WEIGHT_INCREASE: number;
  readonly MIN_WEIGHT: number;
}

/**
 * Configuration for quiz timing and scoring
 * @deprecated Use TimerConfig instead
 */
export interface QuizConfig extends TimerConfig, WeightConfig {}

/**
 * Animation state for score display components
 */
export interface AnimationState {
  readonly shouldAnimateCombo: boolean;
  readonly shouldAnimateStreak: boolean;
  readonly shouldAnimateComboReset: boolean;
}

/**
 * Game modes available in the application
 */
export type GameMode = 'simple' | 'spiral';
