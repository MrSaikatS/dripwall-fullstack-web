# Progress: DripWall

## What Works

### Authentication

- [x] Better Auth configuration (Prisma adapter, SQLite, Argon2 hashing)
- [x] Email/password registration (`authClient.signUp.email()`)
- [x] Email/password login (`authClient.signIn.email()`)
- [x] Session management (7-day expiry, daily refresh, cookie cache)
- [x] Logout functionality
- [x] Session-aware UI (AuthHeader shows logged-in vs logged-out state)
- [x] Rate limiting per-endpoint (login: 10/5min, register: 5/10min, reset: 3/15min)
- [x] Admin plugin (role field, user banning, impersonation)
- [x] Remember me functionality
- [x] **Login returnTo flow** — `/login?returnTo=/upload` redirects after successful auth
- [x] **Open redirect prevention** — `returnTo` validated as relative path via `URL.canParse()`

### UI Components

- [x] Button (with variants: default, outline, secondary, ghost, destructive, link)
- [x] Card (with Header, Title, Description, Content, Footer, Action)
- [x] Field system (Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet, etc.)
- [x] Input (with Base UI primitive)
- [x] Label
- [x] Separator
- [x] Skeleton (loading placeholder)
- [x] Avatar (with Image, Fallback, Badge, Group)
- [x] Badge
- [x] Dialog
- [x] Dropdown Menu
- [x] Select
- [x] Textarea
- [x] **Sidebar** (shadcn — 726 lines, with variants, collapsible, mobile support)
- [x] **Sheet** (Base UI Dialog-based, side variants)
- [x] **Tooltip** (Base UI Tooltip-based)
- [x] Header with auth-aware navigation
- [x] Theme toggle (dark/light with animated icons)
- [x] **Dashboard AppSidebar** (collapsible, with Overview/My Wallpapers/Liked Wallpapers nav)
- [x] **AdminSidebar** (collapsible, with Overview/Users/Wallpapers/Categories nav + Dashboard link)
- [x] **Dashboard MobileNav** (fixed bottom nav, hidden on desktop)
- [x] **Admin MobileNav** (fixed bottom nav, hidden on desktop)
- [x] `use-mobile` hook for responsive breakpoint detection

### Forms (Zod + react-hook-form + Controller pattern)

- [x] Login form (with returnTo redirect support, open redirect validation)
- [x] Register form (with confirm password validation)
- [x] Forgot password form
- [x] Reset password form (with confirm password validation)
- [x] Wallpaper upload form (with file picker, category select, title, description)
- [x] Collection form (name, description, visibility)

### Pages

- [x] Home page (hero-only, session-aware CTA: Upload redirects to login if unauthenticated)
- [x] Login page (supports `?returnTo=` query param, open redirect safe)
- [x] Register page
- [x] Forgot Password page (implemented)
- [x] Reset Password page
- [x] Upload page (auth-guarded, with category list from DB)
- [x] Categories listing page
- [x] Category detail page (wallpapers by category with pagination)
- [x] Collections listing page (auth-guarded)
- [x] Collection detail page (auth-guarded, with wallpaper grid)
- [x] Dashboard overview page (auth-guarded, with stats cards)
- [x] Dashboard wallpapers page (auth-guarded, paginated grid)
- [x] Dashboard likes page (auth-guarded, paginated grid)

### API Routes

- [x] `/api/auth/[...all]` — Better Auth handler
- [x] `/api/images/[...key]` — S3 image proxy with auth-based access control (public/private wallpapers, streaming, cache headers, error differentiation)

### Infrastructure

- [x] TypeScript strict mode configuration
- [x] ESLint (Next.js core-web-vitals + TypeScript)
- [x] Prettier (with Tailwind CSS plugin)
- [x] Environment variable validation (T3 Env) — server + client
- [x] CSS variables for light/dark theme
- [x] Font configuration (Geist sans)
- [x] Path aliases (`@/*`, `@generated/*`)

### Database

- [x] Prisma schema with all models
- [x] Neon PostgreSQL serverless database configured
- [x] Prisma 7 with PrismaNeon adapter
- [x] PostgreSQL migrations applied
- [x] Seed script (admin/demo users, categories, tags via Postgres)

### Dependencies (Phase 0)

