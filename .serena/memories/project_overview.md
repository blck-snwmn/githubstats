# GitHubStats Project Overview

## Purpose
GitHub language statistics generator that creates SVG badges showing programming language usage across repositories. Built with Cloudflare Workers and Hono framework for blazing-fast performance at the edge.

## Tech Stack
- **Runtime**: Cloudflare Workers (Edge computing platform)
- **Framework**: Hono (Ultra-fast web framework)
- **Language**: TypeScript (with strict mode enabled)
- **UI Generation**: React components + Satori (for SVG generation)
- **Package Manager**: pnpm (v9.14.1)
- **Testing**: Vitest with jsdom environment
- **Linting**: OxLint with multiple plugins (promise, import, react, typescript, unicorn, node)
- **Formatting**: Biome with 2-space indentation, 100 character line width
- **Storage**: Cloudflare KV for caching

## Key Features
- Three endpoints for different statistics views:
  - `/stats/language` - Overall language statistics
  - `/stats/recent-repos` - Recently updated repositories  
  - `/stats/recent-languages` - Recent language usage
- Advanced caching with xfetch algorithm (Optimal Probabilistic Cache Stampeding Prevention)
- SVG generation using React components converted via Satori
- GitHub GraphQL API integration for data fetching

## Architecture (Feature-based)
The project follows a feature-based/co-location pattern for better modularity:

### Directory Structure
- **`src/features/`** - Feature modules, each containing:
  - `api.ts` - GitHub API queries specific to the feature
  - `generator.tsx` - SVG generation logic using Satori
  - `components/` - React components for rendering
  
- **`src/services/`** - External services:
  - `cache/` - KV cache management with xfetch algorithm
  - `github/` - GitHub GraphQL client and query definitions

- **`src/shared/`** - Shared utilities and components:
  - `components/` - Reusable UI components (Card, ProgressBar)
  - `lib/` - Core libraries (svg-generator, font-loader, colors)
  - `utils/` - Helper functions

- **`src/types/`** - Shared TypeScript type definitions
- **`src/index.ts`** - Main entry point with Hono router

### Features
1. **language-stats** - Overall language statistics
2. **recent-repos** - Recently updated repositories
3. **recent-languages** - Recent language usage

Each feature is self-contained with its own API queries, components, and generation logic.

## Caching Strategy
Uses xfetch algorithm with:
- 7-day TTL
- Probabilistic updates to prevent cache stampeding
- KV storage instead of Cache API
- Background updates while serving stale content
- Beta parameter of 1.0 for balanced update aggressiveness