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
}

/**
 * Complete quiz game interface using composition for better structure
 */
export interface QuizGameInterface {
  gameState: QuizGameState;
  input: QuizInputState;
  timer: QuizTimerState;
  handlers: QuizGameHandlers;
}
