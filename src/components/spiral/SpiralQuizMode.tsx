import { BaseQuizMode } from '@/components/BaseQuizMode';
import { useSpiralQuiz } from '@/hooks/useSpiralQuiz';
import { useWindowSize } from '@/hooks/useWindowSize';
import { getCharacterStyle } from '@/lib/spiralMath';

export const SpiralQuizMode = (): JSX.Element => {
  const { gameState, spiralCharacters } = useSpiralQuiz();
  const { characterState, scoreState, actions, timerState, timerControl } =
    gameState;
  const { width, height } = useWindowSize();

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden bg-fuchsia-50"
      aria-label="Interactive Spiral Quiz Game"
      role="main"
    >
      <BaseQuizMode
        scoreState={scoreState}
        userInput={characterState.userInput}
        handleInputChange={actions.handleInputChange}
        currentChar={characterState.currentChar}
        timerControl={timerControl}
        mainContent={
          <div className="relative mb-8 h-[80vh] w-full">
            {spiralCharacters.map((spiralChar, i) => {
              const isHead = i === 0;
              const styleObj = getCharacterStyle(
                i,
                spiralCharacters.length,
                width,
                height,
                timerState,
              );
              const { charClass, ...style } = styleObj;
              return (
                <div
                  key={spiralChar.id}
                  className={`absolute font-kana ${charClass}`}
                  style={style}
                  aria-hidden={isHead ? undefined : 'true'}
                  aria-label={isHead ? spiralChar.char.char : undefined}
                >
                  {spiralChar.char.char}
                </div>
              );
            })}
          </div>
        }
      />
    </div>
  );
};

export default SpiralQuizMode;
