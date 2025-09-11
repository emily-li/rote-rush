import React from 'react';
import { Direction } from '@/lib/snakeUtils';
import DirectionIndicator from './DirectionIndicator';

type DirectionPadProps = {
  helpers: {
    getCharForDirectionString: (dir: Direction) => string;
    isMatchingCharacter: (char: string) => boolean;
  };
  currentDirection: Direction;
};

export const DirectionPad: React.FC<DirectionPadProps> = ({
  helpers,
  currentDirection,
}) => {
  const directions = [
    { direction: 'UP' as const, colStart: 2, rowStart: 1 },
    { direction: 'LEFT' as const, colStart: 1, rowStart: 2 },
    { direction: 'RIGHT' as const, colStart: 3, rowStart: 2 },
    { direction: 'DOWN' as const, colStart: 2, rowStart: 3 },
  ];

  const colClasses = 'flex items-center justify-center';

  return (
    <div className="grid w-36 grid-cols-3 gap-3">
      {directions.map(({ direction, colStart, rowStart }) => (
        <div
          key={direction}
          className={`col-start-${colStart} row-start-${rowStart} ${colClasses}`}
        >
          <DirectionIndicator
            direction={direction}
            getCharForDirection={helpers.getCharForDirectionString}
            isMatchingCharacter={helpers.isMatchingCharacter}
            currentDirection={currentDirection}
          />
        </div>
      ))}
    </div>
  );
};

export default DirectionPad;
