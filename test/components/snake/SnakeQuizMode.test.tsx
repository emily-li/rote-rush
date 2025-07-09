import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
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

    // Mock timers for controlling setTimeout
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers(); // Restore real timers after each test
  });

  it('should change snake direction on correct input', async () => {
    render(<SnakeQuizMode />);

    const input = screen.getByLabelText('Enter kana to control snake direction');
    const user = userEvent.setup();

    // Initial direction is RIGHT (え)
    // Type 'u' for LEFT
    fireEvent.change(input, { target: { value: 'u' } });

    // Expect input to be cleared
    expect(input).toHaveValue('');

    // Assert direction change by checking the sr-only div
    expect(screen.getByText(/Snake moving LEFT/i)).toBeInTheDocument();
  });

  it('should show invalid input feedback and clear after timeout', async () => {
    render(<SnakeQuizMode />);

    const input = screen.getByLabelText('Enter kana to control snake direction');
    const user = userEvent.setup();

    // Type an invalid character (e.g., 'x')
    act(() => {
      fireEvent.change(input, { target: { value: 'x' } });
    });

    // Expect input to be cleared immediately
    expect(input).toHaveValue(''); // This should be true immediately after the change event

    // Expect invalid input styling
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveClass('animate-jiggle');
  });
    it('should change snake direction even if it is the opposite of current', async () => {
    render(<SnakeQuizMode />);

    const input = screen.getByLabelText('Enter kana to control snake direction');
    const user = userEvent.setup();

    // Initial direction is RIGHT (え)
    // Type 'a' for UP (not opposite)
    fireEvent.change(input, { target: { value: 'a' } });
    expect(screen.getByText(/Snake moving UP/i)).toBeInTheDocument();
    expect(input).toHaveValue('');

    // Now current direction is UP (あ)
    // Type 'i' for DOWN (opposite of UP)
    fireEvent.change(input, { target: { value: 'i' } });
    expect(screen.getByText(/Snake moving DOWN/i)).toBeInTheDocument();
    expect(input).toHaveValue('');
  });
});