- [x] shadcn components installed: dropdown-menu, dialog, badge, select, textarea, **sidebar, sheet, tooltip**
- [x] npm packages installed: @aws-sdk/client-s3, @aws-sdk/s3-request-presigner
- [x] Neon adapter installed: `@neondatabase/serverless`, `@prisma/adapter-neon`
- [x] serverEnv.ts configured with Backblaze B2 env vars
- [x] clientEnv.ts configured with NEXT_PUBLIC_S3_PUBLIC_URL

### Shared Types & Utilities

- [x] `PageParams<T>` generic type for route params
- [x] `PaginatedResponse<T>` and `ApiResponse<T>` response types
- [x] `WallpaperUploadFormType` with title, description, categoryId, tags
- [x] `CollectionCreateFormType` with name, description, isPublic
- [x] `cn()` / `slugify()` in `utils.ts`
- [x] `resolveImageUrl()` / `extractS3Key()` in `resolveImageUrl.ts`

## What's Left to Build

### Phase 1: Image Processing + S3 Storage ✅ Complete

- [x] Create `src/lib/imageProcessor.ts` (Sharp resize/thumbnail/metadata extraction)
- [x] Create `src/lib/fileStorage.ts` (S3 upload/delete/signed URL)

### Phase 2: Wallpaper Upload ✅ Complete

- [x] Create `src/app/(private)/upload/page.tsx` — server component fetching categories
- [x] Create `src/components/Wallpaper/WallpaperUploadForm.tsx` — upload form with file picker + metadata
- [x] Create `src/app/(private)/layout.tsx` — auth guard redirect
- [x] Create `src/server/wallpaper/createWallpaper.ts` — server action (Sharp → S3 → DB)
- [x] Add `wallpaperUploadSchema` to `src/lib/zodSchema.ts`
- [x] Add generic types to `src/lib/types.ts`
- [x] Remove `.gitkeep` files
- [x] Lint verified — 0 errors, 0 warnings

### Phase 3: Wallpaper Browsing & Detail ✅ Complete

- [x] Create `src/app/(public)/wallpapers/page.tsx`
- [x] Create `src/components/Wallpaper/WallpapersPageContent.tsx`
- [x] Create `src/components/Wallpaper/WallpaperGrid.tsx`
- [x] Create `src/components/Wallpaper/WallpaperCard.tsx`
- [x] Create `src/components/Wallpaper/Pagination.tsx`
- [x] Create `src/app/(public)/wallpapers/[id]/page.tsx`
- [x] Create `src/components/Wallpaper/WallpaperDetail.tsx`
- [x] Create `src/components/Wallpaper/LikeButton.tsx`
- [x] Create `src/components/Wallpaper/DownloadButton.tsx`
- [x] Create server actions: likeWallpaper, downloadWallpaper, getWallpapers, getWallpaperById, getFeaturedWallpapers
- [x] Lint verified — 0 errors, 0 warnings

### Phase 4: Categories ✅ Complete

- [x] Create `src/app/(public)/categories/page.tsx` — Browse all categories
- [x] Create `src/app/(public)/categories/[slug]/page.tsx` — Wallpapers by category with pagination
- [x] Create `src/components/Category/CategoryCard.tsx` — Card with image/fallback icon + count badge
- [x] Create `src/components/Category/CategoryGrid.tsx` — Responsive grid with empty state
- [x] Create `src/components/Category/CategoryWallpapersContent.tsx` — Wallpaper grid + pagination
- [x] Create `src/server/category/getCategories.ts` — List categories with wallpaper counts
- [x] Create `src/server/category/getCategoryBySlug.ts` — Category detail with paginated wallpapers
- [x] Add `categoryCreateSchema` to `src/lib/zodSchema.ts`
- [x] Configure `images.remotePatterns` in `next.config.ts`
- [x] Lint verified — 0 errors, 0 warnings
- [x] Build verified — 11 pages generated (including `/categories` and `/categories/[slug]`)

### Phase 5: Collections ✅ Complete

