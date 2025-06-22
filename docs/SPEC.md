# MVP Specification: Rote Rush

This document details the Minimum Viable Product (MVP) for the Rote Rush game, based strictly on the MVP section of CONCEPT.md.

## Functional Requirements

### User Stories / Use Cases

- [/] As a user, I can practice Japanese Hiragana and Katakana characters.
- [/] As a user, I see a single character in the center of the screen and can input my answer.
- [/] As a user, I do not need to press an 'enter' button; input is validated in real-time.
- [/] As a user, my answer is checked for an exact string match to the correct answer.
- [/] As a user, if I enter a character that does not match the correct answer at any position, it is immediately marked incorrect.
- [/] As a user, I cannot enter more characters than the answer length.
- [/] As a user, I receive immediate feedback on whether my answer is correct or incorrect.
- [/] As a user, I immediately see the answer for an incorrect entry.
- [/] As a user, I see my current score and combo multiplier.
- [/] As a user, I am timed for each character and see the timer visually.

### Game Flow

- [/] User launches the app (desktop only)
- [/] User is presented with a character and an input box
- [/] Timer starts for the character
- [/] User enters an answer:
  - [/] If correct:
    - [/] Score increases
    - [/] Timer for that character is reduced
    - [/] Combo increases
    - [/] Next character is shown
  - [/] If incorrect or timer resets:
    - [/] Score does not increase
    - [/] Combo resets
    - [/] Timer resets
    - [/] Correct answer is shown, then next character is shown
- [/] Session continues until user chooses to stop

## Non-Functional Requirements

- [/] App should respond to user input within 50ms
- [/] Timer should be visually clear and update smoothly
- [/] It should be obvious to the user if they answer incorrectly and what the correct answer is
- [ ] App should work on all modern browsers

## Data Structures & Models

### Character Data

- [/] Store Hiragana and Katakana characters in JSON files

Example character data extract:

```json
{
  "locale": "ja-JP",
  "set_name": "hiragana",
  "values": [
    {
      "character": "あ",
      "answers": ["a"]
    },
    {
      "character": "ぎゅ",
      "answers": ["gyu"]
    },
    {
      "character": "し",
      "answers": ["shi", "si"]
    }
  ]
}
```

### User Progress (Session only)

- [/] Track current score (integer)
- [/] Track current combo count (integer)
- [/] Track current combo multiplier (float)
- [/] Track timer value for each streak (ms)

Example session state:

```json
{
  "currentCharacter": "あ",
  "score": 120,
  "combo": 12,
  "comboMultiplier": 1.5,
  "timer": 1800
}
```

---

## UI Details

- [/] Main screen: Character centered, input box below, timer bar above, score and combo in top right
- [/] No 'enter' button for text entry; input is validated as the user types
- [/] Input is limited to the length of the correct answer
- [/] Incorrect input is detected and feedback is given as soon as a mismatch occurs
- [/] Timer bar visually shrinks as time elapses

# MVP+ Spiral Game

## Overview

The Spiral Game is an enhanced version of the basic quiz mode where characters are arranged in a flat 2D spiral pattern. The current character (head) is positioned at the center of the spiral and grows larger over time, creating visual pressure as the timer counts down.

## Visual Layout

### Spiral Structure

- [ ] Characters arranged in flat 2D spiral pattern emanating from center
- [ ] Approximately 3 complete spiral turns minimum (should scale with viewport size for optimal density on larger screens)
- [ ] Character count responsive to viewport size (prevents overcrowding on small screens, provides depth on large screens)
- [ ] Characters gradually decrease in size from head to tail (smooth visual hierarchy)
- [ ] Characters gradually fade in opacity from head to tail (depth effect with prominent head, subtle tail)
- [ ] Head character significantly larger with distinctive fuchsia glow effect
- [ ] Spiral always fits within viewport bounds (no scrolling required)

### Character Positioning

- [ ] Head character: Always at the exact center (0, 0) of the spiral
- [ ] Spiral characters: Positioned along predetermined spiral path points in a mathematically calculated pattern
- [ ] Continuous movement: All characters continuously advance toward center along spiral path, creating dynamic flow
- [ ] Movement timing: Characters advance at rate synchronized with timer duration
- [ ] Fast transitions: When head is answered correctly, next character immediately becomes new head at center
- [ ] Spiral radius: Large enough to create intense, hectic feeling while ensuring head character legibility and no viewport overflow
- [ ] Path calculation: Uses minimum 3 complete spiral turns, scaling with viewport size for optimal character density

### Visual Hierarchy

- [ ] Head character: Large scalable font size (responsive to viewport), full opacity (1.0), fuchsia-500 color, bold weight
- [ ] Background characters: Font size gradually decreases from head to tail (creating smooth size progression along spiral path), opacity gradually decreases from head to tail (creating fade effect toward spiral end), fuchsia-300 color, normal weight
- [ ] Head character should have strong fuchsia glow/shadow effect for prominence
- [ ] Background characters should have no glow effect - clean and minimal appearance

