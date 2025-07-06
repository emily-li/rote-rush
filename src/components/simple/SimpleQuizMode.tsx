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
    <div className="relative flex flex-col overflow-hidden">
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
            className="relative mb-8 flex w-full items-center justify-center"
            style={{
              height: '70vh',
            }}
          >
            <div
              className="relative z-10 font-kana text-shadow"
              style={{
                fontSize: '20vw',
                fontWeight: 'bold',
              }}
            >
              {characterState.currentChar.char}
            </div>
          </div>
        }
      />
    </div>
  );
};

export default SimpleQuizMode;