- [x] Add `collectionCreateSchema` to `src/lib/zodSchema.ts`
- [x] Create `src/server/collection/getCollections.ts` — List user collections
- [x] Create `src/server/collection/getCollectionById.ts` — Collection detail with wallpapers (resolved image URLs)
- [x] Create `src/server/collection/createCollection.ts` — Create collection
- [x] Create `src/server/collection/updateCollection.ts` — Update collection
- [x] Create `src/server/collection/deleteCollection.ts` — Delete collection
- [x] Create `src/server/collection/addToCollection.ts` — Add wallpaper to collection
- [x] Create `src/server/collection/removeFromCollection.ts` — Remove wallpaper from collection
- [x] Create `src/components/Collection/CollectionCard.tsx` — Collection card component
- [x] Create `src/components/Collection/CollectionForm.tsx` — Create/edit form
- [x] Create `src/components/Collection/AddToCollectionModal.tsx` — Dialog modal for saving wallpapers
- [x] Create `src/app/(private)/collections/page.tsx` — Collections listing page
- [x] Create `src/app/(private)/collections/CollectionsPageContent.tsx` — Client interactive content
- [x] Create `src/app/(private)/collections/[id]/page.tsx` — Collection detail page
- [x] Create `src/app/(private)/collections/[id]/CollectionDetailContent.tsx` — Detail client content
- [x] Lint verified — 0 errors, 0 warnings

### Phase 6: User Dashboard ✅ Complete

- [x] Create `src/server/user/getUserWallpapers.ts` — Paginated user uploads (session-aware, resolved URLs)
- [x] Create `src/server/user/getUserLikes.ts` — Paginated user likes (session-aware, resolved URLs)
- [x] Create `src/server/user/getUserDownloads.ts` — Paginated user downloads (session-aware, resolved URLs)
- [x] Create `src/components/Dashboard/DashboardNav.tsx` — Sidebar nav with active state (superseded by shadcn Sidebar)
- [x] Create `src/app/(private)/dashboard/layout.tsx` — shadcn Sidebar layout with AppSidebar + MobileNav
- [x] Create `src/app/(private)/dashboard/page.tsx` — Overview page with DashboardOverviewContent
- [x] Create `src/app/(private)/dashboard/DashboardOverviewContent.tsx` — Stats cards (wallpapers, likes, downloads, collections)
- [x] Create `src/app/(private)/dashboard/wallpapers/page.tsx` — Wallpapers listing page
- [x] Create `src/app/(private)/dashboard/wallpapers/DashboardWallpapersContent.tsx` — Paginated wallpaper grid with empty state
- [x] Create `src/app/(private)/dashboard/likes/page.tsx` — Liked wallpapers page
- [x] Create `src/app/(private)/dashboard/likes/DashboardLikesContent.tsx` — Paginated likes grid with empty state
- [x] **Refactored to shadcn Sidebar**: AppSidebar + MobileNav replacing custom DashboardNav

### Phase 7: Navigation Update ✅ Complete

- [x] Refactor `src/components/Header/Header.tsx` with shadcn DropdownMenu — inline session, avatar + DropdownMenu for authenticated users, nav links (Wallpapers, Categories, Upload, Collections, Admin), logout with spinner
- [x] Simplify `src/components/Auth/AuthHeader.tsx` — presentational sign-in/sign-up links only (no session logic)
- [x] Change "Profile" dropdown item to "My Wallpapers" linking to `/dashboard/wallpapers`
- [x] Lint verified — 0 errors, 0 warnings

### Phase 8: Admin Panel ✅ Complete

- [x] Create admin overview page — `src/app/(private)/admin/page.tsx` (stats cards: users, wallpapers, categories, downloads)
- [x] Create user management page — `src/app/(private)/admin/users/page.tsx` (uses `auth.api.listUsers()` + `UserTable`)
- [x] Create category management page — `src/app/(private)/admin/categories/page.tsx` + `CategoryManager.tsx`
- [x] Create wallpaper management page — `src/app/(private)/admin/wallpapers/page.tsx` + `AdminWallpapersContent.tsx`
- [x] Create UserTable component — `src/components/Admin/UserTable.tsx`
- [x] Create admin server actions: `getAdminStats`, `getAllWallpapersAdmin`, `toggleFeatured`, `deleteWallpaperAdmin`, `createCategory`, `updateCategory`, `deleteCategory`
- [x] Create `AdminSidebar` component — refactored to shadcn Sidebar with MobileNav
- [x] Create admin layout with role guard + shadcn Sidebar
- [x] Lint verified — 0 errors, 0 warnings
- [x] Build verified — 4 new admin routes generated

### Phase 9: Polish & Cleanup ✅ Complete

- [x] Remove `.gitkeep` files
- [x] Run `bun run lint` — 0 errors, 0 warnings
- [x] Run `bun run build` — 18 pages generated, all dynamic
- [x] Fix any issues

### Post-Phase 9: SEO & Refactoring ✅ Complete

