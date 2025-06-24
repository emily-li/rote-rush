import React from 'react';
import { ScoreProps } from './BaseQuizMode';

interface AnimatedMetricProps {
  label: string;
  value: number | string;
  ariaLabel?: string;
  isErrorAnimation: boolean;
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

export enum MetricChange {
  INCREASE,
  DECREASE,
  NONE,
}

export interface ScoreDisplayProps {
  readonly scoreProps: ScoreProps;
  readonly scoreAnimationProps: ScoreAnimationProps;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  scoreProps,
  scoreAnimationProps,
}) => {
  return (
    <div className="absolute left-8 top-8 z-20 space-y-4 p-4 text-left text-3xl">
      <div className="absolute inset-0 rounded-lg bg-fuchsia-200 blur-xl" />

      <Metric
        label="Score"
        value={scoreProps.score}
        isErrorAnimation={false}
        ariaLabel={`Current score: ${scoreProps.score}`}
      />

      <Metric
        label="Streak"
        value={scoreProps.streak}
        isErrorAnimation={
          scoreAnimationProps.streakChange === MetricChange.DECREASE
        }
        ariaLabel={`Current streak: ${scoreProps.streak}`}
      />

      <Metric
        label="Combo"
        value={`×${scoreProps.comboMultiplier}`}
        isErrorAnimation={
          scoreAnimationProps.comboMultiplierChange === MetricChange.DECREASE
        }
        ariaLabel={`Current combo: ${scoreProps.comboMultiplier}`}
      />
    </div>
  );
};
