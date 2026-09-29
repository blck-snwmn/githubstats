# GitHubStats

GitHub language statistics SVG generator built with Cloudflare Workers.

## Features

- 📊 Four statistics views: language usage, recent repos, recent languages, weekly activity
- ⚡ Cloudflare Workers Cache with stale-while-revalidate
- 🎨 SVG generation with React + Satori
- 🚀 Edge deployment on Cloudflare Workers

## Quick Start

```bash
# Install
pnpm install
pnpm run cf-typegen

# Setup environment
echo "GITHUB_TOKEN=your_token" > .dev.vars

# Development
pnpm run dev

# Deploy
pnpm run deploy
```

## Endpoints

- `/stats/language` - Overall language statistics
- `/stats/recent-repos` - Recently updated repositories
- `/stats/recent-languages` - Recent language usage
- `/stats/weekly-activity` - Weekly repository activity

## Usage

```markdown
![Language Stats](https://your-worker.workers.dev/stats/language)
![Recent Repos](https://your-worker.workers.dev/stats/recent-repos)
![Recent Languages](https://your-worker.workers.dev/stats/recent-languages)
![Weekly Activity](https://your-worker.workers.dev/stats/weekly-activity)
```

## Development

```bash
# Quality checks
pnpm run typecheck     # Generate Worker types and check TypeScript
pnpm run lint          # Lint and TypeScript compiler diagnostics
pnpm run lint:fix      # Lint
pnpm run fmt           # Format

# Testing
pnpm run test          # Run tests

# Regenerate Cloudflare Worker types after changing cloudflare.config.ts
pnpm run cf-typegen
```

Worker types are generated in `.cloudflare/types/index.d.ts`. The `.cloudflare/` directory also contains build output and is generated locally rather than committed.

## Configuration

- **Worker configuration**: `cloudflare.config.ts` defines bindings, compatibility settings, caching, and observability.
- **Build configuration**: `wrangler.config.ts` defines the WASM alias, build constants, minification, and static asset directory.
- **GitHub Username**: Set in `cloudflare.config.ts` under `worker.env.GITHUB_USERNAME`
- **GitHub Token**:
  - Dev: `.dev.vars` file
  - Prod: Configure `GITHUB_TOKEN` as a Worker secret in the Cloudflare dashboard.
- **Cache**: Enabled in `cloudflare.config.ts`; SVG responses use `Cache-Control: public, max-age=300, stale-while-revalidate=1209600`

## Tooling

The project uses `cf@1.0.0-beta.5`. Its `dev` and `build` commands delegate to the local Wrangler bundler.

CLI tools (`lefthook`) are managed by [aqua](https://aquaproj.github.io/) with versions pinned in [aqua.yaml](aqua.yaml).

### Install tools

Install aqua itself first (see the [aqua installation guide](https://aquaproj.github.io/docs/install)), then install the pinned tools:

```bash
aqua install
```

### Set up git hooks

[lefthook](lefthook.yml) runs lint (including TypeScript compiler diagnostics) and format checks on staged files before each commit. Register the hooks once after cloning:

```bash
lefthook install
```
