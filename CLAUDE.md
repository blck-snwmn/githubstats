# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Essential Development Commands
```bash
# Install and setup
pnpm install
pnpm run cf-typegen    # Generate types after modifying wrangler.jsonc

# Development
pnpm run dev           # Start local server at http://localhost:8787

# Quality checks (run before committing)
pnpm run typecheck     # TypeScript type checking
pnpm run lint          # Lint with oxlint (type-aware via .oxlintrc.json)
pnpm run lint:fix      # Lint and auto-fix
pnpm run fmt:check     # Format check with oxfmt
pnpm run fmt           # Apply oxfmt formatting

# Testing
pnpm run test          # Run all tests
pnpm run test:watch    # Watch mode for development
pnpm run test src/features/recent-repos/components/RecentReposStats.test.tsx  # Run single test file

# Deployment
pnpm run deploy        # Deploy to Cloudflare Workers
```

### Environment Setup
- **Local**: Create `.dev.vars` with `GITHUB_TOKEN=your_token`
- **Production**: `wrangler secret put GITHUB_TOKEN`
- **Username**: Set in `wrangler.jsonc` under `vars.GITHUB_USERNAME`

## Architecture

### Request Flow
1. **Entry** (`src/index.ts`): Hono router receives request at `/stats/*`
2. **Data Fetching** (`src/services/github/client.ts`): GraphQL queries to GitHub API
3. **SVG Generation** (`src/shared/lib/svg-generator.ts`): React → Satori → SVG conversion
4. **Response Caching**: `Cache-Control: public, max-age=300, stale-while-revalidate=604800`

### Workers Cache
Workers Cache is enabled in `wrangler.jsonc`. SVG endpoints generate a fresh response whenever the Worker runs, and Cloudflare's cache handles freshness and stale-while-revalidate behavior before the Worker is invoked:
- `max-age=300`: cached SVGs are fresh for 5 minutes
- `stale-while-revalidate=604800`: stale SVGs can be served for up to 7 days while Cloudflare refreshes them in the background

### Directory Structure (Feature-based)
```
src/
├── features/                # Feature modules
│   ├── language-stats/      # Overall language statistics
│   │   ├── api.ts          # GitHub API queries
│   │   ├── generator.tsx   # SVG generation logic
│   │   └── components/     # React components
│   │       └── CompactLanguageStats.tsx
│   ├── recent-languages/    # Recent language usage
│   │   ├── api.ts
│   │   ├── generator.tsx
│   │   └── components/
│   │       └── RecentLanguageStats.tsx
│   └── recent-repos/        # Recently updated repos
│       ├── api.ts
│       ├── generator.tsx
│       └── components/
│           └── RecentReposStats.tsx
├── services/                # External services
│   └── github/              # GitHub API client
│       ├── client.ts       # GraphQL client
│       ├── queries.ts      # Query definitions
│       └── types.ts        # TypeScript types
├── shared/                  # Shared utilities
│   ├── components/          # Reusable components
│   │   ├── Card/           # Base card wrapper
│   │   └── ProgressBar/    # Progress visualization
│   ├── lib/                 # Core libraries
│   │   ├── svg-generator.ts # Satori integration
│   │   ├── font-loader.ts  # Font management
│   │   └── colors.ts       # Color schemes
│   └── utils/               # Helper functions
├── types/                   # Shared TypeScript types
└── index.ts                 # Entry point (Hono router)
```

### Component Architecture
Each feature follows a consistent pattern:
- **api.ts**: GitHub GraphQL queries specific to the feature
- **generator.tsx**: SVG generation logic using Satori
- **components/**: React components for rendering

All components use shared utilities:
- `Card` component for consistent dark theme wrapper
- `svg-generator.ts` for Satori rendering logic
- `font-loader.ts` for Inter font caching

### GitHub API Integration
- Uses GraphQL for efficient data fetching
- Queries paginate through all user repositories
- Aggregates language statistics from repository edges
- Separate queries for overall stats vs recent activity

### Testing Strategy
- Component tests use `@testing-library/react` with jsdom
- Test utilities in `src/test-utils/` provide mock data and helpers
- Run individual tests with: `pnpm run test <file-path>`

## Important Implementation Details

### Workers Cache Configuration
- Enabled in `wrangler.jsonc`
- SVG responses set `Cache-Control: public, max-age=300, stale-while-revalidate=604800`

### Type Safety
- Run `pnpm run cf-typegen` after any `wrangler.jsonc` changes
- Generates `CloudflareBindings` interface in `worker-configuration.d.ts`
- Strict TypeScript mode enabled

### Error Handling
- Missing token: 401 error
- Errors logged but don't crash worker

### Performance Optimizations
- Inter font cached in Worker memory (Map) to avoid repeated fetches
- Workers Cache serves fresh/stale SVG responses before invoking the Worker
- GraphQL queries fetch minimal required fields
