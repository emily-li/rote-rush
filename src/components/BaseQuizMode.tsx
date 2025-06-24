import React from 'react';
import { PracticeCharacter, type ScoreState } from '@/types';
import { CorrectAnswerDisplay } from './CorrectAnswerDisplay';
import { QuizInput } from './QuizInput';
import { MetricChange, ScoreDisplay } from './ScoreDisplay';
import { SettingsButton } from './SettingsButton';

type BaseQuizModeProps = {
  readonly scoreState: ScoreState;
  readonly userInput: string;
  readonly isWrongAnswer: boolean;
  readonly handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly currentChar: PracticeCharacter;
  readonly className?: string;
  readonly backgroundContent?: React.ReactNode;
  readonly mainContent?: React.ReactNode;
  readonly currentGameMode: 'simple' | 'spiral';
  readonly onGameModeChange: (mode: 'simple' | 'spiral') => void;
};

/**
 * Base component for quiz modes with shared layout and functionality
 */
export const BaseQuizMode: React.FC<BaseQuizModeProps> = ({
  scoreState,
  userInput,
  isWrongAnswer,
  handleInputChange,
  currentChar,
  className = 'relative flex min-h-screen flex-col overflow-hidden',
  backgroundContent,
  mainContent,
  currentGameMode,
  onGameModeChange,
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
          scoreState={scoreState}
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

export {};
