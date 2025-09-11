# Rote Rush - Development Guidelines

## Essential Rules

### Architecture

Refer to [ARCHITECTURE.md](ARCHITECTURE.md)

### Changes

- Always run `pnpm build` to ensure changes work after making changes.
- Never write comments. JSDoc is allowed. If the code is complex and required explaining, this indicates types and/or functions should be extracted with appropriate naming to improve readability.
- Always use `pnpm` for package management - never npm or yarn
- Never run `pnpm build` if only style changes were made

### Tailwind CSS

Use standard Tailwind color classes - avoid custom hex values or CSS colors

Correct: `className="text-fuchsia-800 bg-gray-50"`  
Incorrect: `className="text-[#c026d3]"` or `style={{ color: '#c026d3' }}`

### Fonts

- UI text: default `sans`
- Japanese characters: `font-kana` class

### Colors

- Primary: `fuchsia-800`
- Background-primary: `fuchsia-50`
- Background-secondary: `gray-50`
- Errors: `red-500`, `fuchsia-50`
- Japanese text: `gray-700`

### Testing

- Use `vitest` for testing
- After writing or fixing tests, always run `pnpm test` to ensure all tests pass. Always fix test failures without asking.
- Use semantic queries: `getByLabelText`, `getByRole` - never use `data-testid`

### Commands & Paths

Always use Unix-style commands and forward slashes in paths

### Component Architecture

- Extract complex UI logic into separate components for better separation of concerns
- Example: DirectionPad component extracted from SnakeQuizMode to encapsulate directional control logic
- Prefer inline Tailwind classes over separate CSS class definitions for component-specific styling
- This keeps styles co-located with components and improves maintainability

### TypeScript Patterns

- Use `type` instead of `interface` for simple object types that don't need extension
- Example: `type ComponentProps = { ... }` instead of `interface ComponentProps { ... }`
- Use `as const` for literal type assertions in arrays to maintain type safety

## Workflows

### Build Process

When asked to build, always run `pnpm build` at the project root.  
If there are any build errors, always fix them without asking.

### Reviewing

When asked to review, please review the code thoroughly. If there are no open files, review the whole project. If there are open files, please review those files in addition to files which depend on those files.
Review to the following standards:

- Typescript best practices
- React best practices
- DRY principles
- Tailwind best practices
- Code readability
- Code maintainability
- Code performance
- Code security
- Code accessibility
- Code testability

Suggest relevant improvements but do not make any changes without confirming first.
