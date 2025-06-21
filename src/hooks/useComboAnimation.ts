import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to manage combo and streak animation state
 * 
 * Features:
 * - Prevents animation on first render
 * - Animates when combo increases (streak milestones)
 * - Animates when combo resets to 1.0 from a higher value (streak broken)
 * - Animates streak with red effect when it resets to 0
 * - Automatically cleans up animation state
 */
export const useComboAnimation = (
  comboMultiplier: number, 
  streak: number
) => {
  const [hasRendered, setHasRendered] = useState(false);
  const [shouldAnimateCombo, setShouldAnimateCombo] = useState(false);
  const [shouldAnimateStreak, setShouldAnimateStreak] = useState(false);
  const [shouldAnimateComboReset, setShouldAnimateComboReset] = useState(false);
  const previousComboRef = useRef(comboMultiplier);
  const previousStreakRef = useRef(streak);

  // Track when component has rendered for the first time
  useEffect(() => {
    setHasRendered(true);
  }, []);
  // Handle combo animation logic
  useEffect(() => {
    if (!hasRendered || previousComboRef.current === comboMultiplier) {
      previousComboRef.current = comboMultiplier;
      return;
    }

    const comboIncreased = comboMultiplier > previousComboRef.current;
    const comboResetFromHigherValue = 
      comboMultiplier === 1.0 && previousComboRef.current > 1.0;
    
    if (comboIncreased) {
      // Purple explosion animation for combo increases
      setShouldAnimateCombo(true);
      
      // Reset animation flag after animation completes (800ms)
      const timeoutId = setTimeout(() => {
        setShouldAnimateCombo(false);
      }, 800);
      
      // Cleanup timeout on component unmount or dependency change
      return () => clearTimeout(timeoutId);    } else if (comboResetFromHigherValue) {
      // Red animation for combo reset from higher value
      setShouldAnimateComboReset(true);
      
      // Reset animation flag after animation completes (600ms)
      const timeoutId = setTimeout(() => {
        setShouldAnimateComboReset(false);
      }, 600);
      
      // Cleanup timeout on component unmount or dependency change
      return () => clearTimeout(timeoutId);
    }
    
    previousComboRef.current = comboMultiplier;
  }, [comboMultiplier, hasRendered]);

  // Handle streak reset animation logic
  useEffect(() => {
    if (!hasRendered || previousStreakRef.current === streak) {
      previousStreakRef.current = streak;
      return;
    }

    // Animate when streak resets to 0 from a higher value (streak broken)
    const streakResetFromHigherValue = streak === 0 && previousStreakRef.current > 0;
    
    if (streakResetFromHigherValue) {
      setShouldAnimateStreak(true);
      
      // Reset animation flag after animation completes (600ms)
      const timeoutId = setTimeout(() => {
        setShouldAnimateStreak(false);
      }, 600);
      
      // Cleanup timeout on component unmount or dependency change
      return () => clearTimeout(timeoutId);
    }
    
    previousStreakRef.current = streak;
  }, [streak, hasRendered]);
  return { 
    shouldAnimateCombo, 
    shouldAnimateStreak,
    shouldAnimateComboReset
  };
}
