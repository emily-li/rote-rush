import React from 'react';
import type { PracticeCharacter } from '@/types';
import { CorrectAnswerDisplay } from './ui/CorrectAnswerDisplay';
import { QuizInput } from './ui/QuizInput';
import { ScoreDisplay } from './ui/ScoreDisplay';
import { SettingsButton } from './ui/SettingsButton';
import { TimerBackground } from './ui/TimerBackground';

export interface BaseQuizModeProps {
  readonly currentGameMode: 'simple' | 'spiral';
  readonly onGameModeChange: (mode: 'simple' | 'spiral') => void;

  // Game state from useQuizGame hook
  readonly score: number;
  readonly streak: number;
  readonly comboMultiplier: number;
  readonly shouldAnimateCombo: boolean;
  readonly shouldAnimateStreak: boolean;
  readonly shouldAnimateComboReset: boolean;
  readonly timeRemainingPct: number;
  readonly userInput: string;
  readonly isWrongAnswer: boolean;
  readonly handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // Required props for displaying characters
  readonly currentChar: PracticeCharacter;

  // Optional customization props
  readonly showTimer?: boolean;
  readonly className?: string;
  readonly children?: React.ReactNode;
}

/**
 * Base component for quiz modes with shared layout and functionality
 */
export const BaseQuizMode: React.FC<BaseQuizModeProps> = ({
  currentGameMode,
  onGameModeChange,
  score,
  streak,
  comboMultiplier,
  shouldAnimateCombo,
  shouldAnimateStreak,
  shouldAnimateComboReset,
  timeRemainingPct,
  userInput,
  isWrongAnswer,
  handleInputChange,
  currentChar,
  showTimer = true,
  className = 'relative flex min-h-screen flex-col overflow-hidden bg-gray-50',
  children,
}) => {
  return (
    <div className={className}>
      {showTimer && <TimerBackground timeRemainingPct={timeRemainingPct} />}
      <SettingsButton
        currentGameMode={currentGameMode}
        onGameModeChange={onGameModeChange}
      />{' '}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
        <ScoreDisplay
          score={score}
          streak={streak}
          comboMultiplier={comboMultiplier}
          shouldAnimateCombo={shouldAnimateCombo}
          shouldAnimateStreak={shouldAnimateStreak}
          shouldAnimateComboReset={shouldAnimateComboReset}
        />

        {/* Main content area - can be overridden by children */}
        {children || (
          <>
            {/* Default Kana Character Display */}
            <div className="mb-8 select-none font-kana text-9xl font-light text-gray-700">
              {currentChar.char}
            </div>
          </>
        )}

        {/* Input Field */}
        <QuizInput
          value={userInput}
          onChange={handleInputChange}
          isWrongAnswer={isWrongAnswer}
        />

        {/* Error Answer Display */}
        <CorrectAnswerDisplay
          isWrongAnswer={isWrongAnswer}
          correctAnswer={currentChar.validAnswers[0]}
        />
      </div>
    </div>
  );
};
