import { BaseQuizMode } from '@/components/BaseQuizMode';
import { useSpiralQuiz } from '@/hooks/useSpiralQuiz';
import { useWindowSize } from '@/hooks/useWindowSize';

const spiralMath = {
  MAX_RADIUS_WIDTH_RATIO: 0.35,
  MAX_RADIUS_HEIGHT_RATIO: 0.25,
  MIN_CHAR_SPACING: 48,
  TOTAL_TURNS: 3,
  safeDivide(n: number, d: number, f = 0) {
    return d === 0 ? f : n / d;
  },
  getFontSize(isHead: boolean, pos: number, total: number) {
    if (isHead) return 'clamp(3rem, 8vw, 6rem)';
    const norm = spiralMath.safeDivide(pos, total - 1, 0);
    const mul = 1 - norm * 0.6;
    return `clamp(1.5rem, ${6 * mul}vw, ${4 * mul}rem)`;
  },
  getOpacity(isHead: boolean, pos: number) {
    if (isHead) return 1.0;
    if (pos === 1) return 0.3;
    return Math.max(0.2, 0.3 - (pos - 1) * 0.05);
  },
  getSpiralCoordinates(pos: number, total: number, w: number, h: number) {
    if (pos === 0) return { x: 0, y: 0 };
    const maxR = Math.min(w * spiralMath.MAX_RADIUS_WIDTH_RATIO, h * spiralMath.MAX_RADIUS_HEIGHT_RATIO);
    const minSteps = Math.ceil(maxR / spiralMath.MIN_CHAR_SPACING);
    const steps = Math.max(total - 1, minSteps);
    const angleStep = (spiralMath.TOTAL_TURNS * 2 * Math.PI) / steps;
    const radiusStep = maxR / steps;
    const angle = pos * angleStep;
    const radius = pos * radiusStep;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  },
  getCharacterStyle(pos: number, total: number, w: number, h: number, timer: { timeLeft: number; currentTimeMs: number }) {
    const { x, y } = spiralMath.getSpiralCoordinates(pos, total, w, h);
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
      fontSize: spiralMath.getFontSize(isHead, pos, total),
      opacity: spiralMath.getOpacity(isHead, pos),
      zIndex: isHead ? 1000 : 1,
    };
  },
};

export const SpiralQuizMode = (): JSX.Element => {
  const { gameState, spiralCharacters } = useSpiralQuiz();
  const { characterState, scoreState, actions, timerState } = gameState;
  const { width, height } = useWindowSize();

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-fuchsia-50">
      <BaseQuizMode
        scoreState={scoreState}
        userInput={characterState.userInput}
        handleInputChange={actions.handleInputChange}
        currentChar={characterState.currentChar}
        mainContent={
          <div className="relative mb-8 h-[70vh] w-full">
            {spiralCharacters.map((spiralChar, idx) => {
              const isHead = idx === 0;
              return (
                <div
                  key={spiralChar.id}
                  className={`absolute select-none font-kana
                  ${isHead ? 'font-bold text-fuchsia-800 drop-shadow-lg' : 'font-normal text-gray-700'}
                  ${isHead && scoreState.isWrongAnswer ? 'animate-bounce' : ''}
                  pointer-events-none transition-transform duration-100`}
                  style={spiralMath.getCharacterStyle(
                    idx,
                    spiralCharacters.length,
                    width,
                    height,
                    timerState,
                  )}
                  aria-hidden={isHead ? undefined : 'true'}
                  role={isHead ? 'img' : undefined}
                  aria-label={isHead ? spiralChar.char.char : undefined}
                >
                  {spiralChar.char.char}
                </div>
              );
            })}
          </div>
        }
      />
    </div>
  );
};

export default SpiralQuizMode;
