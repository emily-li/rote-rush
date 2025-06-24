import React from 'react';
import { CorrectAnswerDisplay } from '@/components/CorrectAnswerDisplay';
import { QuizInput } from '@/components/QuizInput';
import { MetricChange, ScoreDisplay } from '@/components/ScoreDisplay';
import { SettingsButton } from '@/components/SettingsButton';
import { GameMode, PracticeCharacter, type ScoreState } from '@/types';

type BaseQuizModeProps = {
  readonly scoreState: ScoreState;
  readonly userInput: string;
  readonly handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly currentChar: PracticeCharacter;
  readonly className?: string;
  readonly backgroundContent?: React.ReactNode;
  readonly mainContent?: React.ReactNode;
  readonly currentGameMode: GameMode;
  readonly onGameModeChange: (mode: GameMode) => void;
};

/**
 * Base component for quiz modes with shared layout and functionality
 */
export const BaseQuizMode: React.FC<BaseQuizModeProps> = ({
  scoreState,
  userInput,
  handleInputChange,
  currentChar,
  className = 'relative flex min-h-screen flex-col overflow-hidden',
  backgroundContent,
  mainContent,
  currentGameMode,
  onGameModeChange,
}: BaseQuizModeProps) => {
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
          isWrongAnswer={scoreState.isWrongAnswer}
        />
        <CorrectAnswerDisplay
          isWrongAnswer={scoreState.isWrongAnswer}
          correctAnswer={currentChar.validAnswers[0]}
        />
      </div>
    </div>
  );
};
