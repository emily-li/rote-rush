/**
 * Props for the TimerBackground component
 */
interface TimerBackgroundProps {
  /** Percentage of time remaining (0-100) */
  readonly timeRemainingPct: number;
}

/**
 * Background timer display that shows time remaining as a visual indicator
 * Uses a green background that shrinks horizontally as time runs out
 * 
 * @param timeRemainingPct - Percentage of time remaining (0-100)
 */
export const TimerBackground = ({ timeRemainingPct }: TimerBackgroundProps) => {
  return (
    <div
      className="fixed inset-0 h-full w-full transition-all duration-75 bg-green-100"
      style={{
        width: `${Math.max(0, Math.min(100, timeRemainingPct))}%`,
      }}
      aria-hidden="true"
    />
  );
};
