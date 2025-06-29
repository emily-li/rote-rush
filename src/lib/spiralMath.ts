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
  const MAX_RADIUS_WIDTH_RATIO = 0.35;
  const MAX_RADIUS_HEIGHT_RATIO = 0.25;
  const MIN_CHAR_SPACING = 48;
  const TOTAL_TURNS = 3;
  if (pos === 0) return { x: 0, y: 0 };
  const maxR = Math.min(
    w * MAX_RADIUS_WIDTH_RATIO,
    h * MAX_RADIUS_HEIGHT_RATIO,
  );
  const minSteps = Math.ceil(maxR / MIN_CHAR_SPACING);
  const steps = Math.max(total - 1, minSteps);
  const angleStep = (TOTAL_TURNS * 2 * Math.PI) / steps;
  const radiusStep = maxR / steps;
  const angle = pos * angleStep;
  const radius = pos * radiusStep;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
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
