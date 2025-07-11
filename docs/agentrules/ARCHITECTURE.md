# Rote Rush Architecture Overview

This document provides a high-level overview of the Rote Rush project's architecture, focusing on key components, data flow, and the core architectural pattern of composition over inheritance. It serves as a quick reference to understand the structure and relationships within the codebase, facilitating efficient development and maintenance.

## Core Architectural Pattern: Composition

The application follows a **composition-over-inheritance** model. Instead of relying on a `BaseQuizMode` component, each game mode (`SimpleQuizMode`, `SpiralQuizMode`, etc.) is built by composing smaller, reusable UI components.

**Key Principles:**
- **No Base Components:** Game modes are self-contained and do not extend a base class or component.
- **Reusable UI Blocks:** Common UI elements like `ScoreDisplay`, `QuizInput`, and `SettingsButton` are implemented as standalone components.
- **Flexible Layouts:** Each game mode has full control over its layout and can arrange the shared UI components as needed.
- **Decoupled Logic:** Game logic is encapsulated within hooks (e.g., `useQuizGame`), which provide state and actions to the UI components.

This approach enhances modularity, simplifies testing, and makes it easier to create new game modes with unique layouts without being constrained by a shared base structure.

## Core Structure

- **Main Entry Point**: `src/main.tsx`
  - Initializes the React application and renders the root component.
- **Root Component**: `src/App.tsx`
  - Serves as the top-level component, managing global state and routing.

## Key Components and Their Roles

- **Game Modes**:
  - `src/components/simple/SimpleQuizMode.tsx`: Implements the simple quiz mode by composing shared UI components.
  - `src/components/spiral/SpiralQuizMode.tsx`: Implements the spiral quiz mode, composing shared UI with custom spiral animation logic.
  - `src/components/snake/SnakeQuizMode.tsx`: Implements the snake game mode, with its own distinct UI and game logic.
- **Shared UI Elements**:
  - `src/components/QuizInput.tsx`: Handles user input for quiz answers.
  - `src/components/ScoreDisplay.tsx`: Displays current score and streak information.
  - `src/components/ReportView.tsx`: Shows detailed results or statistics, with timer pause/resume functionality.
  - `src/components/simple/TimerBackground.tsx`: Visual timer indicator using CSS animations for smooth transitions.
  - `src/components/SettingsButton.tsx`: Provides access to settings or configuration options.
- **Context and State Management**:
  - `src/components/GameModeContext.tsx`: Manages game mode state and context for switching between simple and spiral modes.

## Key Hooks

- `src/hooks/useQuizGame.ts`: Core game logic hook, managing character state, scoring, timer control, and user input handling.
- `src/hooks/useSpiralQuiz.ts`: Specialized hook for spiral mode logic and animations.
- `src/hooks/useGameModeQuerySync.ts`: Synchronizes game mode with URL queries or state for persistence.
- `src/hooks/useWindowSize.ts`: Utility hook for responsive design based on window dimensions.

## Key Libraries and Utilities

- `src/lib/useTimer.ts`: Timer logic for managing countdowns and state (e.g., `timeRemainingPct`, `currentTimeMs`, pause/resume).
- `src/lib/characterLoading.ts`: Handles loading and processing of character data (e.g., hiragana, katakana).
- `src/lib/characterStats.ts`: Manages statistics or performance tracking for characters.
- `src/lib/quizUtils.ts`: Utility functions for quiz logic, such as score calculations or combo multipliers.
- `src/lib/spiralMath.ts`: Mathematical calculations for spiral animations and positioning.
- `src/lib/validation.ts`: Input validation logic for user answers.

## Configuration

- `src/config/quiz.ts`: Configuration for quiz settings, including timer durations and difficulty levels.
- `src/config/spiral.ts`: Configuration specific to spiral mode visuals and behavior.
- `src/config/weights.ts`: Weighting logic for character selection or scoring.

## Data Flow

- **Character and Input Flow**:
  - Character data is loaded via `characterLoading.ts` and managed in `useQuizGame.ts`.
  - User input is captured in `QuizInput.tsx`, processed through `useQuizGame.ts`, and validated with `validation.ts`.
- **Timer Flow**:
  - Timer state is managed in `useTimer.ts`, passed through `useQuizGame.ts` to components like `TimerBackground.tsx` for visual representation.
  - Timer pause/resume (e.g., for `ReportView.tsx`) is controlled via `timerControl` from `useQuizGame.ts`.
- **Score and Feedback Flow**:
  - Scoring logic in `useQuizGame.ts` updates state based on input validation, reflected in `ScoreDisplay.tsx`.
  - Detailed feedback or history is shown in `ReportView.tsx` when triggered.
- **Mode Switching**:
  - Game mode state in `GameModeContext.tsx` dictates which quiz mode component is rendered, synchronized with URL or storage via `useGameModeQuerySync.ts`.

## Integration Points

- **Timer Integration**: Components or hooks needing timer state or control (e.g., pause/resume for `ReportView.tsx`) interact through `useQuizGame.ts` which exposes `timerState` and `timerControl`.
- **Character Updates**: New characters or resets are managed in `useQuizGame.ts`, triggering updates to UI components like `QuizInput.tsx` or `TimerBackground.tsx` (via `resetKey`).
- **Visual Effects**: Animation or visual feedback (e.g., spiral effects, timer animations) are driven by specific hooks (`useSpiralQuiz.ts`) or CSS (in `TimerBackground.tsx`).

## Resources

- `src/resources/hiragana.json` and `src/resources/katakana.json`: Data files for character sets used in quizzes.

## Focus Notes

- This overview is intended to provide quick context for development tasks. For specific coding standards, testing, or workflow rules, refer to other documents in `.clinerules/`.
- Key files like `useQuizGame.ts` are central to most features, making it a frequent starting point for modifications or debugging.

This architecture overview aims to accelerate onboarding and task execution in Rote Rush by clarifying the project's structure and key interactions.
