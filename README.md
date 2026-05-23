# GitHubStats

GitHub language statistics SVG generator built with Cloudflare Workers.

## Features

- 📊 Three statistics views: language usage, recent repos, recent languages
- ⚡ xfetch caching algorithm prevents stampeding
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

## Usage

```markdown
![Language Stats](https://your-worker.workers.dev/stats/language)
![Recent Repos](https://your-worker.workers.dev/stats/recent-repos)
![Recent Languages](https://your-worker.workers.dev/stats/recent-languages)
```

## Development

```bash
# Quality checks
pnpm run typecheck     # Type checking
pnpm run lint:fix      # Lint
pnpm run format:fix    # Format

# Testing
pnpm run test          # Run tests

# Clear KV cache (local)
pnpm wrangler kv key list --local --namespace-id <preview-namespace-id> | jq -r '.[].name' | \
  xargs -I {} pnpm wrangler kv key delete "{}" --local --namespace-id <preview-namespace-id>
```

## Configuration

- **GitHub Username**: Set in `wrangler.jsonc`
- **GitHub Token**: 
  - Dev: `.dev.vars` file
  - Prod: `wrangler secret put GITHUB_TOKEN`

## Tech Stack

- Cloudflare Workers + KV
- Hono + TypeScript
- React + Satori for SVG
- Vitest + OxLint + Biome

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
