import { QUIZ_CONFIG } from '@/config/quiz';
import { useQuizGame } from '@/hooks/useQuizGame';
import type { GameMode } from '@/types';
import { BaseQuizMode } from './BaseQuizMode';

interface SimpleQuizModeProps {
  readonly currentGameMode: GameMode;
  readonly onGameModeChange: (mode: GameMode) => void;
}

const SimpleQuizMode = ({
  currentGameMode,
  onGameModeChange,
}: SimpleQuizModeProps): JSX.Element => {
  const { characterState, scoreState, timerState, animationState, actions } =
    useQuizGame({ timerConfig: QUIZ_CONFIG });

  return (
    <BaseQuizMode
      currentGameMode={currentGameMode}
      onGameModeChange={onGameModeChange}
      score={scoreState.score}
      streak={scoreState.streak}
      comboMultiplier={scoreState.comboMultiplier}
      shouldAnimateCombo={animationState.shouldAnimateCombo}
      shouldAnimateStreak={animationState.shouldAnimateStreak}
      shouldAnimateComboReset={animationState.shouldAnimateComboReset}
      timeRemainingPct={timerState.timeRemainingPct}
      userInput={characterState.userInput}
      isWrongAnswer={scoreState.isWrongAnswer}
      handleInputChange={actions.handleInputChange}
      currentChar={characterState.currentChar}
      className="relative flex min-h-screen overflow-hidden"
    >
      {' '}
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
    </BaseQuizMode>
  );
};

export default SimpleQuizMode;
