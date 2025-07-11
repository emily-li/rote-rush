/**
 * Input validation utilities for quiz answers
 */

/**
 * Normalize user input by converting to lowercase and trimming whitespace
 * @param input - Raw user input string
 * @returns Normalized input string
 */
export const normalizeInput = (input: string): string =>
  input.toLowerCase().trim();

/**
 * Check if user input exactly matches any valid answer
 * @param input - User's input string
 * @param validAnswers - Array of correct answers for the character
 * @returns True if input matches any valid answer
 */
export const checkAnswerMatch = (
  input: string,
  validAnswers: readonly string[] | undefined,
): boolean => {
  if (!validAnswers) return false;
  const normalized = normalizeInput(input);
  return validAnswers.some((answer) => normalizeInput(answer) === normalized);
};

/**
 * Check if user input is a valid prefix of any correct answer
 * Used for providing immediate feedback during typing
 * @param input - User's partial input string
 * @param validAnswers - Array of correct answers for the character
 * @returns True if input could lead to a valid answer
 */
export const checkValidStart = (
  input: string,
  validAnswers: readonly string[] | undefined,
): boolean => {
  if (!validAnswers) return false;
  const normalized = normalizeInput(input);
  if (normalized.length === 0) return false;
  return validAnswers.some((answer) => 
    normalizeInput(answer).startsWith(normalized)
  );
};

/**
 * Clamp a numeric value between min and max bounds
 * @param value - Value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns Clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};
