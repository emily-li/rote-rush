import React, { useEffect, useRef } from 'react';
import { QuizInput } from '@/components/QuizInput';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { SettingsButton } from '@/components/SettingsButton';
import useRainGame, { UseRainGameReturn } from '@/hooks/useRainGame';
import FallingBlockView from './FallingBlockView';
import RainyBackground from './RainyBackground';

const RainMode = () => {
  const {
    grid,
    fallingBlock,
    score,
    streak,
    comboMultiplier,
    isWrongAnswer,
    gameOver,
    gameRunning,
    startGame,
    pauseGame,
    resumeGame,
    validateAndHandleInput,
    userInput,
    isFlashingWrongAnswer,
    correctAnswer,
  }: UseRainGameReturn = useRainGame();

  const scoreState = {
    score,
    streak,
    comboMultiplier,
    isWrongAnswer,
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    startGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (gameRunning && !gameOver) {
      inputRef.current?.focus();
    }
  }, [gameRunning, gameOver]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndHandleInput(e.target.value);
  };

  const handleKeyboardPress = (letter: string) => {
    if (isWrongAnswer) return;
    const newInput = userInput + letter;
    validateAndHandleInput(newInput);
  };

  const timerControl = {
    pauseTimer: pauseGame,
    resumeTimer: resumeGame,
  };

  const quizCharacterProp:
    | { char: string; validAnswers: readonly string[] }
    | undefined = fallingBlock?.char;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-end font-sans">
      <RainyBackground />
      <SettingsButton timerControl={timerControl} />
      <ScoreDisplay {...scoreState} />
      <div className="flex-grow" /> {/* Spacer to push content down */}
      <div className="flex flex-col items-center justify-center">
        <div className="z-10 flex flex-col items-center">
          <div
            className={`relative mt-4 rounded-lg border-2 px-[60px]
              ${isFlashingWrongAnswer ? 'animate-pulse border-red-500' : 'border-blue-400'}`}
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(20, 60px)`,
              gridTemplateColumns: `repeat(10, 60px)`,
              boxShadow: '0 0 15px rgba(96, 165, 250, 0.5)',
            }}
          >
            {grid.map((row, y) =>
              row.map((cell, x) =>
                cell ? (
                  <div
                    key={`${y}-${x}`}
                    className="flex items-center justify-center text-5xl font-bold"
                    style={{
                      gridRowStart: y + 1,
                      gridColumnStart: x + 1,
                      color: '#93c5fd',
                      textShadow: '0 0 5px #60a5fa',
                    }}
                  >
                    {cell.char}
                  </div>
                ) : null,
              ),
            )}
            {fallingBlock && <FallingBlockView block={fallingBlock} />}
          </div>
          <QuizInput
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            isWrongAnswer={isWrongAnswer}
            disabled={gameOver}
            quizCharacter={quizCharacterProp}
            onKeyboardPress={handleKeyboardPress}
          />
          {isWrongAnswer && correctAnswer && (
            <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
              <p
                className="select-none text-[30rem] font-black leading-none opacity-40"
                style={{ color: '#93c5fd', textShadow: '0 0 5px #60a5fa' }}
              >
                {correctAnswer}
              </p>
            </div>
          )}
          {gameOver && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-black
                bg-opacity-75"
            >
              <h2
                className="text-4xl font-bold text-red-500"
                style={{ textShadow: '0 0 10px #ef4444' }}
              >
                Game Over
              </h2>
              <p className="mt-2 text-xl text-white">Final Score: {score}</p>
              <button
                onClick={startGame}
                className="mt-4 rounded border-b-4 border-blue-700 bg-blue-500 px-4 py-2 font-bold
                  text-white hover:border-blue-500 hover:bg-blue-400"
              >
                Play Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RainMode;
