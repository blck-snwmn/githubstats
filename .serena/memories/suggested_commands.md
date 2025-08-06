# Suggested Commands for GitHubStats Project

## Development Commands

### Setup & Dependencies
```bash
pnpm install          # Install dependencies (pnpm is required)
```

### Development Server
```bash
pnpm run dev          # Start Wrangler development server (http://localhost:8787)
```

### Code Quality Commands (Run before committing)
```bash
pnpm run typecheck    # TypeScript type checking
pnpm run lint         # Run OxLint checks
pnpm run lint:fix     # Auto-fix linting issues
pnpm run format       # Check code formatting with Biome
pnpm run format:fix   # Auto-format code with Biome
```

### Testing
```bash
pnpm run test         # Run tests once
pnpm run test:watch   # Run tests in watch mode
pnpm run test:coverage # Run tests with coverage report
```

### Deployment
```bash
pnpm run deploy       # Deploy to Cloudflare Workers (production)
pnpm run cf-typegen   # Generate TypeScript types from wrangler.jsonc
```

### Environment Setup
```bash
# For local development - create .dev.vars file
echo "GITHUB_TOKEN=your_github_token_here" > .dev.vars

# For production - set secret via Wrangler
wrangler secret put GITHUB_TOKEN
```

## System Commands (Darwin/macOS)
- `git` - Version control
- `ls` - List directory contents
- `cd` - Change directory
- `rg` (ripgrep) - Fast file search (preferred over grep)
- `find` - Find files and directories

## Important Notes
- Always use `pnpm` instead of `npm` or `yarn`
- Run quality checks before committing: typecheck, lint, format
- Generate CloudflareBindings types after modifying wrangler.jsonc