# readmewk

Cloudflare Workers app that returns GitHub stats as SVG images

## Setup

```bash
pnpm install
```

### Environment Variables

- `GITHUB_USERNAME`: Set in wrangler.jsonc
- `GITHUB_TOKEN`: 
  - Local development: Add to `.dev.vars`
  - Production: `pnpm wrangler secret put GITHUB_TOKEN`

```bash
pnpm run dev      # Development server
pnpm run deploy   # Deploy
```

## Usage

### Endpoints

- `GET /stats/language` - Language statistics (400x200px SVG)

### Embedding

```markdown
![Language Stats](https://your-worker.workers.dev/stats/language)
```
