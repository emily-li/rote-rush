import { useMemo } from 'react';
import { X } from 'lucide-react';
import { loadPracticeCharacters } from '@/lib/characterLoading';
import {
  getCharacterStatsWithRates,
  resetCharacterStats,
} from '@/lib/characterStats';
import hiraganaData from '@/resources/hiragana.json';
import type { CharacterStats } from '@/types';

interface ReportViewProps {
  readonly onClose: () => void;
}

export const ReportView = ({ onClose }: ReportViewProps) => {
  const { hiraganaStats, katakanaStats } = useMemo(() => {
    const characters = loadPracticeCharacters();
    const allStats = getCharacterStatsWithRates(characters);

    const hiraganaChars = new Set(
      hiraganaData.values.map((item: any) => item.character),
    );

    const hiraganaStats = allStats.filter((stat) =>
      hiraganaChars.has(stat.char),
    );
    const katakanaStats = allStats.filter(
      (stat) => !hiraganaChars.has(stat.char),
    );

    return { hiraganaStats, katakanaStats };
  }, []);

  const getSuccessRateColor = (rate: number, attempts: number) => {
    if (attempts === 0) return 'bg-gray-100 text-gray-400';
    if (rate >= 90) return 'bg-green-100 text-green-800';
    if (rate >= 70) return 'bg-yellow-100 text-yellow-800';
    if (rate >= 50) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const handleReset = () => {
    if (confirm('Reset all character statistics?')) {
      resetCharacterStats();
      window.location.reload();
    }
  };

  const renderCharacterGrid = (stats: CharacterStats[], title: string) => (
    <div className="mb-6">
      <h2 className="mb-2 text-lg font-bold text-gray-800">{title}</h2>
      <div
        className="grid grid-cols-10 border-l border-t border-gray-300 sm:grid-cols-15
          md:grid-cols-20 lg:grid-cols-25 xl:grid-cols-30"
      >
        {' '}
        {stats.map((stat) => (
          <div
            key={stat.char}
            className={`flex aspect-square flex-col items-center justify-center border-b border-r
            border-gray-300 p-2 ${getSuccessRateColor(stat.successRate, stat.attempts)}`}
          >
            <div className="font-kana text-xl leading-none">{stat.char}</div>
            <div className="mt-1 text-sm font-bold leading-none">
              {stat.attempts > 0 ? `${Math.round(stat.successRate)}%` : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-gray-50">
      <div className="min-h-screen">
        <div className="mx-auto max-w-6xl">
          <div className="bg-white p-4 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h1 aria-label="Character statistics"></h1>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="bg-fuchsia-800 px-3 py-1 text-white"
                >
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="bg-fuchsia-800 p-1 text-white"
                  aria-label="Close report"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {renderCharacterGrid(hiraganaStats, 'Hiragana')}
            {renderCharacterGrid(katakanaStats, 'Katakana')}
          </div>
        </div>
      </div>
    </div>
  );
};
