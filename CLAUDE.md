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
pnpm run lint:fix      # Lint and fix with OxLint
pnpm run format:fix    # Format with Biome

# Testing
pnpm run test          # Run all tests
pnpm run test:watch    # Watch mode for development
pnpm run test src/services/cache/handler.test.ts  # Run single test file

# Deployment
pnpm run deploy        # Deploy to Cloudflare Workers

# Cache management (local development)
# Get preview_id from wrangler.jsonc, then:
pnpm wrangler kv key list --local --namespace-id <preview_id> | jq -r '.[].name' | \
  xargs -I {} pnpm wrangler kv key delete "{}" --local --namespace-id <preview_id>
```

### Environment Setup

- **Local**: Create `.dev.vars` with `GITHUB_TOKEN=your_token`
- **Production**: `wrangler secret put GITHUB_TOKEN`
- **Username**: Set in `wrangler.jsonc` under `vars.GITHUB_USERNAME`

## Architecture

### Request Flow

1. **Entry** (`src/index.ts`): Hono router receives request at `/stats/*`
2. **Cache Check** (`src/services/cache/handler.ts`):
   - Checks KV storage for cached SVG
   - If cache miss: returns 503, triggers background generation
   - If cache hit: applies xfetch algorithm to decide if update needed
   - Returns cached content immediately, updates in background if needed
3. **Data Fetching** (`src/services/github/client.ts`): GraphQL queries to GitHub API
4. **SVG Generation** (`src/shared/lib/svg-generator.ts`): React → Satori → SVG conversion
5. **Storage**: SVG stored in KV (no TTL expiration set on KV itself)

### xfetch Caching Algorithm

The cache handler implements Facebook's "Optimal Probabilistic Cache Stampede Prevention":

- **Purpose**: Prevents thundering herd when cache expires
- **Formula**: `shouldUpdate = (age + delta * beta * -log(random())) >= TTL`
- **Behavior**: Probabilistically updates cache before expiry based on age
- **Implementation**: See `shouldUpdateCache()` in `services/cache/handler.ts`

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
│   ├── cache/               # KV cache management
│   │   └── handler.ts      # xfetch algorithm
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
- Cache handler has dedicated unit tests for xfetch algorithm
- Test utilities in `src/test-utils/` provide mock data and helpers
- Run individual tests with: `pnpm run test <file-path>`

## Important Implementation Details

### KV Namespace Configuration

- Production ID and Preview ID defined in `wrangler.jsonc`
- Binding name: `SVG_CACHE`
- Local development uses preview namespace

### Type Safety

- Run `pnpm run cf-typegen` after any `wrangler.jsonc` changes
- Generates `CloudflareBindings` interface in `worker-configuration.d.ts`
- Strict TypeScript mode enabled

### Error Handling

- Cache miss: 503 with Retry-After header
- Missing token: 401 error
- Background updates never block responses
- Errors logged but don't crash worker

### Performance Optimizations

- Inter font cached in Worker memory (Map) to avoid repeated fetches
- SVG generation happens only on cache miss/update
- Background updates via `executionCtx.waitUntil()`
- GraphQL queries fetch minimal required fields
