# Task Completion Checklist

When completing any coding task in this project, follow these steps:

## 1. Code Quality Checks (REQUIRED)
Run these commands in order before considering a task complete:

```bash
# 1. Type checking - ensure no TypeScript errors
pnpm run typecheck

# 2. Linting - check for code quality issues
pnpm run lint
# If there are fixable issues:
pnpm run lint:fix

# 3. Formatting - ensure consistent code style
pnpm run format
# If formatting needed:
pnpm run format:fix
```

## 2. Testing (when applicable)
```bash
# Run tests if you modified existing functionality
pnpm run test

# For new features, consider adding tests
pnpm run test:watch  # During development
```

## 3. Type Generation (if wrangler.jsonc modified)
```bash
pnpm run cf-typegen  # Regenerate CloudflareBindings interface
```

## 4. Pre-commit Verification
Before committing any changes:
1. ✅ All TypeScript compilation passes (`pnpm run typecheck`)
2. ✅ No linting errors (`pnpm run lint`)
3. ✅ Code is properly formatted (`pnpm run format`)
4. ✅ Tests pass if applicable (`pnpm run test`)
5. ✅ Changes align with project conventions

## 5. Local Testing
```bash
# Test changes locally with Wrangler dev server
pnpm run dev
# Access: http://localhost:8787/stats/language
```

## Important Notes
- NEVER skip the quality checks
- Fix all errors before marking task as complete
- If unable to fix an issue, document it clearly
- Follow existing code patterns and conventions