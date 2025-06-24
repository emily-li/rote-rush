import { BaseQuizMode } from '@/components/BaseQuizMode';
import { SPIRAL_CONFIG } from '@/config/spiral';
import { useSpiralQuiz, type SpiralCharacter } from '@/hooks/useSpiralQuiz';
import { GameMode, ScoreState } from '@/types';

/**
 * Spiral quiz mode with characters arranged in a spiral pattern
 * Features visual display of upcoming characters in a spiral formation
 */
type SpiralQuizModeProps = {
  readonly currentGameMode: GameMode;
  readonly onGameModeChange: (mode: GameMode) => void;
};

const renderSpiralCharacter = (
  spiralChar: SpiralCharacter,
  isWrongAnswer: boolean,
  getCharacterStyle: (spiralChar: SpiralCharacter) => React.CSSProperties,
) => (
  <div
    key={spiralChar.id}
    className={`select-none font-kana ${
      spiralChar.position === 0 && isWrongAnswer ? 'animate-bounce' : '' }`}
    style={getCharacterStyle(spiralChar)}
    aria-hidden="true"
  >
    {spiralChar.char.char}
  </div>
);

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
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-fuchsia-50">
      <BaseQuizMode
        currentGameMode={currentGameMode}
        onGameModeChange={onGameModeChange}
        scoreState={scoreState}
        userInput={characterState.userInput}
        handleInputChange={actions.handleInputChange}
        currentChar={characterState.currentChar}
        mainContent={
          <div className="relative mb-8 h-[70vh] w-full">
            {spiralCharacters.map((spiralChar) =>
              renderSpiralCharacter(
                spiralChar,
                scoreState.isWrongAnswer,
                getCharacterStyle,
              ),
            )}
          </div>
        }
      />
    </div>
  );
};

export default SpiralQuizMode;
