import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GameMode } from '@/types';
import {
  getGameModeFromQuery,
  setGameModeQuery,
} from '@/lib/gameModeUtils';

export const GameModeContext = createContext<GameModeContextValue | undefined>(
  undefined,
);

type GameModeContextValue = {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
};

export const useGameMode = () => {
  const context = useContext(GameModeContext);
  if (!context) {
    throw new Error('useGameMode must be used within a GameModeProvider');
  }
  return context;
};

export const GameModeProvider = ({ children }: { children: ReactNode }) => {
  const [gameMode, setGameModeState] = useState<GameMode>(
    getGameModeFromQuery(),
  );

  useEffect(() => {
    setGameModeQuery(gameMode);
  }, [gameMode]);

  useEffect(() => {
    const onPopState = () => {
      setGameModeState(getGameModeFromQuery());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setGameMode = (mode: GameMode) => {
    setGameModeState(mode);
  };

  return (
    <GameModeContext.Provider value={{ gameMode, setGameMode }}>
      {children}
    </GameModeContext.Provider>
  );
};
