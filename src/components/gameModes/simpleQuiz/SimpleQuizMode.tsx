import { CharacterInput } from './CharacterInput';
import { ScoreDisplay } from './ScoreDisplay';
import { TimerBackground } from './TimerBackground';
import { useQuizGame } from './useQuizGame';

function SimpleQuizMode() {
  const quiz = useQuizGame();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gray-50">
      <TimerBackground
        totalTimeMs={quiz.timer.totalTimeMs}
        timeLeftMs={quiz.timer.timeLeftMs}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
        <ScoreDisplay
          score={quiz.gameState.score}
          combo={quiz.gameState.combo}
        />

        <CharacterInput
          currentChar={quiz.gameState.currentChar}
          userInput={quiz.gameState.userInput}
          isWrongAnswer={quiz.input.isWrongAnswer}
          timeLeftMs={quiz.timer.timeLeftMs}
          onInputChange={quiz.handlers.handleInputChange}
          onKeyDown={quiz.handlers.handleKeyPress}
        />
      </div>
    </div>
  );
}

export default SimpleQuizMode;