- [x] Add template-based metadata to root layout (`"%s | DripWall"`)
- [x] Add `generateMetadata` to dynamic pages (wallpaper detail, category detail, collection detail)
- [x] Add static metadata to all remaining pages (login, register, forgot-password, reset-password, upload, etc.)
- [x] Polish home page UI (centered hero, larger headings, backdrop-blur header, CTA buttons with `size="lg"`)
- [x] Polish upload form (image preview with `next/image`, replace `SelectValue` with custom `data-slot` pattern)
- [x] Simplify header dropdown (removed Upload/Collections links, added chevron icon, backdrop-blur)
- [x] Resize theme toggle icons from 28px to 20px
- [x] Extract `slugify` to `src/lib/utils.ts` from admin server actions
- [x] Sanitize admin server action error messages to generic text

### Post-Phase 9: Layout & Sidebar Refactor ✅ Complete

- [x] **Layout restructure**: Remove `100dvw` breakout hack; move `max-w-7xl` from root `<main>` to `(public)/layout.tsx`
- [x] **shadcn Sidebar**: Install sidebar, sheet, tooltip components
- [x] **Dashboard layout**: Refactor to shadcn Sidebar with collapsible AppSidebar + MobileNav
- [x] **Admin layout**: Refactor to shadcn Sidebar with collapsible AdminSidebar + MobileNav
- [x] **Delete implementation_plan.md** (outdated)

### Post-Phase 9: S3 Image Proxy ✅ Complete

- [x] **Create `/api/images/[...key]` route**: Streams images from S3 with auth-based access control
- [x] **Create `resolveImageUrl.ts`**: Utility for converting S3 keys to proxy URLs
- [x] **Update server actions**: All image URLs resolved through `resolveImageUrl()` before returning to client
- [x] **Update `fileStorage.ts`**: `uploadFile()` returns proxy-compatible paths

### Post-Phase 9: returnTo + Home Session ✅ Complete

- [x] **Login page/LoginForm**: Added `searchParams` support for `?returnTo=` redirect param
- [x] **Home page**: Session-aware CTA — redirects unauthenticated users to login with returnTo
- [x] **Image proxy**: Added auth guard for private wallpapers (session + ownership check), streaming response, cache headers (public immutable vs private short-lived), 404/500 error differentiation
- [x] **Header**: Changed "Profile" to "My Wallpapers" linking to `/dashboard/wallpapers`
- [x] **resolveImageUrl.ts**: URI encoding for S3 keys, fixed S3 public URL extraction

### Security Fixes ✅ Complete

- [x] **Open redirect prevention**: `returnTo` validated using `URL.canParse()` — only relative paths starting with `/` are allowed
- [x] **S3 key matching fix**: Image proxy uses `endsWith()` instead of `includes()` to prevent false-positive matches on partial key prefixes

### All Changes Committed ✅

- [x] All previously uncommitted changes now committed in `8f7e4dd`
- [x] Security fixes committed in `de32e4b`
- [x] Merged to main via PR #16 (`f9a56e6`)
- [x] No uncommitted changes remaining

### Future Considerations

- [ ] **OAuth providers** (Google, GitHub login via Better Auth)
- [ ] **Image CDN** (optimized image delivery)
- [ ] **Rate limiting to Redis** (persistent rate limits across server restarts)
- [ ] **Unit/E2E tests**
- [ ] **CI/CD pipeline**
- [ ] **Image proxy**: Add `stale-while-revalidate` cache pattern
- [ ] **Image proxy**: On-the-fly resizing with Sharp

## Current Status

