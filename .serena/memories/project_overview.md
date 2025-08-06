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

## Architecture
- **Main entry**: `src/index.ts` - Hono app with route handlers
- **Components**: React components for SVG layouts (`Card`, `CompactLanguageStats`, `RecentLanguageStats`, `RecentReposStats`)
- **Libraries**: 
  - `github-api.ts` - GitHub GraphQL client
  - `cache-handler.ts` - xfetch caching implementation
  - `svg-generator.ts` - Satori-based SVG generation
  - `language-colors.ts` - Programming language color definitions

## Caching Strategy
Uses xfetch algorithm with:
- 7-day TTL
- Probabilistic updates to prevent cache stampeding
- KV storage instead of Cache API
- Background updates while serving stale content
- Beta parameter of 1.0 for balanced update aggressiveness