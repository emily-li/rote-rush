import { CorrectAnswerDisplay } from '@/components/CorrectAnswerDisplay';
import { QuizInput } from '@/components/QuizInput';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { SettingsButton } from '@/components/SettingsButton';
import { TimerBackground } from '@/components/simple/TimerBackground';
import { QUIZ_CONFIG } from '@/config/quiz';
import { useQuizGame } from '@/hooks/useQuizGame';

const SimpleQuizMode = (): JSX.Element => {
  const { characterState, scoreState, timerState, timerControl, actions } =
    useQuizGame({
      timerConfig: QUIZ_CONFIG,
    });

  return (
    <div
      className="relative flex h-full flex-col overflow-hidden"
      style={{ minHeight: '100%' }}
    >
      <TimerBackground
        currentTimeMs={timerState.currentTimeMs}
        isPaused={timerState.isPaused}
        resetKey={characterState.currentChar.char}
        comboMultiplier={scoreState.comboMultiplier}
      />
      <ScoreDisplay {...scoreState} />
      <SettingsButton timerControl={timerControl} />

      <div className="z-10 flex flex-1 flex-col items-center justify-center">
        <div
          className="flex items-center font-kana font-bold text-shadow"
          style={{
            fontSize: '20vw',
            height: '70vh',
          }}
        >
          {characterState.currentChar.char}
        </div>

        <QuizInput
          value={characterState.userInput}
          onChange={actions.handleInputChange}
          isWrongAnswer={scoreState.isWrongAnswer}
        />
        <CorrectAnswerDisplay
          isWrongAnswer={scoreState.isWrongAnswer}
          correctAnswer={characterState.currentChar.validAnswers[0]}
        />
      </div>
    </div>
  );
};

export default SimpleQuizMode;
