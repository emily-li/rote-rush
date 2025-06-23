import { SPIRAL_CONFIG } from '@/config/spiral';
import { useSpiralQuiz } from '@/hooks/useSpiralQuiz';
import type { GameMode } from '@/types';
import { BaseQuizMode } from './BaseQuizMode';

/**
 * Spiral quiz mode with characters arranged in a spiral pattern
 * Features visual display of upcoming characters in a spiral formation
 */
interface SpiralQuizModeProps {
  readonly currentGameMode: GameMode;
  readonly onGameModeChange: (mode: GameMode) => void;
}

const SpiralQuizMode = ({
  currentGameMode,
  onGameModeChange,
}: SpiralQuizModeProps): JSX.Element => {
  // Use the specialized spiral quiz logic
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
    spiralCharacters,
    getCharacterStyle,
  } = useSpiralQuiz({ timerConfig: SPIRAL_CONFIG });

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
      showTimer={false}
      className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b
        from-purple-50 to-blue-50"
    >
      {/* Spiral Display */}
      <div className="relative mb-8 h-[70vh] w-full">
        {spiralCharacters.map((spiralChar) => (
          <div
            key={spiralChar.id}
            className={`select-none font-kana ${
            spiralChar.position === 0 && isWrongAnswer ? 'animate-pulse' : '' }`}
            style={getCharacterStyle(spiralChar)}
          >
            {spiralChar.char.char}
          </div>
        ))}
      </div>
    </BaseQuizMode>
  );
};

export default SpiralQuizMode;
