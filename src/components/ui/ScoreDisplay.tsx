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
}: ScoreDisplayProps) => {
  return (
    <div className="absolute left-4 top-4 z-20 space-y-2 text-left text-2xl text-fuchsia-800">
      <div className="flex flex-col border-2 border-fuchsia-300 p-3">
        <div>
          <span>Score: </span>
          <span
            key={score}
            className="inline-block animate-score-pop"
            aria-label={`Current score: ${score}`}
          >
            {score}
          </span>
        </div>

        <div>
          <span>Streak: </span>
          <span
            key={streak}
            className={`inline-block ${
              shouldAnimateStreak ? 'animate-streak-reset' : 'animate-score-pop' }`}
            aria-label={`Current streak: ${streak}`}
          >
            {streak}
          </span>
        </div>

        <div className="relative w-fit whitespace-nowrap">
          <div className="invisible">Combo: ×{comboMultiplier}</div>

          <div
            key={comboMultiplier}
            className={`absolute inset-0 transition-colors duration-300
              ${shouldAnimateCombo ? 'animate-combo-explosion' : ''}
              ${shouldAnimateComboReset ? 'animate-red-explosion' : ''}`}
          >
            Combo: ×{comboMultiplier}
          </div>
        </div>
      </div>
    </div>
  );
};
