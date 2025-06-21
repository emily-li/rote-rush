// Simple input validation utilities
export const normalizeInput = (input: string): string =>
  input.toLowerCase().trim();

export const checkAnswerMatch = (
  input: string,
  validAnswers: string[],
): boolean => {
  const normalized = normalizeInput(input);
  return validAnswers.some((ans) => normalizeInput(ans) === normalized);
};

export const checkValidStart = (
  input: string,
  validAnswers: string[],
): boolean => {
  const normalized = normalizeInput(input);
  if (normalized.length === 0) return false;
  return validAnswers.some((ans) => normalizeInput(ans).startsWith(normalized));
};

// Utility: Clamp a value between min and max
export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}
