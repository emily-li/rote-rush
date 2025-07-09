import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import SnakeQuizMode from '@/components/snake/SnakeQuizMode';
import * as characterLoading from '@/lib/characterLoading';

describe('SnakeQuizMode', () => {
  beforeEach(() => {
    // Mock getMultipleRandomCharacters to return predictable characters
    vi.spyOn(characterLoading, 'getMultipleRandomCharacters').mockReturnValue([
      { char: 'あ', validAnswers: ['a'] }, // UP
      { char: 'い', validAnswers: ['i'] }, // DOWN
      { char: 'う', validAnswers: ['u'] }, // LEFT
      { char: 'え', validAnswers: ['e'] }, // RIGHT
    ]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should change snake direction on correct input', async () => {
    render(<SnakeQuizMode />);

    const input = screen.getByLabelText('Enter kana to control snake direction');
    const user = userEvent.setup();

    // Initial direction is RIGHT (え)
    // Type 'u' for LEFT
    await user.type(input, 'u');

    // Expect input to be cleared
    expect(input).toHaveValue('');

    // How to assert direction change? We need to inspect the state.
    // This component uses useReducer, so we can't directly access state.
    // We need to find a way to observe the direction change in the DOM.
    // The DirectionIndicator component displays the current direction.
    // We can check the aria-label or text content of the DirectionIndicator.

    // The DirectionIndicator for LEFT should now be active or indicate current direction
    // This requires inspecting the DirectionIndicator component's rendering based on currentDirection prop.
    // Let's assume DirectionIndicator has a way to visually indicate the current direction.
    // For now, I'll add a placeholder assertion and then refine it.

    // Placeholder: This assertion will likely fail until we have a way to observe the direction.
    // We need to check the DirectionIndicator component's rendering based on the currentDirection prop.
    // The DirectionIndicator component has a prop `currentDirection`. We need to check if the correct one is highlighted.
    // Or, we can check the `aria-label` of the snake grid to see if the direction is updated.

    // Let's try to find the DirectionIndicator for LEFT and check its content or a specific class.
    // The DirectionIndicator component has a `getCharForDirection` prop, which returns the character.
    // We can check if the character for the new direction is displayed correctly.

    // For now, I'll add a simple assertion that will need refinement.
    // expect(screen.getByText('う')).toHaveClass('active-direction'); // Assuming a class is added for active direction

    // A better way might be to check the aria-label of the snake grid or a specific element that reflects the direction.
    // The `sr-only` div has `Snake moving ${gameState.direction}.`
    expect(screen.getByText(/Snake moving LEFT/i)).toBeInTheDocument();
  });
});
