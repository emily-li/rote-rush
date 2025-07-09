import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GameMode } from '@/types';

export const GameModeContext = createContext<GameModeContextValue | undefined>(
  undefined,
);

type GameModeContextValue = {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
};

function getGameModeFromQuery(): GameMode {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  if (mode === 'spiral') return GameMode.SPIRAL;
  if (mode === 'snake') return GameMode.SNAKE;
  return GameMode.SIMPLE;
}

function setGameModeQuery(mode: GameMode) {
  const params = new URLSearchParams(window.location.search);
  params.set(
    'mode',
    mode === GameMode.SPIRAL
      ? 'spiral'
      : mode === GameMode.SNAKE
        ? 'snake'
        : 'simple',
  );
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

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
