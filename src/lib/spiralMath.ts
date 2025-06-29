import { SPIRAL_MATH_CONFIG } from '@/config/spiral';

function safeDivide(n: number, d: number, f = 0) {
  return d === 0 ? f : n / d;
}

/**
 * Calculate the number of visible characters for the spiral based on viewport area.
 * @param width Window width
 * @param height Window height
 * @returns Number of characters to display in the spiral
 */
export function getVisibleCharacterCount(
  width: number,
  height: number,
): number {
  const MIN_CHARACTERS = SPIRAL_MATH_CONFIG.VISIBLE_CHARACTERS.MIN;
  const MAX_CHARACTERS = SPIRAL_MATH_CONFIG.VISIBLE_CHARACTERS.MAX;
  const BASE_AREA = SPIRAL_MATH_CONFIG.VISIBLE_CHARACTERS.BASE_AREA;
  const viewportArea = width * height;
  const areaRatio = Math.min(1, viewportArea / BASE_AREA);
  return Math.max(
    MIN_CHARACTERS,
    Math.floor(MIN_CHARACTERS + (MAX_CHARACTERS - MIN_CHARACTERS) * areaRatio),
  );
}

function getFontSize(isHead: boolean, pos: number, total: number) {
  if (isHead) return SPIRAL_MATH_CONFIG.FONT_SIZE.HEAD;
  const norm = safeDivide(pos, total - 1, 0);
  const mul = 1 - norm * SPIRAL_MATH_CONFIG.FONT_SIZE.POSITION_REDUCTION_FACTOR;
  return `clamp(${SPIRAL_MATH_CONFIG.FONT_SIZE.MIN_BASE}rem, ${SPIRAL_MATH_CONFIG.FONT_SIZE.MAX_BASE_MULTIPLIER * mul}vw, ${SPIRAL_MATH_CONFIG.FONT_SIZE.MAX_FINAL_MULTIPLIER * mul}rem)`;
}

function getOpacity(isHead: boolean, pos: number) {
  if (isHead) return SPIRAL_MATH_CONFIG.OPACITY.HEAD;
  if (pos === 1) return SPIRAL_MATH_CONFIG.OPACITY.FIRST;
  return Math.max(
    SPIRAL_MATH_CONFIG.OPACITY.MIN,
    SPIRAL_MATH_CONFIG.OPACITY.FIRST -
      (pos - 1) * SPIRAL_MATH_CONFIG.OPACITY.REDUCTION_STEP,
  );
}

function getSpiralCoordinates(
  pos: number,
  total: number,
  w: number,
  h: number,
) {
  // Archimedean spiral with consistent spacing (linear theta) and minimum distance
  const MAX_RADIUS_WIDTH_RATIO = SPIRAL_MATH_CONFIG.MAX_RADIUS_WIDTH_RATIO;
  const MAX_RADIUS_HEIGHT_RATIO = SPIRAL_MATH_CONFIG.MAX_RADIUS_HEIGHT_RATIO;
  // Dynamically calculate total turns based on window size for adaptive spiral shape
  const BASE_TURNS = SPIRAL_MATH_CONFIG.BASE_TURNS;
  const TURN_SCALE_FACTOR = SPIRAL_MATH_CONFIG.TURN_SCALE_FACTOR;
  // Use the larger dimension to ensure turns adapt to viewport's dominant size
  const dominantDimension = Math.max(w, h);
  const TOTAL_TURNS = Math.min(
    SPIRAL_MATH_CONFIG.MAX_TOTAL_TURNS,
    Math.max(
      SPIRAL_MATH_CONFIG.MIN_TOTAL_TURNS,
      BASE_TURNS + dominantDimension * TURN_SCALE_FACTOR,
    ),
  );
  const MINIMUM_DISTANCE_FACTOR = SPIRAL_MATH_CONFIG.MINIMUM_DISTANCE_FACTOR;
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
  // Use a smaller distance factor between index 0 and 1, standard for the rest
  const minRadiusIncrement =
    w *
    (pos === 1
      ? MINIMUM_DISTANCE_FACTOR *
        SPIRAL_MATH_CONFIG.FIRST_POSITION_DISTANCE_FACTOR_MULTIPLIER
      : MINIMUM_DISTANCE_FACTOR);
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
  let scale = SPIRAL_MATH_CONFIG.SCALE.BASE;
  if (isHead) {
    const timerProgress = 1 - timer.timeLeft / timer.currentTimeMs;
    scale =
      SPIRAL_MATH_CONFIG.SCALE.BASE +
      (SPIRAL_MATH_CONFIG.SCALE.MAX - SPIRAL_MATH_CONFIG.SCALE.BASE) *
        timerProgress;
    if (
      timer.timeLeft <=
      timer.currentTimeMs * SPIRAL_MATH_CONFIG.SCALE.WHOOSH_THRESHOLD
    ) {
      const whoosh =
        1 -
        timer.timeLeft /
          (timer.currentTimeMs * SPIRAL_MATH_CONFIG.SCALE.WHOOSH_THRESHOLD);
      scale *= 1 + whoosh * SPIRAL_MATH_CONFIG.SCALE.WHOOSH_MULTIPLIER;
    }
  }
  // Convert coordinates to percentage of window size for relative positioning
  const leftPercent = (x / w) * 100;
  const topPercent = (y / h) * 100;
  return {
    position: 'absolute' as const,
    left: `calc(50% + ${leftPercent}%)`,
    top: `calc(50% + ${topPercent}%)`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    fontSize: getFontSize(isHead, pos, total),
    opacity: getOpacity(isHead, pos),
    zIndex: isHead ? 1000 : 1,
  };
}
