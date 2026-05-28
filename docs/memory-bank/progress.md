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
- [x] Header with auth-aware navigation
- [x] Theme toggle (dark/light with animated icons)

### Forms (Zod + react-hook-form + Controller pattern)

- [x] Login form
- [x] Register form (with confirm password validation)
- [x] Forgot password form
- [x] Reset password form (with confirm password validation)

### Pages

- [x] Home page (landing hero)
- [x] Login page
- [x] Register page
- [x] Forgot Password page (implemented)
- [x] Reset Password page

### Infrastructure

- [x] TypeScript strict mode configuration
- [x] ESLint (Next.js core-web-vitals + TypeScript)
- [x] Prettier (with Tailwind CSS plugin)
- [x] Environment variable validation (T3 Env)
- [x] CSS variables for light/dark theme
- [x] Font configuration (Geist sans)
- [x] Path aliases (`@/*`, `@generated/*`)

### Database

- [x] Prisma schema with all models
- [x] SQLite database configured (dev.db)
- [x] Prisma 7 with LibSQL driver adapter
- [x] Database migrations applied
- [x] Seed script (admin user + demo user + categories + tags)

## What's Left to Build

### Phase 0: Dependency Setup

- [ ] Install shadcn components: dropdown-menu, dialog, badge, select, textarea
- [ ] Install npm packages: @aws-sdk/client-s3, @aws-sdk/s3-request-presigner
- [ ] Update serverEnv.ts with Backblaze B2 env vars
- [ ] Update clientEnv.ts with NEXT_PUBLIC_S3_PUBLIC_URL
- [ ] Run `bun run lint` to verify no errors

### Phase 1: Image Processing + S3 Storage

- [ ] Create `src/lib/imageProcessor.ts` (Sharp resize/thumbnail/metadata extraction)
- [ ] Create `src/lib/fileStorage.ts` (S3 upload/delete/signed URL)

### Phase 2: Wallpaper Upload

- [ ] Create `src/app/(private)/upload/page.tsx`
- [ ] Create `src/components/Wallpaper/WallpaperUploadForm.tsx`
- [ ] Create `src/app/(private)/layout.tsx` (auth guard)
- [ ] Create `src/server/wallpaper/createWallpaper.ts`

### Phase 3: Wallpaper Browsing & Detail

- [ ] Create `src/app/(public)/wallpapers/page.tsx`
- [ ] Create `src/components/Wallpaper/WallpaperGrid.tsx`
- [ ] Create `src/components/Wallpaper/WallpaperCard.tsx`
- [ ] Create `src/components/Wallpaper/Pagination.tsx`
- [ ] Create `src/app/(public)/wallpapers/[id]/page.tsx`
- [ ] Create `src/components/Wallpaper/WallpaperDetail.tsx`
- [ ] Create `src/components/Wallpaper/LikeButton.tsx`
- [ ] Create `src/components/Wallpaper/DownloadButton.tsx`
- [ ] Create server actions: likeWallpaper, downloadWallpaper, getWallpapers, getWallpaperById, getFeaturedWallpapers

### Phase 4: Categories

- [ ] Create `src/app/(public)/categories/page.tsx`
- [ ] Create `src/app/(public)/categories/[slug]/page.tsx`
- [ ] Create `src/components/Category/CategoryCard.tsx`

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

- [ ] Remove `.gitkeep` files
- [ ] Run `bun run lint`
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

- **Phase**: Implementation Planned (pre-build)
- **Auth**: ✅ Complete (core flow functional)
- **Implementation Plan**: ✅ Complete + Audited against Better Auth/Prisma/shadcn best practices
- **UI**: ⚠️ Core shadcn components built, 5 more needed
- **Database**: ✅ Schema defined, seeded
- **Wallpapers**: ❌ Not started (implementation plan ready)
- **Collections**: ❌ Not started (implementation plan ready)
- **Dashboard**: ❌ Not started (implementation plan ready)
- **Admin Panel**: ❌ Not started (implementation plan ready)
- **Testing**: ❌ None
- **Production Deploy**: ❌ Not configured

## Known Issues

1. **Email Verification**: Disabled (TODO in auth.ts line 28)
2. **Password Reset**: Uses console-based token display (no email sending service configured)
3. **SQLite**: Only suitable for development, not production
4. **Rate Limiting**: In-memory, resets on server restart
5. **Server Actions**: `src/server/` directory empty (no server actions yet)
6. **Custom Hooks**: `src/hooks/` directory empty (no custom hooks yet)

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
