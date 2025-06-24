import React from 'react';
import { PracticeCharacter } from '@/types';
import { CorrectAnswerDisplay } from './CorrectAnswerDisplay';
import { QuizInput } from './QuizInput';
import { MetricChange, ScoreDisplay } from './ScoreDisplay';
import { SettingsButton } from './SettingsButton';

export interface ScoreProps {
  readonly score: number;
  readonly streak: number;
  readonly comboMultiplier: number;
}

export interface BaseQuizModeProps {
  readonly currentGameMode: 'simple' | 'spiral';
  readonly onGameModeChange: (mode: 'simple' | 'spiral') => void;
  readonly scoreProps: ScoreProps;
  readonly userInput: string;
  readonly isWrongAnswer: boolean;
  readonly handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly currentChar: PracticeCharacter;
  readonly className?: string;
  readonly backgroundContent?: React.ReactNode; // New: for backgrounds like TimerBackground
  readonly mainContent?: React.ReactNode; // New: for main quiz visuals
}

/**
 * Base component for quiz modes with shared layout and functionality
 */
export const BaseQuizMode: React.FC<BaseQuizModeProps> = ({
  currentGameMode,
  onGameModeChange,
  scoreProps,
  userInput,
  isWrongAnswer,
  handleInputChange,
  currentChar,
  className = 'relative flex min-h-screen flex-col overflow-hidden',
  backgroundContent,
  mainContent,
}) => {
  return (
    <div className={className}>
      {backgroundContent && <div>{backgroundContent}</div>}
      <SettingsButton
        currentGameMode={currentGameMode}
        onGameModeChange={onGameModeChange}
      />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
        <ScoreDisplay
          scoreProps={scoreProps}
          scoreAnimationProps={{
            streakChange: MetricChange.NONE,
            comboMultiplierChange: MetricChange.NONE,
          }}
        />
        {mainContent}
        <QuizInput
          value={userInput}
          onChange={handleInputChange}
          isWrongAnswer={isWrongAnswer}
        />
        <CorrectAnswerDisplay
          isWrongAnswer={isWrongAnswer}
          correctAnswer={currentChar.validAnswers[0]}
        />
      </div>
    </div>
  );
};
