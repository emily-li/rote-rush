import { useCallback } from 'react';
import type { QuizGameInterface } from './types';
import { useQuizFlowControl } from './useQuizFlowControl';
import { useQuizGameState } from './useQuizGameState';
import { useQuizInput } from './useQuizInput';
import { useQuizTimer } from './useQuizTimer';

/**
 * Main orchestrator hook that combines all quiz functionality
 */
export function useQuizGameOrchestrator(): QuizGameInterface {
  // Core game state
  const gameState = useQuizGameState();

  // Timer setup with timeout handler
  const handleTimeout = useCallback(() => {
    gameState.actions.resetCombo();
    flowControl.actions.showTimeoutAndProceed();
  }, []);

  const timer = useQuizTimer({ onTimeout: handleTimeout });

  // Flow control setup
  const flowControl = useQuizFlowControl({
    onNextQuestion: () => {
      gameState.actions.nextCharacter();
      input.actions.clearInput();
    },
    onResetTimer: timer.actions.resetTimer,
  });

  // Input handling setup
  const input = useQuizInput({
    currentChar: gameState.currentChar,
    onCorrectAnswer: () => {
      gameState.actions.incrementScore();
      flowControl.actions.proceedToNext();
    },
    onIncorrectAnswer: () => {
      gameState.actions.resetCombo();
      flowControl.actions.showIncorrectAndProceed();
    },
  });

  return {
    gameState: {
      currentChar: gameState.currentChar,
      userInput: input.userInput,
      score: gameState.score,
      combo: gameState.combo,
    },
    input: {
      isWrongAnswer: input.isWrongAnswer,
    },
    timer: {
      totalTimeMs: timer.totalTimeMs,
      timeLeftMs: timer.timeLeftMs,
    },
    handlers: {
      handleSubmit: () => {}, // Not needed with new input handling
      handleInputChange: input.handlers.handleInputChange,
    },
  };
}
