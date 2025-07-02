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
};

/**
 * Background timer display that shows time remaining as a visual indicator
 * Uses a fuchsia background that shrinks horizontally as time runs out with CSS animation
 */
export const TimerBackground = ({
  currentTimeMs,
  isPaused,
  resetKey,
}: TimerBackgroundProps) => {
  return (
    <div
      className="fixed inset-0 h-full w-full bg-fuchsia-100"
      style={{
        animation: `shrinkWidth ${currentTimeMs}ms linear forwards`,
        animationPlayState: isPaused ? 'paused' : 'running',
      }}
      key={resetKey}
      aria-hidden="true"
    />
  );
};
