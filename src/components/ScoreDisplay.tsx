import React, { useEffect, useRef, useState } from 'react';
import { MetricChange, type ScoreState } from '@/types';

type MetricProps = {
  label: string;
  value: string;
  metricChange: MetricChange;
};

const Metric: React.FC<MetricProps> = ({ label, value, metricChange }) => {
  const animation =
    metricChange === MetricChange.INCREASE
      ? 'animate-score-increase'
      : metricChange === MetricChange.DECREASE
        ? 'animate-score-decrease'
        : '';
  return (
    <div className="relative z-10 mb-2 flex items-center justify-between">
      <span className="font-semibold">{label}</span>

      <span
        key={value}
        className={`${animation} inline-block min-w-[3ch] text-right font-semibold`}
        aria-label={`${label} is ${value}`}
      >
        {value}
      </span>
    </div>
  );
};

function useMetricChange(value: number): MetricChange {
  const prev = useRef(value);
  const [change, setChange] = useState(MetricChange.NONE);

  useEffect(() => {
    if (value > prev.current) {
      setChange(MetricChange.INCREASE);
    } else if (value < prev.current) {
      setChange(MetricChange.DECREASE);
    } else {
      setChange(MetricChange.NONE);
    }
    prev.current = value;
  }, [value]);

  return change;
}

export const ScoreDisplay: React.FC<ScoreState> = (scoreState) => {
  return (
    <div className="absolute left-8 top-8 z-20 space-y-4 p-4 text-left font-sans text-3xl">
      <div className="absolute inset-0 rounded-3xl bg-fuchsia-200 blur-lg" />
      <Metric
        label="Score"
        value={scoreState.score.toString()}
        metricChange={useMetricChange(scoreState.score)}
      />

      <Metric
        label="Streak"
        value={scoreState.streak.toString()}
        metricChange={useMetricChange(scoreState.streak)}
      />

      <Metric
        label="Best"
        value={scoreState.highestStreak.toString()}
        metricChange={useMetricChange(scoreState.highestStreak)}
      />

      <Metric
        label="Combo"
        value={`x${scoreState.comboMultiplier}`}
        metricChange={useMetricChange(scoreState.comboMultiplier)}
      />
    </div>
  );
};
