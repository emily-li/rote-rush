import { BaseQuizMode } from '@/components/BaseQuizMode';
import { useSpiralQuiz, type SpiralCharacter } from '@/hooks/useSpiralQuiz';

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

export const SpiralQuizMode = (): JSX.Element => {
  const { gameState, spiralCharacters, getCharacterStyle } = useSpiralQuiz();
  const { characterState, scoreState, actions } = gameState;
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-fuchsia-50">
      <BaseQuizMode
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
