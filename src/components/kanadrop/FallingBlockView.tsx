import React from 'react';
import type { Block } from '@/hooks/useKanaDropGame';

type FallingBlockProps = {
  block: Block;
};

const FallingBlockView: React.FC<FallingBlockProps> = ({ block }) => {
  const style: React.CSSProperties = {
    gridRowStart: block.y + 1,
    gridColumnStart: block.x + 1,
    color: '#93c5fd', // light blue
    textShadow: '0 0 5px #60a5fa, 0 0 10px #60a5fa', // blue glow
  };

  return (
    <div style={style} className="text-2xl font-bold">
      {block.char.char}
    </div>
  );
};

export default FallingBlockView;
