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
pnpm run typecheck     # Type checking
pnpm run lint:fix      # Lint
pnpm run format:fix    # Format

# Testing
pnpm run test          # Run tests

# Regenerate Cloudflare Worker types after changing wrangler.jsonc
pnpm run cf-typegen
```

## Configuration

- **GitHub Username**: Set in `wrangler.jsonc`
- **GitHub Token**:
  - Dev: `.dev.vars` file
  - Prod: `wrangler secret put GITHUB_TOKEN`
- **Cache**: Enabled in `wrangler.jsonc`; SVG responses use `Cache-Control: public, max-age=300, stale-while-revalidate=604800`

## Tooling

CLI tools (`lefthook`) are managed by [aqua](https://aquaproj.github.io/) with versions pinned in [aqua.yaml](aqua.yaml).

### Install tools

Install aqua itself first (see the [aqua installation guide](https://aquaproj.github.io/docs/install)), then install the pinned tools:

```bash
aqua install
```

### Set up git hooks

[lefthook](lefthook.yml) runs lint, format, and type checks on staged files before each commit. Register the hooks once after cloning:

```bash
lefthook install
```
