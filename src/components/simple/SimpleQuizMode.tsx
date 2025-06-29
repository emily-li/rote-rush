import { BaseQuizMode } from '@/components/BaseQuizMode';
import { TimerBackground } from '@/components/simple/TimerBackground';
import { QUIZ_CONFIG } from '@/config/quiz';
import { useQuizGame } from '@/hooks/useQuizGame';

const SimpleQuizMode = (): JSX.Element => {
  const { characterState, scoreState, timerState, actions } = useQuizGame({
    timerConfig: QUIZ_CONFIG,
  });

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <BaseQuizMode
        scoreState={scoreState}
        userInput={characterState.userInput}
        handleInputChange={actions.handleInputChange}
        currentChar={characterState.currentChar}
        backgroundContent={
          <TimerBackground timeRemainingPct={timerState.timeRemainingPct} />
        }
        mainContent={
          <div className="relative mb-8 flex h-[70vh] w-full items-center justify-center">
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
