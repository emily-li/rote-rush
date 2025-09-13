import React, { useEffect, useRef } from 'react';
import { QuizInput } from '@/components/QuizInput';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { SettingsButton } from '@/components/SettingsButton';
import useKanaDropGame, {
  UseKanaDropGameReturn,
} from '@/hooks/useKanaDropGame';
import FallingBlockView from './FallingBlockView';
import RainyBackground from './RainyBackground';

const KanaDropMode = () => {
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
    validateAndHandleInput,
    userInput,
  }: UseKanaDropGameReturn = useKanaDropGame();

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

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center font-sans">
      <RainyBackground />
      <SettingsButton />
      <ScoreDisplay {...scoreState} />
      <div className="flex flex-grow flex-col items-center justify-center">
        <div className="z-10 flex flex-col items-center">
          <div
            className="relative mt-4 rounded-lg border-2 border-blue-400 bg-black bg-opacity-50"
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(20, 30px)`,
              gridTemplateColumns: `repeat(10, 30px)`,
              boxShadow: '0 0 15px rgba(96, 165, 250, 0.5)',
            }}
          >
            {grid.map((row, y) =>
              row.map((cell, x) =>
                cell ? (
                  <div
                    key={`${y}-${x}`}
                    className="flex items-center justify-center text-2xl font-bold"
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
          <div className="mt-4">
            <QuizInput
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              isWrongAnswer={isWrongAnswer}
              disabled={gameOver}
              quizCharacter={
                fallingBlock?.char as
                  | { char: string; validAnswers: readonly string[] }
                  | undefined
              }
            />
          </div>
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

export default KanaDropMode;
