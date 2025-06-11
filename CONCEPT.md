# Concept

A supplementary game for learning languages, specifically for memorising script such as Japanese Hiragana and Katakana. Can be extended for other scripts such as traditional and simplified Chinese, Korean hangul, etc.

Key features:

- Error oriented-learning so users can practice less familiar characters
  - Characters are shown to the user to enter one by one
  - If a character is answered incorrectly, the answer is presented to the user and the character is more likely to appear.
  - If a character is answered correctly, it is less likely to appear.
- Multiple game modes - to minimise the monotonous aspect of rote memorisation, there are multiple game modes to make learning more fun. For example, characters can appear in a spiral with the head font being larger than the tail font. Or a snake game in which wasd is replaced with characters.
  - Game mode should primarily be oriented around time-based entry. Each time a character is answered correctly, time speeds up. If a character is answered incorrectly, time resets or slows down.
  - Game modes will have scoring systems and user can be notified if they have beat their personal best.
- Multiple script support - Users can change between Japanese, Korean, Chinese, etc.
  - Not all game modes may make sense for all scripts, so the language may change the game mode availability

# Tech stack

- Core stack and prototyping: Typescript and React
- For desktop game bundling: Electron
- For Native: React Native

# Monetization

- Desktop game
  - The game can be made available on Windows, Mac, and Linux for free on platforms such as Steam with limited game modes
  - To make all game modes available, users can pay for a paid version
- App game
  - The game can be made available free on iOS and Android
  - The game should support keyboard and non-keyboard input via voice and/or writing via touch handwriting recognition
  - User can have limited lives or energy. Lives/energy will regenerate over time or can be paid for with money or ad views.
    - Subscription model can allow for unlimited energy
    - Energy can be restored if user meets a certain goal/streak
  - All game modes are made available via stages/worlds
  - New scripts and game modes will be delivered via app updates

# Nice to haves

## Report view

- Users can track their status in a report view. This can show all the characters of a language and the error rate.

## Daily streak (App only)

- To encourage users to practice daily, a daily streak can be maintained

## Multiplayer/Co-op mode

- Users can play with friends to compete in a game mode. All game modes should have scoring systems to make this possible.

# MVP

Platform: Desktop
Language: Japanese
Character set: Hiragana and katakana
Game mode:

## UI

A character is set in the middle of the screen with text form input.

## Gamification

### Timer

- A timer is set per character
- On correct answer: Timer is reduced for that character
- On character timeout: Timer is reset
- On incorrect answer: Timer is reset
- Timer minimum: 1000ms
- Timer maximum: 5000ms

### Scoring

| Event                       | Points / Effect                            |
| --------------------------- | ------------------------------------------ |
| Correct answer              | +10 points                                 |
| Incorrect answer or timeout | 0 points                                   |
| Combo multiplier            | Increases with consecutive correct answers |
| 10 correct answers          | Combo multiplier: x1.5                     |
| 50 correct answers          | Combo multiplier: x2                       |
| 100 correct answers         | Combo multiplier: x3                       |
| Incorrect answer            | Resets combo multiplier                    |
