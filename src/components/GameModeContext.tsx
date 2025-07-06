import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { GameMode } from '@/types';

function getGameModeFromQuery(): GameMode {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  if (mode === 'spiral') return GameMode.SPIRAL;
  return GameMode.SIMPLE;
}

function setGameModeQuery(mode: GameMode) {
  const params = new URLSearchParams(window.location.search);
  params.set('mode', mode === GameMode.SPIRAL ? 'spiral' : 'simple');
  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, '', newUrl);
}

export const GameModeContext = createContext<GameModeContextValue | undefined>(
  undefined,
);

export type GameModeContextValue = {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
};

export const useGameMode = () => {
  const context = useContext(GameModeContext);
  if (context === undefined) {
    throw new Error('useGameMode must be used within a GameModeProvider');
  }
  return context;
};

export const GameModeProvider = ({ children }: { children: ReactNode }) => {
  const [gameMode, updateGameModeState] = useState<GameMode>(() => {
    const mode = getGameModeFromQuery();
    return mode;
  });

  useEffect(() => {
    setGameModeQuery(gameMode);
  }, [gameMode]);

  useEffect(() => {
    const onPopState = () => {
      const mode = getGameModeFromQuery();
      updateGameModeState(mode);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const setGameMode = (mode: GameMode) => {
    updateGameModeState(mode);
  };

  return (
    <GameModeContext.Provider value={{ gameMode, setGameMode }}>
      {children}
    </GameModeContext.Provider>
  );
};
