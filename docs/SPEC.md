# MVP Specification: Rote Rush

This document details the Minimum Viable Product (MVP) for the Rote Rush game, based strictly on the MVP section of CONCEPT.md.

## Functional Requirements

### User Stories / Use Cases

- [ ] As a user, I can practice Japanese Hiragana and Katakana characters.
- [ ] As a user, I see a single character in the center of the screen and can input my answer.
- [ ] As a user, I do not need to press an 'enter' button; input is validated in real-time.
- [ ] As a user, my answer is checked for an exact string match to the correct answer.
- [ ] As a user, if I enter a character that does not match the correct answer at any position, it is immediately marked incorrect.
- [ ] As a user, I cannot enter more characters than the answer length.
- [ ] As a user, I receive immediate feedback on whether my answer is correct or incorrect.
- [ ] As a user, I immediately see the answer for an incorrect entry.
- [ ] As a user, I see my current score and combo multiplier.
- [ ] As a user, I am timed for each character and see the timer visually.

### Game Flow

- [ ] User launches the app (desktop only)
- [ ] User is presented with a character and an input box
- [ ] Timer starts for the character
- [ ] User enters an answer:
  - [ ] If correct:
    - [ ] Score increases
    - [ ] Timer for that character is reduced
    - [ ] Combo increases
    - [ ] Next character is shown
  - [ ] If incorrect or timer resets:
    - [ ] Score does not increase
    - [ ] Combo resets
    - [ ] Timer resets
    - [ ] Correct answer is shown, then next character is shown
- [ ] Session continues until user chooses to stop

## Non-Functional Requirements

- [ ] App should respond to user input within 50ms
- [ ] Timer should be visually clear and update smoothly
- [ ] It should be obvious to the user if they answer incorrectly and what the correct answer is
- [ ] App should work on all modern browsers

## Data Structures & Models

### Character Data

- [ ] Store Hiragana and Katakana characters in JSON files

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
      "character": "ん",
      "answers": ["n", "nn"]
    },
    {
      "character": "し",
      "answers": ["shi", "si"]
    }
  ]
}
```

### User Progress (Session only)

- [ ] Track current score (integer)
- [ ] Track current combo count (integer)
- [ ] Track current combo multiplier (float)
- [ ] Track timer value for each character (ms)
- [ ] Session is cleared on when user closes the tab or refreshes

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

- [ ] Main screen: Character centered, input box below, timer bar above, score and combo in top right
- [ ] No 'enter' button for text entry; input is validated as the user types
- [ ] Input is limited to the length of the correct answer
- [ ] Incorrect input is detected and feedback is given as soon as a mismatch occurs
- [ ] Timer bar visually shrinks as time elapses
