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
    { direction: 'UP' as const, classes: 'col-start-2 row-start-1' },
    { direction: 'LEFT' as const, classes: 'col-start-1 row-start-2' },
    { direction: 'RIGHT' as const, classes: 'col-start-3 row-start-2' },
    { direction: 'DOWN' as const, classes: 'col-start-2 row-start-3' },
  ];

  const colClasses = 'flex items-center justify-center';

  return (
    <div className="grid w-36 grid-cols-3 gap-3">
      {directions.map(({ direction, classes }) => (
        <div key={direction} className={`${classes} ${colClasses}`}>
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
