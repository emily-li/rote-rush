export interface ScoreDisplayProps {
  readonly score: number;
  readonly streak: number;
  readonly comboMultiplier: number;
  readonly shouldAnimateCombo: boolean;
  readonly shouldAnimateStreak: boolean;
  readonly shouldAnimateComboReset: boolean;
}

export const ScoreDisplay = ({
  score,
  streak,
  comboMultiplier,
  shouldAnimateCombo,
  shouldAnimateStreak,
  shouldAnimateComboReset,
}: ScoreDisplayProps) => {  return (
    <div className="absolute left-4 top-4 text-left space-y-2 z-20">
      <div className="flex flex-col bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <div className="text-2xl text-fuchsia-800 font-bold">
          <span className="text-fuchsia-800">Score: </span>
          <span 
            key={score} 
            className="animate-score-pop inline-block" 
            aria-label={`Current score: ${score}`}
          >
            {score}
          </span>
        </div>
        
        <div className="text-2xl text-fuchsia-800 font-bold">
          <span className="text-fuchsia-800">Streak: </span>
          <span 
            key={streak} 
            className={`inline-block ${
              shouldAnimateStreak ? 'animate-streak-reset' : 'animate-score-pop'
            }`}
            aria-label={`Current streak: ${streak}`}          >
            {streak}
          </span>
        </div>
        
        <div className="relative w-fit whitespace-nowrap">
          <div className="invisible text-2xl">
            Combo: ×{comboMultiplier}
          </div>
          
          <div 
            key={comboMultiplier} 
            className={`absolute inset-0 text-2xl font-bold text-fuchsia-800 transition-colors duration-300 ${
              shouldAnimateCombo ? 'animate-combo-explosion' : ''
            } ${
              shouldAnimateComboReset ? 'animate-red-explosion' : ''
            }`}
          >
            Combo: ×{comboMultiplier}
          </div>
        </div>
      </div>
    </div>
  );
}
