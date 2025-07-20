# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GitHub language statistics generator that creates SVG badges showing programming language usage across repositories. Built with Cloudflare Workers and Hono framework for blazing-fast performance at the edge.

## Project Structure

```
.
├── src/
│   ├── index.ts                 # Main Cloudflare Worker entry point
│   ├── components/              # React components for SVG generation
│   │   ├── Card.tsx            # Base card component
│   │   ├── CompactLanguageStats.tsx  # Compact language stats display
│   │   ├── RecentLanguageStats.tsx   # Recent language usage display
│   │   └── RecentReposStats.tsx     # Recent repositories display
│   └── lib/                     # Core libraries
│       ├── github-api.ts        # GitHub GraphQL API client
│       ├── language-stats-svg.ts # SVG generation using Satori
│       ├── svg-generator.ts     # SVG generator utilities
│       ├── language-colors.ts   # Language color definitions
│       └── font-loader.ts       # Font loading utilities
├── worker-configuration.d.ts    # Cloudflare Worker types
├── wrangler.jsonc              # Wrangler configuration
├── biome.json                  # Code formatter configuration
├── oxlintrc.json              # Linter configuration
├── package.json               # Project dependencies
└── tsconfig.json              # TypeScript configuration
```

## Package Manager

This project uses **pnpm** as the package manager. Use `pnpm` instead of `npm` for all dependency management.

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server (Wrangler dev)
pnpm run dev

# Deploy to production
pnpm run deploy

# Generate TypeScript types from Cloudflare bindings (wrangler.jsonc)
pnpm run cf-typegen

# Lint code with OxLint
pnpm run lint
pnpm run lint:fix    # Auto-fix linting issues

# Format code with Biome
pnpm run format      # Check formatting
pnpm run format:fix  # Auto-format code

# Type check TypeScript code
pnpm run typecheck
```

## Architecture Overview

This is a Cloudflare Workers application built with Hono framework that generates GitHub language statistics as SVG images.

### Key Components

1. **Main Application** (`src/index.ts`)
   - Hono-based HTTP server running on Cloudflare Workers
   - Three endpoints:
     - `/stats/language` - Overall language statistics
     - `/stats/recent-repos` - Recently updated repositories
     - `/stats/recent-languages` - Recent language usage
   - Implements advanced caching with stale-while-revalidate strategy

2. **GitHub Integration** (`src/lib/github-api.ts`)
   - Uses GitHub GraphQL API to fetch repository and language statistics
   - Handles both overall statistics and recent activity
   - Requires authentication via Bearer token
   - Handles pagination for users with many repositories

3. **SVG Generation** (`src/lib/svg-generator.ts`)
   - Uses Satori library to convert React components to SVG
   - Generates 400x200px visualizations by default
   - Fetches Inter font from CDN for consistent rendering
   - Shared SVG generation logic for all card types

4. **UI Components**
   - `Card.tsx`: Reusable base card component with dark theme
   - `CompactLanguageStats.tsx`: 2-column grid layout for language percentages
   - `RecentLanguageStats.tsx`: Horizontal bar visualization for recent language usage
   - `RecentReposStats.tsx`: List of recently updated repositories

### Environment Configuration

- **Required Secrets**:
  - `GITHUB_TOKEN`: Set via `wrangler secret put GITHUB_TOKEN` for production
  - For local development: Create `.dev.vars` file with `GITHUB_TOKEN=your_token`
- **Environment Variables**: `GITHUB_USERNAME` (configured in wrangler.jsonc)
- **Type Safety**: Run `pnpm run cf-typegen` to generate CloudflareBindings TypeScript interface from wrangler.jsonc configuration

### Caching Strategy

Advanced caching implementation in `src/index.ts`:
- Uses Cloudflare Workers Cache API with custom cache instance
- Stale-while-revalidate pattern with 1-hour revalidation threshold
- Returns cached content while fetching fresh data in background
- Falls back to 503 with Retry-After header if no cache exists
- Includes `X-Cached-At` header for cache age tracking

## Development Workflow

### Local Development

1. **Setup Environment**:
   ```bash
   # Clone repository
   git clone https://github.com/blck-snwmn/githubstats.git
   cd githubstats
   
   # Install dependencies
   pnpm install
   
   # Set up GitHub token for local development
   echo "GITHUB_TOKEN=your_github_token_here" > .dev.vars
   
   # Generate TypeScript types for Cloudflare Workers bindings
   pnpm run cf-typegen
   ```

2. **Start Development Server**:
   ```bash
   pnpm run dev
   # Server starts at http://localhost:8787
   # Access endpoints:
   # - http://localhost:8787/stats/language
   # - http://localhost:8787/stats/recent-repos
   # - http://localhost:8787/stats/recent-languages
   ```

### Code Quality

Before committing changes:
1. **Type check**: `pnpm run typecheck`
2. **Lint your code**: `pnpm run lint:fix`
3. **Format your code**: `pnpm run format:fix`
4. **Generate Cloudflare types**: `pnpm run cf-typegen` (if you modified bindings in wrangler.jsonc)

### Deployment

1. **Set production secret** (first time only):
   ```bash
   wrangler secret put GITHUB_TOKEN
   ```
2. **Deploy to production**:
   ```bash
   pnpm run deploy
   ```

## API Endpoints

### GET /stats/language
Returns SVG showing overall language usage across all repositories.

### GET /stats/recent-repos
Returns SVG listing recently updated repositories.

### GET /stats/recent-languages
Returns SVG showing language usage in recent commits.

### Example Usage

```html
<!-- In README.md -->
![Language Stats](https://your-worker.workers.dev/stats/language)
![Recent Repos](https://your-worker.workers.dev/stats/recent-repos)
![Recent Languages](https://your-worker.workers.dev/stats/recent-languages)
```

## Customization

### Adding New Languages

To add support for a new programming language:
1. Add the language and its color to `src/lib/language-colors.ts`
2. The GitHub API will automatically include it if present in your repositories

### Modifying Visual Design

1. **Base styles**: Edit the Card component in `src/components/Card.tsx`
2. **Layout**: Modify individual component layouts
3. **Dimensions**: Change width/height in respective component files
4. **Font**: Update font loading in `src/lib/font-loader.ts`

## Error Handling

The application handles various error scenarios:
- **Missing GitHub Token**: Returns 401 with "GitHub token not configured"
- **Invalid Token**: Returns 401 with authentication error
- **No Cache Available**: Returns 503 with Retry-After header
- **API Errors**: Logged to console with appropriate error responses

## Performance Considerations

- **Efficient GraphQL Queries**: Fetches only necessary data fields
- **Font Caching**: Inter font is cached by browsers
- **Background Revalidation**: Serves stale content while updating
- **Edge Computing**: Runs close to users via Cloudflare's global network