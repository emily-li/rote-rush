import type { PracticeCharacter } from '@/lib/characterLoading';

/**
 * Game state properties that track the current quiz progress
 */
export interface QuizGameState {
  currentChar: PracticeCharacter;
  userInput: string;
  score: number;
  combo: number;
}

/**
 * Input validation and UI state properties
 */
export interface QuizInputState {
  isInputValid: boolean;
  isWrongAnswer: boolean;
}

/**
 * Timer-related state properties
 */
export interface QuizTimerState {
  totalTimeMs: number;
  timeLeftMs: number;
}

/**
 * Event handlers for quiz interactions
 */
export interface QuizGameHandlers {
  handleSubmit: (input: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

/**
 * Complete quiz game interface combining all state and handlers
 */
export interface QuizGameInterface
  extends QuizGameState,
    QuizInputState,
    QuizTimerState,
    QuizGameHandlers {}
