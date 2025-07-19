# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

# Generate TypeScript types from Cloudflare bindings
pnpm run cf-typegen

# Lint code with OxLint
pnpm run lint

# Format code with Biome
pnpm run format
```

## Architecture Overview

This is a Cloudflare Workers application built with Hono framework that generates GitHub language statistics as SVG images.

### Key Components

1. **Main Application** (`src/index.ts`)
   - Hono-based HTTP server running on Cloudflare Workers
   - Single endpoint: `/stats/language` for personal use only
   - Implements caching with stale-while-revalidate strategy

2. **GitHub Integration** (`src/lib/github-api.ts`)
   - Uses GitHub GraphQL API to fetch repository language statistics
   - Aggregates language usage across all owned repositories (excludes forks)
   - Requires authentication via Bearer token
   - Handles pagination for users with many repositories

3. **SVG Generation** (`src/lib/language-stats-svg.ts`)
   - Uses Satori library to convert React components to SVG
   - Generates 400x200px language statistics visualization
   - Fetches Inter font from CDN for consistent rendering

4. **UI Components** (`src/components/CompactLanguageStats.tsx`)
   - Dark theme design with GitHub-style colors
   - Progress bar visualization of language percentages
   - 2-column grid layout for language list
   - Supports 38 programming language colors

### Environment Configuration

- **Required Secrets**: `GITHUB_TOKEN` (must be set via `wrangler secret put`)
- **Environment Variables**: `GITHUB_USERNAME` (configured in wrangler.jsonc)
- **Type Safety**: Use `CloudflareBindings` interface after running `npm run cf-typegen`

### Caching Strategy

Cache headers are defined in `src/lib/cache.ts`:
- Success responses: 5-minute cache with 1-hour stale-while-revalidate
- Error responses: 1-minute cache with 5-minute stale-while-revalidate
- CDN cache: 1-hour cache with 24-hour stale-while-revalidate for successful responses

## Development Notes

- TypeScript is configured with Hono JSX support (`jsxImportSource: "hono/jsx"`)
- The worker serves static assets from the `public/` directory
- Authentication errors return 401 with specific error messages
- All language statistics are fetched in a single GraphQL query to minimize API calls

## Code Quality

When making changes to the codebase:
- Run `pnpm run lint` to check for code quality issues with OxLint
- Run `pnpm run format` to automatically format code with Biome
- These commands should be run before committing changes to ensure code consistency