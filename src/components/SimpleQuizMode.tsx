import { QUIZ_CONFIG } from '@/config/quiz';
import { useQuizGame } from '@/hooks/useQuizGame';
import { BaseQuizMode } from './BaseQuizMode';

/**
 * Main quiz component for practicing Japanese characters
 * Features adaptive difficulty, combo system, and timed challenges
 */
interface SimpleQuizModeProps {
  readonly currentGameMode: 'simple' | 'spiral';
  readonly onGameModeChange: (mode: 'simple' | 'spiral') => void;
}

const SimpleQuizMode = ({
  currentGameMode,
  onGameModeChange,
}: SimpleQuizModeProps): JSX.Element => {
  // Use the shared quiz game logic with Simple quiz configuration
  const {
    currentChar,
    userInput,
    score,
    streak,
    comboMultiplier,
    isWrongAnswer,
    timeRemainingPct,
    handleInputChange,
    shouldAnimateCombo,
    shouldAnimateStreak,
    shouldAnimateComboReset,
  } = useQuizGame({ timerConfig: QUIZ_CONFIG });

  return (
    <BaseQuizMode
      currentGameMode={currentGameMode}
      onGameModeChange={onGameModeChange}
      score={score}
      streak={streak}
      comboMultiplier={comboMultiplier}
      shouldAnimateCombo={shouldAnimateCombo}
      shouldAnimateStreak={shouldAnimateStreak}
      shouldAnimateComboReset={shouldAnimateComboReset}
      timeRemainingPct={timeRemainingPct}
      userInput={userInput}
      isWrongAnswer={isWrongAnswer}
      handleInputChange={handleInputChange}
      currentChar={currentChar}
      className="relative flex min-h-screen overflow-hidden"
    >
      {' '}
      <div className="relative mb-8 flex h-[70vh] w-full items-center justify-center">
        <div
          className="text-shadow relative z-10 font-kana"
          style={{
            fontSize: '20vw',
            fontWeight: 'bold',
          }}
        >
          {currentChar.char}
        </div>
      </div>
    </BaseQuizMode>
  );
};

export default SimpleQuizMode;
