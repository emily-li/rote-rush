/**
 * Props for the TimerBackground component
 */
type TimerBackgroundProps = {
  /** Current time in milliseconds for setting animation duration */
  readonly currentTimeMs: number;
  /** Whether the timer is paused */
  readonly isPaused: boolean;
  /** Key to force animation restart on timer reset */
  readonly resetKey?: string | number;
  /** Combo multiplier to determine background color */
  readonly comboMultiplier?: number;
};

/**
 * Get background color based on combo multiplier
 * Alternates between two colors each time combo increases
 */
function getComboBackgroundColor(comboMultiplier: number): string {
  // Map combo multipliers to color levels
  // 1.0 -> level 0, 1.5 -> level 1, 2.0 -> level 2, 3.0 -> level 3
  const comboLevel = comboMultiplier === 1.0 ? 0 : 
                    comboMultiplier === 1.5 ? 1 : 
                    comboMultiplier === 2.0 ? 2 : 3;
  
  // Alternate between two colors based on combo level
  return comboLevel % 2 === 0 ? 'bg-fuchsia-100' : 'bg-emerald-100';
}

/**
 * Background timer display that shows time remaining as a visual indicator
 * Uses a fuchsia background that shrinks horizontally as time runs out with CSS animation
 * Background color alternates based on combo multiplier to make combo increases more visible
 */
export const TimerBackground = ({
  currentTimeMs,
  isPaused,
  resetKey,
  comboMultiplier = 1.0,
}: TimerBackgroundProps) => {
  const backgroundColorClass = getComboBackgroundColor(comboMultiplier);
  
  return (
    <div
      className={`fixed inset-0 h-full w-full ${backgroundColorClass}`}
      style={{
        animation: `shrinkWidth ${currentTimeMs}ms linear forwards`,
        animationPlayState: isPaused ? 'paused' : 'running',
      }}
      key={resetKey}
      aria-hidden="true"
    />
  );
};
