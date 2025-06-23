import React from 'react';

// Base props shared by all metric components
interface BaseMetricProps {
  label: string;
  value: number;
  ariaLabel?: string;
}

// Props for metrics that can be animated
interface AnimatedMetricProps extends BaseMetricProps {
  isAnimated: boolean;
  isErrorAnimation?: boolean;
}

// Shared styling component for label part
const MetricLabel: React.FC<{ label: string }> = ({ label }) => (
  <span className="font-extrabold">{label}</span>
);

// Reusable Value component with consistent styling
const MetricValue: React.FC<{
  value: number | string;
  isAnimated: boolean;
  isErrorAnimation?: boolean;
  ariaLabel?: string;
}> = ({ value, isAnimated, isErrorAnimation = false, ariaLabel }) => {
  // Determine animation based on props
  const animation = isAnimated
    ? isErrorAnimation
      ? 'animate-red-explosion text-red-900' // Error animation (dark red)
      : 'animate-combo-explosion' // Success animation
    : 'animate-score-pop'; // Default animation

  return (
    <span
      key={value}
      className={`ml-10 inline-block transform-gpu font-extrabold transition-colors duration-300
        ${animation}`}
      style={{
        animationDuration: isAnimated ? '1.2s' : '1s',
        transform: 'scale(1.5)',
      }}
      aria-label={ariaLabel}
    >
      {value}
    </span>
  );
};

// Score metric row component
const ScoreMetric: React.FC<AnimatedMetricProps> = ({
  label,
  value,
  isAnimated,
  isErrorAnimation,
  ariaLabel,
}) => (
  <div className="relative z-10 mb-2 flex items-center justify-between">
    <MetricLabel label={label} />
    <MetricValue
      value={value}
      isAnimated={isAnimated}
      isErrorAnimation={isErrorAnimation}
      ariaLabel={ariaLabel || `${label}: ${value}`}
    />
  </div>
);

// Combo metric component that reuses the same MetricValue component
const ComboMetric: React.FC<AnimatedMetricProps> = ({
  label,
  value,
  isAnimated,
  isErrorAnimation,
  ariaLabel,
}) => (
  <div className="relative z-10 mb-2 flex items-center justify-between">
    <MetricLabel label={label} />
    <MetricValue
      value={`×${value}`}
      isAnimated={isAnimated}
      isErrorAnimation={isErrorAnimation}
      ariaLabel={ariaLabel || `${label}: ${value}`}
    />
  </div>
);

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

      {/* Score row */}
      <ScoreMetric
        label="Score"
        value={score}
        isAnimated={false}
        isErrorAnimation={false}
        ariaLabel={`Current score: ${score}`}
      />

      {/* Streak row */}
      <ScoreMetric
        label="Streak"
        value={streak}
        isAnimated={shouldAnimateStreak}
        isErrorAnimation={shouldAnimateComboReset}
        ariaLabel={`Current streak: ${streak}`}
      />

      {/* Combo row */}
      <ComboMetric
        label="Combo"
        value={comboMultiplier}
        isAnimated={shouldAnimateCombo}
        isErrorAnimation={shouldAnimateComboReset}
        ariaLabel={`Current combo: ${comboMultiplier}`}
      />
    </div>
  );
};
