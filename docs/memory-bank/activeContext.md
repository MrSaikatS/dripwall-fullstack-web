# Active Context

## Current Focus
Polish and bug-fix pass across admin tables, profile page, and avatar upload. Accessibility improvements (aria-labels), loading state correctness, memory leak fixes, and error handling hardening.

## Recent Changes
- **AGENTS.md**: Added nextjs-agent-rules, form-patterns, bun, and Memory Bank sections
- **Admin tables** (`users-columns.tsx`, `wallpapers-columns.tsx`): Refactored loading state from single `string | null` to `Set<string>` for correct per-row loading indicators
- **Admin CategoryManager**: Wrapped delete in try/catch/finally; added aria-labels to action buttons
- **Profile page** (`ProfileContent.tsx`): Fixed `URL.createObjectURL` memory leak via `revokeObjectURL` in cleanup effect; simplified avatar upload flow
- **Avatar upload** (`uploadAvatar.ts`): Server action now persists the S3 URL to the user DB record directly and cleans up orphaned S3 files on DB failure; removed `data.url` from return type
- **Dashboard wallpapers** (`DashboardWallpapersContent.tsx`): Added safe page fallback when current page exceeds totalPages
- **WallpaperCard**: Added `pt-3` padding to CardFooter for consistent spacing
- Previous work: Neon PostgreSQL migration, seed refactoring, shadcn reinstall, admin panel, landing page, SEO polish, layout refactoring to shadcn sidebar

## Next Steps
- Awaiting user direction — uncommitted polish changes ready for review/commit

## Active Decisions
- Using `bun` as package manager (not npm/npx)
- Server Actions pattern over REST API routes
- S3 proxy for image serving rather than direct S3 URLs
- Dark mode default, system theme switching disabled
- Prisma client generated to `../generated/prisma` (custom path)
- Avatar upload now persists to DB inside the server action (avoids client-side `updateUser` call)
- Per-row loading state using `Set<string>` instead of single `string | null` for concurrent operation safety in admin tables

## Considerations
- Email verification is currently disabled (`requireEmailVerification: false`) — should be enabled for production
- `prismaAdapter(prisma, { provider: "sqlite" })` uses "sqlite" string despite being PostgreSQL — this works with Prisma's adapter but should be noted
- Rate limiting is configured but could be tuned further based on usage patterns
