# Active Context: DripWall

## Current Work Focus

Phase 3 (Wallpaper Browsing & Detail) is now **complete**. The project is ready to begin Phase 4 (Categories).

### Completed in Phase 3:

- ✅ `src/server/wallpaper/getWallpapers.ts` — Paginated wallpaper listing with search, sort, category/tag filter, featured filter, Prisma compound index usage
- ✅ `src/server/wallpaper/getWallpaperById.ts` — Single wallpaper with full relations (user, category, tags, like count)
- ✅ `src/server/wallpaper/getFeaturedWallpapers.ts` — Featured wallpapers query
- ✅ `src/server/wallpaper/likeWallpaper.ts` — Like/unlike toggle with session check
- ✅ `src/server/wallpaper/downloadWallpaper.ts` — Signed URL generation via S3, download count increment, optional logged-in tracking
- ✅ `src/components/Wallpaper/WallpaperGrid.tsx` — Responsive CSS grid with empty state
- ✅ `src/components/Wallpaper/WallpaperCard.tsx` — Card with thumbnail, aspect-ratio, avatar, badge, like count
- ✅ `src/components/Wallpaper/WallpaperDetail.tsx` — Full detail with image, metadata grid (uploader, dimensions, file size, format, views, date, category), tags, like/download buttons
- ✅ `src/components/Wallpaper/Pagination.tsx` — Pagination component with prev/next navigation
- ✅ `src/components/Wallpaper/LikeButton.tsx` — Optimistic like toggle with error handling
- ✅ `src/components/Wallpaper/DownloadButton.tsx` — Download trigger via signed URL with anchor element
- ✅ `src/app/(public)/wallpapers/page.tsx` — Server component with search params → initial data + Suspense
- ✅ `src/app/(public)/wallpapers/WallpapersPageContent.tsx` — Client component with search input, sort select, grid, pagination
- ✅ `src/app/(public)/wallpapers/[id]/page.tsx` — Detail page with view count increment, like status check, notFound handling
- ✅ Lint verified — zero errors, zero warnings

## Recent Changes

- **Phase 0 complete**: All dependencies installed and configured
- **Implementation plan audited** against Better Auth, Prisma 7, and shadcn best practices (previous session)
- **4 duplicate admin server actions removed** from plan — admin user management uses Better Auth's built-in `auth.api.*` methods
- **Implementation plan** (`implementation_plan.md`) covers 10 phases (Phase 0 complete, Phases 1-9 pending)

## Next Steps

### Phase 3: Wallpaper Browsing & Detail (immediate)

- Create listing/grid/card/pagination components
- Create detail page with LikeButton and DownloadButton
- Create server actions for wallpaper queries, likes, downloads

### Phase 4: Categories

- Browse pages, CategoryCard component

### Phase 5: Collections

- CRUD pages, CollectionForm, AddToCollectionModal
- 7 collection server actions

### Phase 6: User Dashboard

- Dashboard pages (uploads, likes, downloads)
- DashboardNav, user server actions

### Phase 7: Navigation Update

- Header refactor with shadcn DropdownMenu
- Simplify AuthHeader

### Phase 8: Admin Panel

- Admin pages for user/wallpaper/category management
- Uses Better Auth admin plugin API for user management
- Custom server actions for wallpaper and category management

### Phase 9: Polish & Cleanup

- Remove .gitkeep files, lint, build

## Active Decisions & Considerations

### Server Actions Architecture (No API Routes)

All operations use `"use server"` functions in `src/server/{domain}/{action}.ts` files. This leverages Next.js 16's server action capabilities, including file upload handling via `arrayBuffer()`. No `src/app/api/*` files beyond the existing Better Auth route handler.

### Better Auth Admin API vs Custom Server Actions

User management operations (`listUsers`, `setRole`, `banUser`, `unbanUser`) should use Better Auth's built-in admin plugin API (`auth.api.*`) rather than custom server actions.

Custom server actions are still needed for:

- Wallpaper management (CRUD, likes, downloads)
- Collection management (CRUD, add/remove items)
- Category management (CRUD — admin only)
- Dashboard data (user wallpapers, likes, downloads)

### Image Storage: Backblaze B2 via S3 API

- Using `@aws-sdk/client-s3` v3 with Backblaze B2's S3-compatible API
- Sharp for image processing (resize, WebP thumbnail, metadata extraction)
- Signed URLs for secure downloads via `@aws-sdk/s3-request-presigner`
- File naming: `wallpapers/{userId}/{uuid}-{original-name}`

### Private Route Guard

- Layout-level auth check in `src/app/(private)/layout.tsx`
- Uses `auth.api.getSession({ headers: await headers() })` for server-side validation
- No middleware/proxy needed — per-page auth checks in the layout

### Forgot Password Implementation

- Implemented using Better Auth's built-in `forgetPassword`/`resetPassword` via the email/password plugin
- Reset token generated and stored by Better Auth, with configurable expiration
- Currently logs reset token to console (no email sending service configured yet)

### Email Verification

- Better Auth supports email verification via `sendVerificationEmail`
- Requires email transport configuration
- Currently disabled to simplify development

## Important Patterns & Preferences

### Code Style

- Single attribute per line in JSX (Prettier config)
- Bracket same line for objects
- Experimental ternaries enabled
- Tailwind CSS classes sorted via prettier-plugin-tailwindcss
- Use `@base-ui/react` primitives (not native HTML elements for interactive components)

### Form Pattern

- Always use `react-hook-form` with `zodResolver`
- `Controller` pattern for all fields (not register)
- `mode: "all"` for real-time validation
- `noValidate` on `<form>` element
- `<Field>` wrapper with `data-invalid` attribute
- `<FieldError>` component with `role="alert"`

### Error Handling

- try/catch in async handlers
- `toast.error()` for user-facing errors
- `console.error()` for debugging
- Graceful fallback messages for network errors

## Learnings & Insights

- Better Auth's `nextCookies()` plugin handles cookie management automatically
- Better Auth admin plugin provides full user management API — no need for custom CRUD wrappers
- Prisma 7 requires explicit driver adapter initialization (PrismaLibSql)
- The `admin()` plugin adds `role`, `banned`, `banReason`, `banExpires` fields to User model
- shadcn Nova style uses `data-slot` attributes for component styling
- Tailwind CSS 4 uses `@import` instead of `@tailwind` directives, and `@custom-variant` instead of `@variants`
- React Compiler requires `babel-plugin-react-compiler` dev dependency
- Zod v4 API differs from v3: uses object-style errors `{ error: "message" }` instead of string messages
- S3-compatible storage (Backblaze B2) works with standard `@aws-sdk/client-s3` v3 — no custom SDK needed
- Server actions can handle file uploads via `file.arrayBuffer()` pattern
- Session access pattern: `auth.api.getSession({ headers: await headers() })` works in both server components and server actions
