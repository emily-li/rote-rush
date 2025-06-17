interface TimerBackgroundProps {
  totalTimeMs: number;
  timeLeftMs: number;
  transitionDurationMs?: number;
}

export function TimerBackground({
  totalTimeMs,
  timeLeftMs,
  transitionDurationMs = 50,
}: TimerBackgroundProps) {
  const timerPercentage =
    totalTimeMs > 0 ? (timeLeftMs / totalTimeMs) * 100 : 0;
  const isTimerAtFull = timeLeftMs === totalTimeMs;

  const transitionClass = `transition-all ease-linear`;

  return (
    <div className="fixed inset-0 z-0 flex h-full w-full">
      <div
        className={transitionClass}
        style={{
          width: `${timerPercentage}%`,
          background: '#e6ffe6',
          transitionDuration: isTimerAtFull
            ? '0ms'
            : `${transitionDurationMs}ms`,
        }}
      />
      <div className="flex-1 bg-white" />
    </div>
  );
}
