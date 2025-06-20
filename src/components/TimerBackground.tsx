interface TimerBackgroundProps {
  timeRemainingPct: number;
}

export function TimerBackground({ timeRemainingPct }: TimerBackgroundProps) {
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
