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
  readonly TIMER_STEP_MS: number;
  readonly WRONG_ANSWER_DISPLAY_MS: number;
};

/**
 * Configuration for character weight adjustments
 */
export type WeightConfig = {
  readonly WEIGHT_DECREASE: number;
  readonly WEIGHT_INCREASE: number;
  readonly MIN_WEIGHT: number;
};

export type CharacterState = {
  characters: PracticeCharacter[];
  currentChar: PracticeCharacter;
  userInput: string;
  setUserInput: (input: string) => void;
};

export type ScoreState = {
  score: number;
  streak: number;
  comboMultiplier: number;
  isWrongAnswer: boolean;
};

export type TimerState = {
  timeLeft: number;
  currentTimeMs: number;
  isPaused: boolean;
  timeRemainingPct: number;
};

export type QuizGameActions = {
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextCharacter: (resetToDefault?: boolean, resetTimeout?: boolean) => void;
  validateAndHandleInput: (value: string) => void;
  handleTimeout: () => void;
};

export type SimpleQuizModeState = {
  characterState: CharacterState;
  scoreState: ScoreState;
  timerState: TimerState;
  actions: QuizGameActions;
};

export enum GameMode {
  SIMPLE,
  SPIRAL,
}

export enum MetricChange {
  INCREASE,
  DECREASE,
  NONE,
}
