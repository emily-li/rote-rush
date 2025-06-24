/**
 * Props for the TimerBackground component
 */
interface TimerBackgroundProps {
  /** Percentage of time remaining (0-100) */
  readonly timeRemainingPct: number;
}

/**
 * Background timer display that shows time remaining as a visual indicator
 * Uses a fuchsia background that shrinks horizontally as time runs out
 *
 * @param timeRemainingPct - Percentage of time remaining (0-100)
 */
export const TimerBackground = ({ timeRemainingPct }: TimerBackgroundProps) => {
  return (
    <div
      className="fixed inset-0 h-full w-full bg-fuchsia-100 transition-all duration-75"
      style={{
        width: `${Math.max(0, Math.min(100, timeRemainingPct))}%`,
      }}
      aria-hidden="true"
    />
  );
};
