# Active Context

## Current Focus

Polish and bug-fix pass across admin tables, profile page, and avatar upload. Accessibility improvements (aria-labels), loading state correctness, memory leak fixes, and error handling hardening.

## Recent Changes

- **Profile page** (`ProfileContent.tsx`): Added `refetch` from `authClient.useSession()` and calls `await refetch()` after successful avatar upload so `session.user.image` updates immediately in the UI
- **Avatar upload** (`uploadAvatar.ts`): Added cleanup of previous avatar file from S3 storage — fetches existing user record before upload, extracts S3 key from old image URL via `extractS3Key`, and calls `deleteFile` after successful DB update (guarded: skips if no previous image, avoids deleting the new file, failures never block success)
- **AGENTS.md**: Added nextjs-agent-rules, form-patterns, bun, and Memory Bank sections (previous)
- **Admin tables** (`users-columns.tsx`, `wallpapers-columns.tsx`): Refactored loading state from single `string | null` to `Set<string>` for correct per-row loading indicators (previous)
- **Admin CategoryManager**: Wrapped delete in try/catch/finally; added aria-labels to action buttons (previous)
- **Profile page** (`ProfileContent.tsx`): Fixed `URL.createObjectURL` memory leak via `revokeObjectURL` in cleanup effect; simplified avatar upload flow (previous)
- **Avatar upload** (`uploadAvatar.ts`): Server action now persists the S3 URL to the user DB record directly and cleans up orphaned S3 files on DB failure; removed `data.url` from return type (previous)
- **Dashboard wallpapers** (`DashboardWallpapersContent.tsx`): Added safe page fallback when current page exceeds totalPages (previous)
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
- After successful avatar upload, client calls `refetch()` from `authClient.useSession()` to sync `session.user.image` immediately
- Server-side old-avatar cleanup after successful upload+DB write, using `extractS3Key` to derive the storage key from the stored URL
- Per-row loading state using `Set<string>` instead of single `string | null` for concurrent operation safety in admin tables

## Considerations

- Email verification is currently disabled (`requireEmailVerification: false`) — should be enabled for production
- `prismaAdapter(prisma, { provider: "sqlite" })` uses "sqlite" string despite being PostgreSQL — this works with Prisma's adapter but should be noted
- Rate limiting is configured but could be tuned further based on usage patterns
