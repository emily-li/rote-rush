function safeDivide(n: number, d: number, f = 0) {
  return d === 0 ? f : n / d;
}

function getFontSize(isHead: boolean, pos: number, total: number) {
  if (isHead) return 'clamp(3rem, 8vw, 6rem)';
  const norm = safeDivide(pos, total - 1, 0);
  const mul = 1 - norm * 0.6;
  return `clamp(1.5rem, ${6 * mul}vw, ${4 * mul}rem)`;
}

function getOpacity(isHead: boolean, pos: number) {
  if (isHead) return 1.0;
  if (pos === 1) return 0.3;
  return Math.max(0.2, 0.3 - (pos - 1) * 0.05);
}

function getSpiralCoordinates(
  pos: number,
  total: number,
  w: number,
  h: number,
) {
  // Archimedean spiral with consistent spacing (linear theta) and minimum distance
  const MAX_RADIUS_WIDTH_RATIO = 0.35;
  const MAX_RADIUS_HEIGHT_RATIO = 0.25;
  const TOTAL_TURNS = 2.5; // Increased turns for tighter coils
  const MINIMUM_DISTANCE_FACTOR = 0.015; // Reduced factor for less aggressive spacing
  if (pos === 0) return { x: 0, y: 0 };
  const maxRadius = Math.min(
    w * MAX_RADIUS_WIDTH_RATIO,
    h * MAX_RADIUS_HEIGHT_RATIO,
  );
  const thetaMax = TOTAL_TURNS * 2 * Math.PI;
  const t = pos / (total - 1);
  const theta = thetaMax * t;
  const b = maxRadius / thetaMax;
  // Adjust radius to ensure minimum spacing between consecutive positions
  const baseRadius = b * theta;
  // Apply minimum distance with a moderated increment to avoid excessive coil spacing
  const minRadiusIncrement = w * MINIMUM_DISTANCE_FACTOR * Math.sqrt(pos);
  const r = baseRadius + minRadiusIncrement;
  const x = Math.cos(theta) * r;
  const y = Math.sin(theta) * r;
  return { x, y };
}

export function getCharacterStyle(
  pos: number,
  total: number,
  w: number,
  h: number,
  timer: { timeLeft: number; currentTimeMs: number },
) {
  const { x, y } = getSpiralCoordinates(pos, total, w, h);
  const isHead = pos === 0;
  let scale = 1;
  if (isHead) {
    const timerProgress = 1 - timer.timeLeft / timer.currentTimeMs;
    scale = 1 + (2 - 1) * timerProgress;
    if (timer.timeLeft <= timer.currentTimeMs * 0.1) {
      const whoosh = 1 - timer.timeLeft / (timer.currentTimeMs * 0.1);
      scale *= 1 + whoosh * 0.5;
    }
  }
  return {
    position: 'absolute' as const,
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    fontSize: getFontSize(isHead, pos, total),
    opacity: getOpacity(isHead, pos),
    zIndex: isHead ? 1000 : 1,
  };
}
