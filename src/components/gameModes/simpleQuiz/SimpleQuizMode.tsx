import { CharacterInput } from './CharacterInput';
import { ScoreDisplay } from './ScoreDisplay';
import { TimerBackground } from './TimerBackground';
import { useQuizGame } from './useQuizGame';

function SimpleQuizMode() {
  const quizState = useQuizGame();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gray-50">
      <TimerBackground
        timeLeft={quizState.timeLeft}
        timerPercentage={quizState.timerPercentage}
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8">
        <ScoreDisplay score={quizState.score} combo={quizState.combo} />

        <CharacterInput
          currentChar={quizState.currentChar}
          userInput={quizState.userInput}
          isInputValid={quizState.isInputValid}
          isInputDisabled={quizState.isInputDisabled}
          timeLeft={quizState.timeLeft}
          feedback={quizState.feedback}
          onInputChange={quizState.handleInputChange}
          onKeyPress={quizState.handleKeyPress}
        />
      </div>
    </div>
  );
}

export default SimpleQuizMode;
