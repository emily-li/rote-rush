/**
 * Normalizes user input by converting to lowercase and trimming whitespace
 */
export const normalizeInput = (input: string): string =>
  input.toLowerCase().trim();

/**
 * Checks if the input exactly matches any of the valid answers
 */
export const checkAnswerMatch = (
  input: string,
  validAnswers: string[],
): boolean => {
  const normalized = normalizeInput(input);
  return validAnswers.some((ans) => normalizeInput(ans) === normalized);
};

/**
 * Checks if the input is a valid start to any of the valid answers
 */
export const checkValidStart = (
  input: string,
  validAnswers: string[],
): boolean => {
  const normalized = normalizeInput(input);
  return validAnswers.some((ans) => normalizeInput(ans).startsWith(normalized));
};
