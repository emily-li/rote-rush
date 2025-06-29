import { BaseQuizMode } from '@/components/BaseQuizMode';
import { SPIRAL_CONFIG } from '@/config/spiral';
import { useSpiralQuiz, type SpiralCharacter } from '@/hooks/useSpiralQuiz';
import { GameMode, ScoreState } from '@/types';

type SpiralQuizModeProps = {
  readonly onGameModeChange: (mode: GameMode) => void;
};

const renderSpiralCharacter = (
  spiralChar: SpiralCharacter,
  isWrongAnswer: boolean,
  getCharacterStyle: (
    spiralChar: SpiralCharacter,
    position?: number,
  ) => React.CSSProperties,
  position: number,
) => {
  const isHead = position === 0;
  return (
    <div
      key={spiralChar.id}
      className={`absolute select-none font-kana
        ${isHead ? 'font-bold text-fuchsia-800 drop-shadow-lg' : 'font-normal text-gray-700'}
        ${isHead && isWrongAnswer ? 'animate-bounce' : ''} pointer-events-none
        transition-transform duration-100`}
      style={getCharacterStyle(spiralChar, position)}
      aria-hidden={isHead ? undefined : 'true'}
      role={isHead ? 'img' : undefined}
      aria-label={isHead ? spiralChar.char.char : undefined}
    >
      {spiralChar.char.char}
    </div>
  );
};

export const SpiralQuizMode = ({
  onGameModeChange,
}: SpiralQuizModeProps): JSX.Element => {
  const {
    characterState,
    scoreState: { score, streak, comboMultiplier, isWrongAnswer },
    actions,
    spiralCharacters,
    getCharacterStyle,
  } = useSpiralQuiz(SPIRAL_CONFIG);

  const scoreState: ScoreState = {
    score,
    streak,
    comboMultiplier,
    isWrongAnswer,
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-fuchsia-50">
      <BaseQuizMode
        currentGameMode={GameMode.SPIRAL}
        onGameModeChange={onGameModeChange}
        scoreState={scoreState}
        userInput={characterState.userInput}
        handleInputChange={actions.handleInputChange}
        currentChar={characterState.currentChar}
        mainContent={
          <div className="relative mb-8 h-[70vh] w-full">
            {spiralCharacters.map((spiralChar, idx) =>
              renderSpiralCharacter(
                spiralChar,
                scoreState.isWrongAnswer,
                getCharacterStyle,
                idx,
              ),
            )}
          </div>
        }
      />
    </div>
  );
};

export default SpiralQuizMode;
