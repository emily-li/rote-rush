import { BaseQuizMode } from '@/components/BaseQuizMode';
import { SPIRAL_CONFIG } from '@/config/spiral';
import { useSpiralQuiz } from '@/hooks/useSpiralQuiz';
import { GameMode, ScoreState } from '@/types';

/**
 * Spiral quiz mode with characters arranged in a spiral pattern
 * Features visual display of upcoming characters in a spiral formation
 */
type SpiralQuizModeProps = {
  readonly currentGameMode: GameMode;
  readonly onGameModeChange: (mode: GameMode) => void;
};

const SpiralQuizMode = ({
  currentGameMode,
  onGameModeChange,
}: SpiralQuizModeProps): JSX.Element => {
  const {
    characterState,
    scoreState: { score, streak, comboMultiplier, isWrongAnswer },
    actions,
    spiralCharacters,
    getCharacterStyle,
  } = useSpiralQuiz({ timerConfig: SPIRAL_CONFIG });

  const scoreState: ScoreState = {
    score,
    streak,
    comboMultiplier,
    isWrongAnswer,
  };

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-b
        from-purple-50 to-blue-50"
    >
      <BaseQuizMode
        currentGameMode={currentGameMode}
        onGameModeChange={onGameModeChange}
        scoreState={scoreState}
        userInput={characterState.userInput}
        handleInputChange={actions.handleInputChange}
        currentChar={characterState.currentChar}
        mainContent={
          <div className="relative mb-8 h-[70vh] w-full">
            {spiralCharacters.map((spiralChar: any) => (
              <div
                key={spiralChar.id}
                className={`select-none font-kana ${
                spiralChar.position === 0 && scoreState.isWrongAnswer
                    ? 'animate-bounce'
                    : ''
                }`}
                style={getCharacterStyle(spiralChar)}
              >
                {spiralChar.char.char}
              </div>
            ))}
          </div>
        }
      />
    </div>
  );
};

export default SpiralQuizMode;
