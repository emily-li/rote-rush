import { QUIZ_CONFIG } from '@/config/quiz';
import { useQuizGame } from '@/hooks/useQuizGame';
import type { GameMode } from '@/types';
import { BaseQuizMode, ScoreProps } from '../BaseQuizMode';
import { TimerBackground } from './TimerBackground';

interface SimpleQuizModeProps {
  readonly currentGameMode: GameMode;
  readonly onGameModeChange: (mode: GameMode) => void;
}

const SimpleQuizMode = ({
  currentGameMode,
  onGameModeChange,
}: SimpleQuizModeProps): JSX.Element => {
  const { characterState, scoreState, timerState, actions } = useQuizGame({
    timerConfig: QUIZ_CONFIG,
  });

  const scoreProps: ScoreProps = {
    score: scoreState.score,
    streak: scoreState.streak,
    comboMultiplier: scoreState.comboMultiplier,
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <BaseQuizMode
        currentGameMode={currentGameMode}
        onGameModeChange={onGameModeChange}
        scoreProps={scoreProps}
        userInput={characterState.userInput}
        isWrongAnswer={scoreState.isWrongAnswer}
        handleInputChange={actions.handleInputChange}
        currentChar={characterState.currentChar}
        backgroundContent={
          <TimerBackground timeRemainingPct={timerState.timeRemainingPct} />
        }
        mainContent={
          <div className="relative mb-8 flex h-[70vh] w-full items-center justify-center">
            <div
              className="relative z-10 font-kana text-shadow"
              style={{
                fontSize: '20vw',
                fontWeight: 'bold',
              }}
            >
              {characterState.currentChar.char}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SimpleQuizMode;
