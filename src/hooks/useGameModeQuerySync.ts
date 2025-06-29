import { useContext } from 'react';
import { GameModeContext } from '@/components/GameModeContext';

export const useGameModeQuerySync = () => {
  const ctx = useContext(GameModeContext);
  if (!ctx)
    throw new Error(
      'useGameModeQuerySync must be used within GameModeProvider',
    );
  return ctx;
};
