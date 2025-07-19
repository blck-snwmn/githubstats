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
│   │   └── LanguageStats.tsx   # Full language stats display
│   └── lib/                     # Core libraries
│       ├── github-api.ts        # GitHub GraphQL API client
│       ├── language-stats-svg.ts # SVG generation using Satori
│       └── svg-generator.ts     # SVG generator utilities
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

# Generate TypeScript types from Cloudflare bindings
pnpm run cf-typegen

# Lint code with OxLint
pnpm run lint
pnpm run lint:fix    # Auto-fix linting issues

# Format code with Biome
pnpm run format      # Check formatting
pnpm run format:fix  # Auto-format code
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
- **Type Safety**: Use `CloudflareBindings` interface after running `pnpm run cf-typegen`

### Caching Strategy

Caching is implemented directly in `src/index.ts` with the following behavior:
- Uses Cloudflare Workers Cache API
- Cache revalidation threshold: 1 hour
- Stale-while-revalidate strategy: serves cached content while fetching fresh data in the background
- Cache key based on request URL
- Cached responses include `X-Cached-At` header for age tracking

## Development Notes

- TypeScript is configured with Hono JSX support (`jsxImportSource: "hono/jsx"`)
- The worker serves static assets from the `public/` directory
- Authentication errors return 401 with specific error messages
- All language statistics are fetched in a single GraphQL query to minimize API calls

## Development Workflow

### Local Development

1. **Setup Environment**:
   ```bash
   # Clone repository
   git clone https://github.com/blck-snwmn/githubstats.git
   cd githubstats
   
   # Install dependencies
   pnpm install
   
   # Set up GitHub token
   wrangler secret put GITHUB_TOKEN
   # Enter your GitHub personal access token when prompted
   ```

2. **Start Development Server**:
   ```bash
   pnpm run dev
   # Server starts at http://localhost:8787
   # Access stats at: http://localhost:8787/stats/language
   ```

3. **Debug Tips**:
   - Check console logs in the terminal running `wrangler dev`
   - Use browser DevTools to inspect SVG output
   - Test with different GitHub usernames by modifying `wrangler.jsonc`

### Code Quality

Before committing changes:
1. **Lint your code**: `pnpm run lint` (or `pnpm run lint:fix` to auto-fix)
2. **Format your code**: `pnpm run format:fix`
3. **Generate types**: `pnpm run cf-typegen` (if you modified bindings)

### Deployment

1. **Test locally** with `pnpm run dev`
2. **Deploy to production**:
   ```bash
   pnpm run deploy
   ```
3. The deployed worker will be available at your configured Cloudflare Workers domain

## Error Handling

The application handles various error scenarios:
- **Missing GitHub Token**: Returns 401 with "GitHub token not configured"
- **Invalid Token**: Returns 401 with "Invalid authentication credentials"
- **API Errors**: Gracefully handles GitHub API errors
- **Cache Failures**: Falls back to fetching fresh data if cache operations fail

## Performance Considerations

- **Single GraphQL Query**: All repository data is fetched in one request to minimize API calls
- **Pagination Support**: Handles users with many repositories (up to 100 per page)
- **Font Caching**: Inter font is fetched from CDN and should be cached by browsers
- **SVG Generation**: Satori provides efficient React-to-SVG conversion

## API Usage

### Endpoint

```
GET /stats/language
```

Returns an SVG image (400x200px) showing language statistics for the configured GitHub user.

### Example Usage

```html
<!-- In README.md -->
![Language Stats](https://your-worker.workers.dev/stats/language)

<!-- In HTML -->
<img src="https://your-worker.workers.dev/stats/language" alt="Language Stats" />
```

### Response Headers

- `Content-Type: image/svg+xml`
- `Cache-Control: public, max-age=300` (5 minutes)
- `X-Cached-At: [timestamp]` (when serving from cache)

## Customization

### Modifying Visual Design

1. **Colors**: Edit language colors in `src/components/CompactLanguageStats.tsx` (languageColors object)
2. **Layout**: Modify grid layout and spacing in the component's JSX
3. **Size**: Change dimensions in `src/lib/language-stats-svg.ts` (width/height parameters)
4. **Font**: Update font URL in `src/lib/language-stats-svg.ts`

### Adding New Languages

To add support for a new programming language:
1. Add the language and its color to the `languageColors` object in `CompactLanguageStats.tsx`
2. The GitHub API will automatically include it if present in your repositories

### Changing Data Source

To fetch data for a different user:
1. Update `GITHUB_USERNAME` in `wrangler.jsonc`
2. Ensure the GitHub token has access to the target user's repositories

## Troubleshooting

### Common Issues

1. **"GitHub token not configured" error**:
   - Ensure `GITHUB_TOKEN` is set via `wrangler secret put GITHUB_TOKEN`
   - Token needs `public_repo` scope for public repositories

2. **Blank or broken SVG**:
   - Check browser console for errors
   - Verify font is loading from CDN
   - Ensure all dependencies are installed

3. **Development server not starting**:
   - Check if port 8787 is already in use
   - Ensure `wrangler` is properly installed
   - Try `pnpm install` to reinstall dependencies

4. **Languages not showing up**:
   - Verify the language exists in your GitHub repositories
   - Check if the repository is not a fork (forks are excluded)
   - Ensure the language has a color defined in `languageColors`

## Security Notes

- **GitHub Token**: Never commit your GitHub token to the repository
- **Rate Limiting**: GitHub API has rate limits; caching helps mitigate this
- **CORS**: SVGs are served with appropriate headers for embedding in web pages