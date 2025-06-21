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

/**
 * Configuration for quiz timing and scoring
 */
export interface QuizConfig {
  readonly DEFAULT_TIME_MS: number;
  readonly MIN_TIME_MS: number;
  readonly TIMER_STEP: number;
  readonly WEIGHT_DECREASE: number;
  readonly WEIGHT_INCREASE: number;
  readonly MIN_WEIGHT: number;
}

/**
 * Animation state for score display components
 */
export interface AnimationState {
  readonly shouldAnimateCombo: boolean;
  readonly shouldAnimateStreak: boolean;
  readonly shouldAnimateComboReset: boolean;
}
