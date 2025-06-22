import { useMemo } from 'react';
import { X } from 'lucide-react';
import { getCharacterStatsWithRates, resetCharacterStats } from '@/lib/characterStats';
import { loadPracticeCharacters } from '@/lib/characterLoading';
import type { CharacterStats } from '@/types';
import hiraganaData from '@/resources/hiragana.json';

interface ReportViewProps {
  readonly onClose: () => void;
}

export const ReportView = ({ onClose }: ReportViewProps) => {
  const { hiraganaStats, katakanaStats } = useMemo(() => {
    const characters = loadPracticeCharacters();
    const allStats = getCharacterStatsWithRates(characters);
    
    const hiraganaChars = new Set(hiraganaData.values.map((item: any) => item.character));
    
    const hiraganaStats = allStats.filter(stat => hiraganaChars.has(stat.char));
    const katakanaStats = allStats.filter(stat => !hiraganaChars.has(stat.char));
    
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
      <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
      <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 lg:grid-cols-25 xl:grid-cols-30 border-l border-t border-gray-300">        {stats.map((stat) => (          <div
            key={stat.char}
            className={`aspect-square border-r border-b border-gray-300 flex flex-col items-center justify-center p-2 ${getSuccessRateColor(stat.successRate, stat.attempts)}`}
          ><div className="font-kana text-xl leading-none">{stat.char}</div>
            <div className="text-sm font-bold leading-none mt-1">
              {stat.attempts > 0 ? `${Math.round(stat.successRate)}%` : '—'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 overflow-auto">
      <div className="min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white shadow-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">                
                <button
                  onClick={handleReset}
                  className="bg-fuchsia-800 text-white px-3 py-1 transition-colors text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={onClose}
                  className="bg-fuchsia-800 text-white p-1 transition-colors"
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
