import { CorrectAnswerDisplay } from '@/components/CorrectAnswerDisplay';
import { QuizInput } from '@/components/QuizInput';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { SettingsButton } from '@/components/SettingsButton';
import { useSpiralQuiz } from '@/hooks/useSpiralQuiz';
import { useWindowSize } from '@/hooks/useWindowSize';
import { getCharacterStyle } from '@/lib/spiralMath';

export const SpiralQuizMode = (): JSX.Element => {
  const { gameState, spiralCharacters } = useSpiralQuiz();
  const { characterState, scoreState, actions, timerState, timerControl } =
    gameState;
  const { width, visibleHeight } = useWindowSize();

  const handleKeyboardPress = (letter: string) => {
    // Ignore keyboard input if wrong answer is displayed
    if (scoreState.isWrongAnswer) return;

    const newInput = characterState.userInput + letter;
    characterState.setUserInput(newInput);
    actions.validateAndHandleInput(newInput);
  };

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{ minHeight: '100%' }}
    >
      <div
        className="fixed bg-fuchsia-50"
        style={{ height: '100vh', width: '100vw' }}
        role="region"
      />
      <ScoreDisplay {...scoreState} />
      <SettingsButton timerControl={timerControl} />

      <div className="z-10 flex flex-1 flex-col items-center justify-center">
        <div
          className="relative w-full"
          style={{
            height: '70vh',
          }}
        >
          {spiralCharacters.map((spiralChar, i) => {
            const isHead = i === 0;
            const styleObj = getCharacterStyle(
              i,
              spiralCharacters.length,
              width,
              visibleHeight,
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

        <QuizInput
          value={characterState.userInput}
          onChange={actions.handleInputChange}
          isWrongAnswer={scoreState.isWrongAnswer}
          onKeyboardPress={handleKeyboardPress}
        />
        <CorrectAnswerDisplay
          isWrongAnswer={scoreState.isWrongAnswer}
          correctAnswer={characterState.currentChar.validAnswers[0]}
        />
      </div>
    </div>
  );
};

export default SpiralQuizMode;
