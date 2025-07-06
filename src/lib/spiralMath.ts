import { SPIRAL_MATH_CONFIG as cfg } from '@/config/spiral';

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
  const viewportArea = width * height;
  const areaRatio = Math.min(
    1,
    viewportArea / cfg.VISIBLE_CHARACTERS.BASE_AREA,
  );
  return Math.max(
    cfg.VISIBLE_CHARACTERS.MIN,
    Math.floor(
      cfg.VISIBLE_CHARACTERS.MIN +
        (cfg.VISIBLE_CHARACTERS.MAX - cfg.VISIBLE_CHARACTERS.MIN) * areaRatio,
    ),
  );
}

function getFontSize(isHead: boolean, pos: number, total: number) {
  if (isHead) return cfg.FONT_SIZE.HEAD;
  const norm = safeDivide(pos, total - 1, 0);
  const mul = 1 - norm * cfg.FONT_SIZE.POSITION_REDUCTION_FACTOR;
  return `clamp(${cfg.FONT_SIZE.MIN_BASE}rem, ${cfg.FONT_SIZE.MAX_BASE_MULTIPLIER * mul}vw, ${cfg.FONT_SIZE.MAX_FINAL_MULTIPLIER * mul}rem)`;
}

function getOpacity(isHead: boolean, pos: number) {
  if (isHead) return cfg.OPACITY.HEAD;
  if (pos === 1) return cfg.OPACITY.FIRST;
  return Math.max(
    cfg.OPACITY.MIN,
    cfg.OPACITY.FIRST - (pos - 1) * cfg.OPACITY.REDUCTION_STEP,
  );
}

function getSpiralCoordinates(
  pos: number,
  total: number,
  w: number,
  h: number,
) {
  const dominantDimension = Math.max(w, h);
  const TOTAL_TURNS = Math.min(
    cfg.MAX_TOTAL_TURNS,
    Math.max(
      cfg.MIN_TOTAL_TURNS,
      cfg.BASE_TURNS + dominantDimension * cfg.TURN_SCALE_FACTOR,
    ),
  );
  if (pos === 0) return { x: 0, y: 0 };
  const maxRadius = Math.min(
    w * cfg.MAX_RADIUS_WIDTH_RATIO,
    h * cfg.MAX_RADIUS_HEIGHT_RATIO,
  );
  const thetaMax = TOTAL_TURNS * 2 * Math.PI;
  const t = pos / (total - 1);
  const theta = thetaMax * t;
  const b = maxRadius / thetaMax;
  const baseRadius = b * theta;
  const minRadiusIncrement =
    w *
    (pos === 1
      ? cfg.MINIMUM_DISTANCE_FACTOR *
        cfg.FIRST_POSITION_DISTANCE_FACTOR_MULTIPLIER
      : cfg.MINIMUM_DISTANCE_FACTOR);
  const r = baseRadius + minRadiusIncrement;
  const x = Math.cos(theta) * r;
  const y = Math.sin(theta) * r;
  return { x, y };
}

function getHeadScale(timer: {
  timeLeft: number;
  currentTimeMs: number;
}): number {
  let scale = cfg.SCALE.BASE;
  const timerProgress = 1 - timer.timeLeft / timer.currentTimeMs;
  scale = cfg.SCALE.BASE + (cfg.SCALE.MAX - cfg.SCALE.BASE) * timerProgress;
  if (timer.timeLeft <= timer.currentTimeMs * cfg.SCALE.WHOOSH_THRESHOLD) {
    const whoosh =
      1 - timer.timeLeft / (timer.currentTimeMs * cfg.SCALE.WHOOSH_THRESHOLD);
    scale *= 1 + whoosh * cfg.SCALE.WHOOSH_MULTIPLIER;
  }
  return scale;
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
  const scale = isHead ? getHeadScale(timer) : cfg.SCALE.BASE;
  const leftPercent = (x / w) * 100;
  const topPercent = (y / h) * 100;
  const charClass = isHead
    ? 'font-bold text-shadow-lg'
    : pos === 1
      ? 'font-bold text-shadow-lg'
      : pos === 2
        ? 'text-shadow-lg'
        : 'text-gray-700';
  return {
    position: 'absolute' as const,
    left: `calc(50% + ${leftPercent}%)`,
    top: `calc(50% + ${topPercent}%)`,
    transform: `translate(-50%, -50%) scale(${scale})`,
    fontSize: getFontSize(isHead, pos, total),
    opacity: getOpacity(isHead, pos),
    zIndex: isHead ? 1000 : 1,
    charClass,
  };
}
