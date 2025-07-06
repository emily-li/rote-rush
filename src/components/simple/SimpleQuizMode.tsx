import { BaseQuizMode } from '@/components/BaseQuizMode';
import { TimerBackground } from '@/components/simple/TimerBackground';
import { QUIZ_CONFIG } from '@/config/quiz';
import { useQuizGame } from '@/hooks/useQuizGame';

const SimpleQuizMode = (): JSX.Element => {
  const { characterState, scoreState, timerState, timerControl, actions } =
    useQuizGame({
      timerConfig: QUIZ_CONFIG,
    });

  return (
    <BaseQuizMode
      scoreState={scoreState}
      userInput={characterState.userInput}
      handleInputChange={actions.handleInputChange}
      currentChar={characterState.currentChar}
      timerControl={timerControl}
      backgroundContent={
        <TimerBackground
          currentTimeMs={timerState.currentTimeMs}
          isPaused={timerState.isPaused}
          resetKey={characterState.currentChar.char}
        />
      }
      mainContent={
        <div
          className="flex items-center font-kana font-bold text-shadow"
          style={{
            fontSize: '20vw',
            height: '70vh',
          }}
        >
          {characterState.currentChar.char}
        </div>
      }
    />
  );
};

export default SimpleQuizMode;
