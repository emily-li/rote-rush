import { useMemo } from 'react';
import { FocusTrap } from 'focus-trap-react';
import { X } from 'lucide-react';
import { useGameMode } from '@/components/GameModeContext';
import { loadPracticeCharacters } from '@/lib/characterLoading';
import {
  getCharacterStatsWithRates,
  resetCharacterStats,
} from '@/lib/characterStats';
import hiraganaData from '@/resources/hiragana.json';
import { GameMode, type CharacterStats } from '@/types';

type ReportViewProps = {
  readonly onClose: () => void;
};

export const ReportView = ({ onClose }: ReportViewProps) => {
  const { gameMode, setGameMode } = useGameMode();

  const { hiraganaStats, katakanaStats } = useMemo(() => {
    const characters = loadPracticeCharacters();
    const allStats = getCharacterStatsWithRates(characters);

    const hiraganaChars = new Set(
      hiraganaData.values.map((item: { character: string }) => item.character),
    );

    const seenChars = new Set<string>();
    const hiraganaStats = allStats
      .filter((stat) => hiraganaChars.has(stat.char))
      .filter((stat) => {
        if (!seenChars.has(stat.char)) {
          seenChars.add(stat.char);
          return true;
        }
        return false;
      });
    seenChars.clear();
    const katakanaStats = allStats
      .filter((stat) => !hiraganaChars.has(stat.char))
      .filter((stat) => {
        if (!seenChars.has(stat.char)) {
          seenChars.add(stat.char);
          return true;
        }
        return false;
      });

    return { hiraganaStats, katakanaStats };
  }, []);

  const getSuccessRateColor = (rate: number, attempts: number) => {
    if (attempts === 0) return 'bg-gray-50 text-gray-500';
    if (rate >= 90) return 'bg-green-100';
    if (rate >= 70) return 'bg-yellow-100';
    if (rate >= 50) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const handleReset = () => {
    if (confirm('Reset all character statistics?')) {
      resetCharacterStats();
      window.location.reload();
    }
  };

  const renderCharacterGrid = (stats: CharacterStats[], title: string) => (
    <div>
      <br />
      <h2 className="mb-2 font-bold">{title}</h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(3.5rem,1fr))]">
        {stats.map((stat) => (
          <div
            key={stat.char}
            className={`flex flex-col items-center justify-center border border-fuchsia-50 p-2
            ${getSuccessRateColor(stat.successRate, stat.attempts)}`}
          >
            <div className="font-kana">{stat.char}</div>
            <div className="text-xs font-bold">
              {stat.attempts > 0 ? `${Math.round(stat.successRate)}%` : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <FocusTrap>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-25 font-sans">
        <div className="mx-auto min-h-screen max-w-7xl">
          <div className="bg-fuchsia-50 p-4">
            <div className="flex items-center justify-between text-white">
              <h1 aria-label="Character statistics"></h1>
              {/* Buttons */}
              <div className="flex gap-2 p-3">
                <button
                  onClick={handleReset}
                  className="bg-fuchsia-800 px-3 py-1"
                >
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="bg-fuchsia-800 p-1"
                  aria-label="Close report"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Game Mode Selection */}
            <div className="bg-fuchsia-100 p-4">
              <h2 className="mb-3 text-lg font-bold">Game Mode</h2>
              <div className="flex gap-2">
                {(
                  [
                    { mode: GameMode.SIMPLE, label: 'Simple Mode' },
                    { mode: GameMode.SPIRAL, label: 'Spiral Mode' },
                  ] as const
                ).map(({ mode, label }) => {
                  const isActive = gameMode === mode;
                  const baseClass = 'border-2 px-4 py-2 transition-colors';
                  const activeClass = isActive
                    ? 'border-fuchsia-400 font-bold'
                    : 'border-fuchsia-200 hover:bg-fuchsia-200';
                  return (
                    <button
                      key={mode}
                      onClick={() => setGameMode(mode)}
                      className={`${baseClass} ${activeClass}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {renderCharacterGrid(hiraganaStats, 'Hiragana')}
            {renderCharacterGrid(katakanaStats, 'Katakana')}
          </div>
        </div>
      </div>
    </FocusTrap>
  );
};
