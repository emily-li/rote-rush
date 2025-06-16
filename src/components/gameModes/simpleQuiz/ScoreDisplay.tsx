interface ScoreDisplayProps {
  score: number;
  combo: number;
}

export function ScoreDisplay({ score, combo }: ScoreDisplayProps) {
  return (
    <div className="absolute right-4 top-4 text-right">
      <div className="text-2xl font-bold text-gray-800">Score: {score}</div>
      <div className="text-lg text-gray-600">Combo: {combo}</div>
    </div>
  );
}
