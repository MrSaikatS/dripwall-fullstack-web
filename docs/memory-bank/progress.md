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
- [x] Header with auth-aware navigation
- [x] Theme toggle (dark/light with animated icons)

### Forms (Zod + react-hook-form + Controller pattern)

- [x] Login form
- [x] Register form (with confirm password validation)
- [x] Forgot password form
- [x] Reset password form (with confirm password validation)
- [x] Wallpaper upload form (with file picker, category select, title, description)

### Pages

- [x] Home page (landing hero)
- [x] Login page
- [x] Register page
- [x] Forgot Password page (implemented)
- [x] Reset Password page
- [x] Upload page (auth-guarded, with category list from DB)

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
- [x] SQLite database configured (dev.db)
- [x] Prisma 7 with LibSQL driver adapter
- [x] Database migrations applied
- [x] Seed script (admin user + demo user + categories + tags)

### Dependencies (Phase 0)

- [x] shadcn components installed: dropdown-menu, dialog, badge, select, textarea
- [x] npm packages installed: @aws-sdk/client-s3, @aws-sdk/s3-request-presigner
- [x] serverEnv.ts configured with Backblaze B2 env vars
- [x] clientEnv.ts configured with NEXT_PUBLIC_S3_PUBLIC_URL

### Shared Types

- [x] `PageParams<T>` generic type for route params
- [x] `PaginatedResponse<T>` and `ApiResponse<T>` response types
- [x] `WallpaperUploadFormType` with title, description, categoryId, tags

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
- [x] Create `src/app/(public)/wallpapers/WallpapersPageContent.tsx`
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

### Phase 5: Collections

- [ ] Create collection pages and components
- [ ] Create collection server actions (7 files)

### Phase 6: User Dashboard

- [ ] Create dashboard pages (3 pages)
- [ ] Create `src/components/Dashboard/DashboardNav.tsx`
- [ ] Create user server actions (3 files)

### Phase 7: Navigation Update

- [ ] Refactor `src/components/Header/Header.tsx` with shadcn DropdownMenu
- [ ] Simplify `src/components/Header/AuthHeader.tsx`

### Phase 8: Admin Panel

- [ ] Create admin overview page
- [ ] Create user management page (uses Better Auth admin plugin API)
- [ ] Create category management page + CategoryManager component
- [ ] Create wallpaper management page
- [ ] Create UserTable component
- [ ] Create admin server actions (getAllWallpapersAdmin, toggleFeatured, createCategory, updateCategory, deleteCategory)

### Phase 9: Polish & Cleanup

- [x] Remove `.gitkeep` files
- [x] Run `bun run lint` — 0 errors, 0 warnings
- [ ] Run `bun run build`
- [ ] Fix any issues

### Future Considerations

- [ ] **OAuth providers** (Google, GitHub login via Better Auth)
- [ ] **PostgreSQL/MySQL migration** (replace SQLite for production)
- [ ] **Image CDN** (optimized image delivery)
- [ ] **Rate limiting to Redis** (persistent rate limits across server restarts)
- [ ] **Unit/E2E tests**
- [ ] **CI/CD pipeline**

## Current Status

- **Phase**: 4 (Categories) — ✅ Complete
- **Auth**: ✅ Complete (core flow functional)
- **Implementation Plan**: ✅ Complete + Audited against Better Auth/Prisma/shadcn best practices
- **UI**: ✅ All 13 shadcn components installed and available
- **Database**: ✅ Schema defined, seeded
- **S3 Storage Deps**: ✅ @aws-sdk/client-s3 + @aws-sdk/s3-request-presigner installed
- **Env Vars**: ✅ Server + client env configured for S3
- **Image Processor**: ✅ Complete (Phase 1)
- **File Storage**: ✅ Complete (Phase 1)
- **Shared Types**: ✅ Complete (PageParams, ApiResponse types + wallpaper upload schema + category create schema)
- **Wallpaper Upload**: ✅ Complete (Phase 2) — server action, form, auth-guarded page
- **Private Route Guard**: ✅ Complete (layout-level auth check)
- **Wallpaper Browsing & Detail**: ✅ Complete (Phase 3) — listing, search, sort, pagination, detail view, likes, downloads
- **Categories**: ✅ Complete (Phase 4) — browse all categories, wallpapers by category, pagination
- **Collections**: ❌ Not started
- **Dashboard**: ❌ Not started
- **Admin Panel**: ❌ Not started
- **Testing**: ❌ None
- **Production Deploy**: ❌ Not configured

## Known Issues

1. **Email Verification**: Disabled (TODO in auth.ts line 28)
2. **Password Reset**: Uses console-based token display (no email sending service configured)
3. **SQLite**: Only suitable for development, not production
4. **Rate Limiting**: In-memory, resets on server restart
5. **Upload redirect**: Currently navigates to `/` after upload; should navigate to `/wallpapers/[id]` (once available)
6. **No admin category CRUD yet** — Categories were seeded by the seed script; admin create/edit/delete will be added in Phase 8 (Admin Panel).

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

- Better Auth's admin plugin (`auth.api.listUsers()`, `auth.api.setRole()`, `auth.api.banUser()`, `auth.api.unbanUser()`) already provides full user CRUD with built-in pagination, search, filtering, and session revocation
- Avoids duplicating logic that Better Auth handles (auth checks, session invalidation on ban, etc.)
- Custom server actions only needed for domain-specific operations (wallpaper/collection/category management) not covered by Better Auth

### Why node:crypto.randomUUID() instead of the uuid package?

- Node.js 22+ has built-in `randomUUID()` via `node:crypto`
- Avoids an extra dependency
- Same API as `uuid.v4()` — returns a random UUID string
- Used in `createWallpaper.ts` for generating unique file identifiers