## Game Mechanics

### Character Progression

- [ ] When a character is answered correctly, all characters advance one position toward center
- [ ] The character that reaches the center becomes the new head
- [ ] A new character is added at the outermost position of the spiral
- [ ] No character removal - characters flow continuously along the spiral path

### Head Character Animation

- [ ] Head character starts at base scalable size when timer begins
- [ ] Head character gradually scales up over the duration of the timer
- [ ] Maximum scale should be limited to prevent viewport overflow (responsive scaling limit)
- [ ] Scaling should be smooth and continuous, synchronized with timer countdown
- [ ] In the final phase of timer, head character "whooshes" with additional scaling effect for dramatic urgency

### Timer Synchronization

- [ ] Timer duration determines the rate of head character growth
- [ ] Character should reach maximum size exactly when timer expires
- [ ] Faster timers (combo bonuses) result in faster character growth
- [ ] No visual timer bar - character scaling serves as the only timer indicator

## User Interactions

### Correct Answer

- [ ] Character advancement: All characters move one position toward center
- [ ] New head: Character now at center becomes the active character
- [ ] Timer reset: New timer starts for the new head character
- [ ] Score increase: Points awarded based on combo multiplier
- [ ] Combo increment: Streak continues, potentially reducing future timer durations
- [ ] Smooth transition: No visual disruption or reset of spiral layout

### Incorrect Answer

- [ ] Input clearing: Text input is immediately cleared
- [ ] Character jiggle: Head character performs a brief jiggle/shake animation
- [ ] Game pause: Timer stops, character scaling pauses
- [ ] State restart: Character returns to normal size and position
- [ ] Retry mode: User can immediately retry the same character
- [ ] Combo reset: Streak resets to 0, timer duration returns to default
- [ ] Resume: Once correct answer is entered, game proceeds normally

### Timeout (Timer Expiration)

- [ ] Same behavior as incorrect answer
- [ ] Character jiggle animation
- [ ] Game pause and state restart
- [ ] User must provide correct answer to continue
- [ ] Combo and timer reset

## Technical Specifications

### Responsive Design

- [ ] Character count should scale with viewport size (more characters on larger screens, fewer on smaller screens)
- [ ] Spiral radius should adapt to viewport dimensions while maintaining readability
- [ ] Font sizes should scale responsively to ensure legibility across all screen sizes
- [ ] All animations and effects should work smoothly on different devices

### Animation Performance

- [ ] Character scaling should use smooth CSS transforms
- [ ] Optional subtle spiral rotation for enhanced visual effect
- [ ] Jiggle effect should be brief and visually clear (small shake/rotation animation)
- [ ] Whoosh effect should provide dramatic scaling burst in final timer phase
- [ ] All animations should be configurable for performance tuning

### Spiral Path Mechanics

- [ ] Spiral path should be mathematically calculated with even spacing between positions
- [ ] Characters advance along predetermined path points toward center
- [ ] Path calculation should account for total character count and spiral turns
- [ ] Movement should be smooth and continuous, not jumpy or discrete

### UI Integration

- [ ] Input field should remain prominently positioned below spiral
- [ ] Score and combo should be clearly visible without interfering with spiral
- [ ] Error answer display should be positioned for clear visibility
- [ ] All UI elements should work harmoniously with spiral animation

## Game State Management

### Character Flow

- [ ] Each character has fixed position in spiral (0 = center/head, highest = tail)
- [ ] Character advancement: All positions decrement by 1 (moving toward center)
- [ ] New characters: Added at highest/outermost position
- [ ] Current character: Always determined by character at position 0
- [ ] Character lifecycle: Continuous flow with no character removal

### Error Handling

- [ ] Viewport overflow prevention through responsive spiral sizing
- [ ] Character scaling limits to prevent horizontal scrolling
- [ ] Safe margins around spiral for character growth
- [ ] Graceful handling of rapid input during animations

## User Experience Goals

### Visual Feedback

- [ ] Clear indication of current character (size, position, color)
- [ ] Obvious visual pressure as timer counts down (growing size)
- [ ] Satisfying progression as characters advance through spiral
- [ ] Clear error feedback without breaking immersion

### Gameplay Flow

- [ ] Continuous, uninterrupted spiral motion for correct answers
- [ ] Brief, clear pause-and-retry for incorrect answers
- [ ] Escalating difficulty through faster timers and character growth
- [ ] Visual rhythm that matches gameplay pace

### Accessibility

- [ ] High contrast colors for character visibility
- [ ] Clear size differences between head and background characters
- [ ] Text shadows/glows for readability on gradient background
- [ ] Responsive layout that works on various screen sizes
