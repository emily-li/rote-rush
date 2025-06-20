interface TimerBackgroundProps {
  totalTimeMs: number;
  timeLeftMs: number;
}

export function TimerBackground({
  totalTimeMs,
  timeLeftMs,
}: TimerBackgroundProps) {
  const timeRemainingPct = (timeLeftMs / totalTimeMs) * 100;

  return (
    <div
      className="fixed inset-0 flex h-full w-full"
      style={{
        width: `${timeRemainingPct}%`,
        background: '#e6ffe6',
      }}
    />
  );
}
