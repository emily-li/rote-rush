import React from 'react';
import type { ScoreState } from '@/types';

type AnimatedMetricProps = {
  label: string;
  value: number | string;
  ariaLabel?: string;
  isErrorAnimation: boolean;
};

export enum MetricChange {
  INCREASE,
  DECREASE,
  NONE,
}

type ScoreAnimationProps = {
  streakChange: MetricChange;
  comboMultiplierChange: MetricChange;
};

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
  isErrorAnimation,
  ariaLabel,
}) => {
  const animation = isErrorAnimation ? 'animate-score-error' : '';
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

type ScoreDisplayProps = {
  readonly scoreState: ScoreState;
  readonly scoreAnimationProps: ScoreAnimationProps;
};

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  scoreState,
  scoreAnimationProps,
}) => {
  return (
    <div className="absolute left-8 top-8 z-20 space-y-4 p-4 text-left text-3xl">
      <div className="absolute inset-0 rounded-lg bg-fuchsia-200 blur-xl" />

      <Metric
        label="Score"
        value={scoreState.score}
        isErrorAnimation={false}
        ariaLabel={`Current score: ${scoreState.score}`}
      />

      <Metric
        label="Streak"
        value={scoreState.streak}
        isErrorAnimation={
          scoreAnimationProps.streakChange === MetricChange.DECREASE
        }
        ariaLabel={`Current streak: ${scoreState.streak}`}
      />

      <Metric
        label="Combo"
        value={`×${scoreState.comboMultiplier}`}
        isErrorAnimation={
          scoreAnimationProps.comboMultiplierChange === MetricChange.DECREASE
        }
        ariaLabel={`Current combo: ${scoreState.comboMultiplier}`}
      />
    </div>
  );
};
