# Active Context

## Current Focus

Bug fixes and server-side sorting for admin wallpapers table. Pagination UX hardening (stranded-page recovery after deletion) and replacing client-side-only sorting with server-driven URL-based sorting.

## Recent Changes

- **Prisma type derivation** (`getCategories.ts`): Replaced hand-written `CategoryListItem` interface with `Prisma.CategoryGetPayload<{ select: ... }>` so the return type stays in sync with the query's `select` shape. Established as the project pattern for Prisma-backed DTOs.
- **Prisma type derivation sweep** (10 files in `src/server/`): Replaced hand-written interfaces with `Prisma.XxxGetPayload<{ select: ... }>` derivations across `getCollections`, `getCollectionById`, `getCategoryBySlug`, `getUserDownloads`, `getUserLikes`, `getUserWallpapers`, `getFeaturedWallpapers`, `getWallpaperById`, `getWallpapers`, `getAllWallpapersAdmin`. `getAllWallpapersAdmin` also extracts the duplicated select into a shared `adminWallpaperSelect` const typed with `satisfies Prisma.WallpaperSelect` and reused in both queries + the type derivation to prevent drift.
- **Server-side sorting** (`AdminWallpapersContent.tsx`, `getAllWallpapersAdmin.ts`, `data-table.tsx`, `admin/wallpapers/page.tsx`):
  - Replaced client-side-only `getSortedRowModel()` sorting with server-driven URL-based sorting
  - Added `manualSorting`, `sorting`, `onSortingChange` props to shared `DataTable` component (backward compatible)
  - `getAllWallpapersAdmin` accepts `sortField`/`sortOrder` params, builds dynamic Prisma `orderBy` (supports `title`, `downloadCount`, `likes._count`)
  - Sort state read from URL `?sort=X&order=Y` search params; sorting a column navigates via `router.push`, resetting to `page=1`
  - Pagination links (`Previous`/`Next`) preserve sort params so sort persists across pages
- **Pagination after deletion fix** (`AdminWallpapersContent.tsx`, `getAllWallpapersAdmin.ts`, `admin/wallpapers/page.tsx`):
  - Removed early return when `wallpapers.length === 0` — empty message rendered inline, pagination still visible when `currentPage > 1`
  - Added server-side page clamping: when `currentPage > totalPages` and `totalPages > 0`, server re-fetches the last valid page
  - Added `redirect()` in page component when server clamped the page, keeping URL in sync
- **Profile page** (`ProfileContent.tsx`): Added `refetch` from `authClient.useSession()` and calls `await refetch()` after successful avatar upload so `session.user.image` updates immediately in the UI (previous)
- **Avatar upload** (`uploadAvatar.ts`): Added cleanup of previous avatar file from S3 storage (previous)
- **AGENTS.md**: Added nextjs-agent-rules, form-patterns, bun, and Memory Bank sections (previous)
- **Admin tables** (`users-columns.tsx`, `wallpapers-columns.tsx`): Refactored loading state from single `string | null` to `Set<string>` (previous)

## Next Steps

- Awaiting user direction

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
- **Admin sorting is URL-driven**: sort state lives in `searchParams` (`?sort=X&order=Y`), not in component state. The `DataTable` component supports `manualSorting` prop that skips `getSortedRowModel()` and uses controlled `sorting`/`onSortingChange` props. Sorting changes navigate via `router.push`, causing a server re-render with correctly sorted data.
- **Pagination preserves sort**: Previous/Next links include current `sort`/`order` params so the sort state persists across page navigation.
- **Server-side page clamping**: When `currentPage` exceeds `totalPages` (e.g., after deleting last items on a page), `getAllWallpapersAdmin` clamps to the last valid page. The page component then redirects to sync the URL.

## Considerations

- Email verification is currently disabled (`requireEmailVerification: false`) — should be enabled for production
- `prismaAdapter(prisma, { provider: "sqlite" })` uses "sqlite" string despite being PostgreSQL — this works with Prisma's adapter but should be noted
- Rate limiting is configured but could be tuned further based on usage patterns

## Learnings