- **Phase**: 9 (Polish & Cleanup) — ✅ Complete
- **Auth**: ✅ Complete (core flow functional + returnTo redirect + open redirect prevention)
- **Implementation Plan**: ✅ Complete
- **UI**: ✅ All 16 shadcn components installed (13 core + sidebar, sheet, tooltip)
- **Database**: ✅ Schema defined, seeded
- **S3 Storage Deps**: ✅ @aws-sdk/client-s3 + @aws-sdk/s3-request-presigner installed
- **Env Vars**: ✅ Server + client env configured for S3
- **Image Processor**: ✅ Complete (Phase 1)
- **Image Proxy**: ✅ Complete — auth-guarded S3 proxy route with streaming, cache headers, error handling, secure key matching
- **File Storage**: ✅ Complete (Phase 1, updated for proxy URLs)
- **Shared Types & Utils**: ✅ Complete (including resolveImageUrl)
- **Wallpaper Upload**: ✅ Complete (Phase 2)
- **Private Route Guard**: ✅ Complete (layout-level auth check)
- **Wallpaper Browsing & Detail**: ✅ Complete (Phase 3, resolved URLs)
- **Categories**: ✅ Complete (Phase 4)
- **Collections**: ✅ Complete (Phase 5)
- **Dashboard**: ✅ Complete (Phase 6, refactored to shadcn Sidebar)
- **Navigation Update**: ✅ Complete (Phase 7)
- **Admin Panel**: ✅ Complete (Phase 8, refactored to shadcn Sidebar)
- **Polish & Cleanup**: ✅ Complete (Phase 9)
- **SEO Metadata**: ✅ Complete
- **Layout Refactor**: ✅ Complete — shadcn Sidebar for admin/dashboard, public max-w-7xl, no breakout hack
- **S3 Image Proxy**: ✅ Complete
- **Login returnTo**: ✅ Complete
- **Home session CTAs**: ✅ Complete
- **Open redirect prevention**: ✅ Complete
- **All changes committed**: ✅ Complete — no uncommitted changes
- **Git Branch**: `maintenance` (merged to main via PR #16)
- **Testing**: ❌ None
- **Production Deploy**: ❌ Not configured

## Known Issues

1. **Email Verification**: Disabled (TODO in auth.ts line 28)
2. **Password Reset**: Uses console-based token display (no email sending service configured)
3. **Rate Limiting**: In-memory, resets on server restart
4. **Upload redirect**: Currently navigates to `/` after upload; should navigate to `/wallpapers/[id]`
5. **No E2E tests**: Manual verification only
6. **No OAuth providers**: Email/password only

## Evolution of Project Decisions

### Why Better Auth over NextAuth/Auth.js?

- Modern library with TypeScript-first design
- Built-in admin plugin for role management
- Argon2 support out of the box
- Simpler API surface for email/password auth

### Why Prisma 7 + LibSQL + SQLite?

- Prisma 7 introduces driver adapters for better database compatibility
- LibSQL provides SQLite-compatible driver with fewer dependencies
- SQLite is ideal for development (zero configuration, file-based)
- Easy to swap to PostgreSQL/MySQL later by changing the adapter

### Why Migrate to Neon PostgreSQL?

- Neon provides serverless PostgreSQL with automatic scalability
- Compatible with Prisma via `@prisma/adapter-neon` driver adapter
- Built-in connection pooling and autoscaling for production workloads
- Production-grade reliability without managing database infrastructure
- Easy migration path from SQLite using standard Prisma migrations

### Why shadcn Nova (Base UI) over Radix UI?

- shadcn Nova style is the latest shadcn evolution
- Base UI provides modern React primitives with better accessibility
- Smaller bundle size compared to Radix UI
- Customizable field system with proper form validation UX

### Why Controller pattern over register() in react-hook-form?

- Fine-grained re-renders (only the specific field re-renders)
- Better TypeScript inference
- Explicit control over field state and error display
- Consistent with shadcn form examples

### Why Use Better Auth Admin API Instead of Custom Server Actions for User Management?

- Better Auth's admin plugin already provides full user CRUD with built-in pagination, search, filtering, and session revocation
- Avoids duplicating logic that Better Auth handles
- Custom server actions only needed for domain-specific operations

### Why node:crypto.randomUUID() instead of the uuid package?

- Node.js 22+ has built-in `randomUUID()` via `node:crypto`
- Avoids an extra dependency
- Same API as `uuid.v4()`

### Why template-based metadata in root layout?

- Eliminates repetition — each page only specifies its name
- Dynamic pages use `generateMetadata` to fetch entity names from DB
- SEO improvement without adding boilerplate

### Why sanitize error messages in server actions?

- Prevents leaking implementation details to end users
- Original errors still logged to `console.error()` for debugging
- Consistent user experience with generic fallback messages

### Why shadcn Sidebar for admin/dashboard layouts?

- Provides consistent, accessible navigation pattern
- Built-in collapsible behavior with cookie-persisted state
- Responsive: desktop sidebar + mobile sheet + bottom nav
- Reusable components with proper ARIA attributes
- Keyboard shortcut support (Ctrl+B to toggle)

### Why S3 image proxy instead of direct S3 URLs?

- Enables auth-based access control for private wallpapers
- Cache control differentiation (public immutable vs private short-lived)
- Consistent URL scheme (no dependency on S3_PUBLIC_URL being accessible)
- Future-proof for on-the-fly image transformation
