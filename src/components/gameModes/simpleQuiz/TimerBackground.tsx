interface TimerBackgroundProps {
  timeLeft: number;
  timerPercentage: number;
}

export function TimerBackground({
  timeLeft,
  timerPercentage,
}: TimerBackgroundProps) {
  return (
    <div className="fixed inset-0 z-0 flex h-full w-full">
      <div
        className={
          timeLeft === 10 ? '' : 'transition-all duration-1000 ease-linear'
        }
        style={{
          width: `${timerPercentage}%`,
          background: '#e6ffe6',
        }}
      />
      <div className="flex-1 bg-white" />
    </div>
  );
}
