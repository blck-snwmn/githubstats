# Code Style and Conventions

## TypeScript Configuration

- **Target**: ESNext
- **Module**: ESNext with Bundler module resolution
- **Strict Mode**: Enabled (all strict checks active)
- **JSX**: React JSX with Hono's jsx import source
- **Libraries**: ESNext features only

## Code Formatting (Biome)

- **Indentation**: Spaces (2 spaces)
- **Line Width**: 100 characters maximum
- **Files**: Only format src/**/\*.ts and src/**/\*.tsx files
- **Linting**: Disabled in Biome (using OxLint instead)

## Linting Rules (OxLint)

### Severity Levels

- **Error**: Correctness issues
- **Warn**: Suspicious patterns, performance issues
- **Special Rules**:
  - `no-console`: Warn (allow warn, error, info)
  - `typescript/no-explicit-any`: Warn
  - `typescript/no-unused-vars`: Error (ignore args/vars starting with \_)
  - `react/jsx-no-target-blank`: Error
  - `react/react-in-jsx-scope`: Off (not needed with new JSX transform)
  - `import/no-duplicates`: Error
  - Max nested callbacks: 20
  - Max depth: 10 (warning)

### Ignored Patterns

- node_modules/
- dist/
- build/
- coverage/
- \*.min.js
- \*.d.ts

## Project Structure Conventions

- **Components**: React TSX components in `src/components/`
- **Libraries**: Utility modules in `src/lib/`
- **Types**: Type definitions in `src/types/`
- **Tests**: Co-located with source files (_.test.ts, _.test.tsx)
- **Test Utils**: Helper functions in `src/test-utils/`

## Naming Conventions

- **Files**: kebab-case for files (e.g., `cache-handler.ts`, `language-stats-svg.tsx`)
- **Components**: PascalCase for React components (e.g., `CompactLanguageStats.tsx`)
- **Variables/Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE for configuration constants

## Import/Export Patterns

- Use ES modules (import/export)
- Type imports: `import type { ... } from ...`
- Default exports for main exports, named exports for utilities
