import React from 'react';

interface AnimatedMetricProps {
  label: string;
  value: number | string;
  ariaLabel?: string;
  isAnimated: boolean;
  isErrorAnimation: boolean;
}

type MetricValueProps = {
  value: number | string;
  ariaLabel: string;
  className?: string;
  style?: React.CSSProperties;
};

const MetricLabel: React.FC<{ label: string }> = ({ label }) => (
  <span className="font-extrabold">{label}</span>
);

const MetricValue: React.FC<MetricValueProps> = ({
  value,
  ariaLabel,
  className,
  style,
}) => (
  <span
    className={`inline-block min-w-[3ch] text-right font-extrabold ${className || ''}`}
    style={style}
    aria-label={ariaLabel}
  >
    {value}
  </span>
);

const Metric: React.FC<AnimatedMetricProps> = ({
  label,
  value,
  isAnimated,
  isErrorAnimation,
  ariaLabel,
}) => {
  const animation = isErrorAnimation
    ? 'animate-score-error'
    : isAnimated
      ? 'animate-bounce'
      : '';
  const style = isErrorAnimation
    ? {
        fontSize: '2.5em',
        fontWeight: 900,
        color: '#991b1b',
        textShadow: '0 0 16px #991b1b, 0 0 32px #991b1b',
      }
    : undefined;
  const computedAriaLabel = ariaLabel ?? `${label}: ${value}`;
  return (
    <div className="relative z-10 mb-2 flex items-center justify-between">
      <MetricLabel label={label} />
      <MetricValue
        value={value}
        className={animation}
        style={style}
        ariaLabel={computedAriaLabel}
      />
    </div>
  );
};

export interface ScoreDisplayProps {
  readonly score: number;
  readonly streak: number;
  readonly comboMultiplier: number;
  readonly shouldAnimateCombo: boolean;
  readonly shouldAnimateStreak: boolean;
  readonly shouldAnimateComboReset: boolean;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  streak,
  comboMultiplier,
  shouldAnimateCombo,
  shouldAnimateStreak,
  shouldAnimateComboReset,
}) => {
  return (
    <div className="absolute left-8 top-8 z-20 space-y-4 p-4 text-left text-3xl">
      <div className="absolute inset-0 rounded-lg bg-fuchsia-200 blur-xl" />

      <Metric
        label="Score"
        value={score}
        isAnimated={false}
        isErrorAnimation={false}
        ariaLabel={`Current score: ${score}`}
      />

      <Metric
        label="Streak"
        value={streak}
        isAnimated={shouldAnimateStreak}
        isErrorAnimation={shouldAnimateComboReset}
        ariaLabel={`Current streak: ${streak}`}
      />

      <Metric
        label="Combo"
        value={`×${comboMultiplier}`}
        isAnimated={shouldAnimateCombo}
        isErrorAnimation={shouldAnimateComboReset}
        ariaLabel={`Current combo: ${comboMultiplier}`}
      />
    </div>
  );
};
