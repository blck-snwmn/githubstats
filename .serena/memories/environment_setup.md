# Environment Setup and Configuration

## Required Environment Variables

### Local Development
Create a `.dev.vars` file in the project root:
```bash
GITHUB_TOKEN=your_github_personal_access_token_here
```

### Production Deployment
Set secrets using Wrangler:
```bash
wrangler secret put GITHUB_TOKEN
```

## Configuration Files

### wrangler.jsonc
- **Name**: githubstats
- **Main**: src/index.ts
- **Compatibility Date**: 2025-07-15
- **Assets**: Bound to ASSETS, directory: ./public
- **Observability**: Enabled
- **Variables**:
  - `GITHUB_USERNAME`: blck-snwmn (configured in file)
- **KV Namespaces**:
  - Binding: `SVG_CACHE`
  - Production ID: a8ddf53b32334db1a7ba880e5b2dbe62
  - Preview ID: bda1368a341c4556b30752db920a457c

### CloudflareBindings Interface
Generated from wrangler.jsonc using:
```bash
pnpm run cf-typegen
```
Output: `worker-configuration.d.ts`

## GitHub Token Requirements
The GITHUB_TOKEN needs the following permissions:
- Read access to public repositories
- GraphQL API access

## System Requirements
- **Node.js**: Compatible with ESNext features
- **pnpm**: v9.14.1 or compatible
- **Operating System**: Darwin (macOS) - project developed on this system

## Development URLs
- **Local**: http://localhost:8787
- **Endpoints**:
  - `/stats/language` - Overall language statistics
  - `/stats/recent-repos` - Recent repositories
  - `/stats/recent-languages` - Recent language usage