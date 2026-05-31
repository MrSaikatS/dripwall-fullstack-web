# Implementation Plan

[Overview]
Complete the DripWall full-stack wallpaper sharing platform by implementing all remaining features: wallpaper browsing/search, image upload with Sharp optimization + S3-compatible cloud storage, collections, likes/downloads, user dashboard, and admin panel.

The project currently has authentication fully implemented (login, register, forgot/reset password) with Next.js 16 + Better Auth + Prisma 7 (SQLite) + Tailwind CSS 4. The database schema defines all necessary models (Wallpaper, Category, Tag, Collection, Like, Download, etc.) but no feature pages or API routes exist beyond auth. This implementation will build the complete wallpaper platform using S3-compatible cloud storage (Backblaze B2 via S3 API) for images optimized/transformed via Sharp, console-level dev email logging, shadcn/ui components throughout, and the established form/component patterns.

**Current Status (as of 2026-06-01):**

**Completed (All Phases 0-7):**

- Phase 0: ✅ Complete
- Phase 1: ✅ Complete
- Phase 2: ✅ Complete
- Phase 3: ✅ Complete
- Phase 4: ✅ Complete
- Phase 5: ✅ Complete
- Phase 6: ✅ Complete
- Phase 7: ✅ Complete
- Lint: ✅ Verified

**Remaining:**

- Phase 8: Admin Panel — No admin pages
- Phase 9: Polish & Cleanup — Pending

## Phase 0 Status: ✅ COMPLETE

All Phase 0 dependency setup tasks have been completed:

- ✅ All 5 shadcn components installed: dropdown-menu, dialog, badge, select, textarea
- ✅ npm packages installed: @aws-sdk/client-s3 ^3.1056.0, @aws-sdk/s3-request-presigner ^3.1056.0
- ✅ serverEnv.ts configured with S3 env vars (S3_ENDPOINT, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET_NAME, S3_PUBLIC_URL)
- ✅ clientEnv.ts configured with NEXT_PUBLIC_S3_PUBLIC_URL

[Types]
New Zod schemas and TypeScript types will be added to support wallpaper management, collections, categories, and user interactions.

**Wallpaper Upload Schema** (`src/lib/zodSchema.ts`) ✅

- `title`: `z.string().trim().min(3).max(128)` ✅
- `description`: `z.string().max(500).optional()` ✅
- `categoryId`: `z.string().uuid()` ✅
- `tags`: `z.array(z.string().uuid())` (tag IDs) ✅

**Collection Schema** (`src/lib/zodSchema.ts`) ✅

- `name`: `z.string().trim().min(1).max(64)` ✅
- `description`: `z.string().max(300).optional()` ✅
- `isPublic`: `z.boolean()` ✅

**Category Create Schema** (`src/lib/zodSchema.ts`) ✅

- `name`: `z.string().trim().min(1).max(32)` ✅
- `description`: `z.string().max(300).optional()` ✅

**Update `LayoutChildrenProps`** in `src/lib/types.ts` ✅ — Already exports `PageParams` generic type

**API Route Response Types:** ✅ Already in `src/lib/types.ts`

```typescript
type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
```

**New route params type:** ✅ Already in `src/lib/types.ts`

```typescript
type PageParams<T extends Record<string, string>> = {
  params: Promise<T>;
};
```

[Files]
New files to be created and existing files to be modified across the entire application.

### New Files to Create

**Wallpaper Upload (all server actions — no API routes):**

- `src/app/(private)/upload/page.tsx` ✅
- `src/components/Wallpaper/WallpaperUploadForm.tsx` ✅

**Wallpaper Browsing:** ✅

- `src/app/(public)/wallpapers/page.tsx` ✅
- `src/components/Wallpaper/WallpaperGrid.tsx` ✅
- `src/components/Wallpaper/WallpaperCard.tsx` ✅
- `src/components/Wallpaper/Pagination.tsx` ✅

**Wallpaper Detail:** ✅

- `src/app/(public)/wallpapers/[id]/page.tsx` ✅
- `src/components/Wallpaper/WallpaperDetail.tsx` ✅
- `src/components/Wallpaper/LikeButton.tsx` ✅
- `src/components/Wallpaper/DownloadButton.tsx` ✅

**Categories:** ✅

- `src/app/(public)/categories/page.tsx` — Browse categories (server component, direct DB) ✅
- `src/app/(public)/categories/[slug]/page.tsx` — Wallpapers by category (server component + client interactive) ✅
- `src/components/Category/CategoryCard.tsx` — Category card with image and count ✅
- `src/components/Category/CategoryGrid.tsx` — Responsive grid with empty state ✅
- `src/components/Category/CategoryWallpapersContent.tsx` — Wallpaper grid + pagination ✅
- `src/server/category/getCategories.ts` — List categories with wallpaper counts ✅
- `src/server/category/getCategoryBySlug.ts` — Category detail + paginated wallpapers ✅
- `categoryCreateSchema` in `src/lib/zodSchema.ts` ✅

**Tags:**

- Tags handled inline via server actions in admin. No dedicated pages.

**Collections:** ✅ Complete

- `src/app/(private)/collections/page.tsx` — User's collections (server component + client interactions) ✅
- `src/app/(private)/collections/[id]/page.tsx` — Collection detail ✅
- `src/components/Collection/CollectionCard.tsx` — Collection card ✅
- `src/components/Collection/CollectionForm.tsx` — Create/edit collection form using server actions ✅
- `src/components/Collection/AddToCollectionModal.tsx` — Modal (shadcn Dialog) using server action ✅

**User Dashboard:** ✅ Complete

- `src/app/(private)/dashboard/layout.tsx` — Dashboard layout with sidebar ✅
- `src/app/(private)/dashboard/page.tsx` — User dashboard overview (client, ref-cancelled useEffect) ✅
- `src/app/(private)/dashboard/DashboardOverviewContent.tsx` — Stats cards (wallpapers, likes, downloads, collections) ✅
- `src/app/(private)/dashboard/wallpapers/page.tsx` — User's uploaded wallpapers ✅
- `src/app/(private)/dashboard/wallpapers/DashboardWallpapersContent.tsx` — Paginated wallpaper grid with empty state ✅
- `src/app/(private)/dashboard/likes/page.tsx` — User's liked wallpapers ✅
- `src/app/(private)/dashboard/likes/DashboardLikesContent.tsx` — Paginated likes grid with empty state ✅
- `src/components/Dashboard/DashboardNav.tsx` — Sidebar/nav for dashboard ✅

**Admin Panel:** ❌

- `src/app/(private)/admin/page.tsx` — Admin dashboard overview (server component)
- `src/app/(private)/admin/users/page.tsx` — User management using Better Auth's built-in admin API (`auth.api.listUsers()`, `auth.api.setRole()`, `auth.api.banUser()`, `auth.api.unbanUser()`) — no custom server actions needed for user CRUD
- `src/app/(private)/admin/categories/page.tsx` — Category management with server actions for CRUD
- `src/app/(private)/admin/wallpapers/page.tsx` — Wallpaper management (all)
- `src/components/Admin/UserTable.tsx` — User listing with ban/role actions (shadcn Table, DropdownMenu, Badge). Calls Better Auth admin API directly rather than custom server actions.
- `src/components/Admin/CategoryManager.tsx` — Category CRUD with shadcn Dialog forms using server actions

**Private Layout:** ✅

- `src/app/(private)/layout.tsx` — Auth-guarded layout with sidebar nav, redirects unauthenticated users ✅

**Server Actions (one file per action, each with `"use server"` directive):**

- `src/server/wallpaper/createWallpaper.ts` ✅
- `src/server/wallpaper/updateWallpaper.ts` ❌
- `src/server/wallpaper/deleteWallpaper.ts` ❌
- `src/server/wallpaper/likeWallpaper.ts` ✅
- `src/server/wallpaper/downloadWallpaper.ts` ✅
- `src/server/wallpaper/getWallpapers.ts` ✅
- `src/server/wallpaper/getWallpaperById.ts` ✅
- `src/server/wallpaper/getFeaturedWallpapers.ts` ✅
- `src/server/collection/createCollection.ts` ✅
- `src/server/collection/updateCollection.ts` ✅
- `src/server/collection/deleteCollection.ts` ✅
- `src/server/collection/addToCollection.ts` ✅
- `src/server/collection/removeFromCollection.ts` ✅
- `src/server/collection/getCollections.ts` ✅
- `src/server/collection/getCollectionById.ts` ✅
- ⚠️ **Not needed — use Better Auth admin plugin API directly:**
  - User management operations (`listUsers`, `setRole`, `banUser`, `unbanUser`) are built into Better Auth's `admin()` plugin and available via `auth.api.*` with session headers.
  - No separate server action files required — call `auth.api.listUsers()`, `auth.api.setRole()`, `auth.api.banUser()`, `auth.api.unbanUser()` directly from page/layout server components or client components with `headers: await headers()`.
- `src/server/admin/getAllWallpapersAdmin.ts` ❌
- `src/server/admin/toggleFeatured.ts` ❌
- `src/server/admin/createCategory.ts` ❌
- `src/server/admin/updateCategory.ts` ❌
- `src/server/admin/deleteCategory.ts` ❌
- `src/server/user/getUserWallpapers.ts` ✅
- `src/server/user/getUserLikes.ts` ✅
- `src/server/user/getUserDownloads.ts` ✅

**Image Upload & Storage:** ✅ **Complete**

- `src/lib/fileStorage.ts` — S3-compatible cloud storage client using `@aws-sdk/client-s3` (upload, delete, getSignedUrl) ✅
- `src/lib/imageProcessor.ts` — Sharp-based image processing (resize to multiple resolutions, generate WebP thumbnail, extract EXIF metadata: width, height, format, fileSize) ✅

**New shadcn components to add:** ✅ **Already installed**

- ~~`src/components/shadcnui/dropdown-menu.tsx`~~ ✅
- ~~`src/components/shadcnui/dialog.tsx`~~ ✅
- ~~`src/components/shadcnui/badge.tsx`~~ ✅
- ~~`src/components/shadcnui/select.tsx`~~ ✅
- ~~`src/components/shadcnui/textarea.tsx`~~ ✅

### Existing Files to Modify

- `src/lib/types.ts` — ✅ Already has `PageParams<T>` generic type and `PaginatedResponse<T>`, `ApiResponse<T>`
- `src/lib/zodSchema.ts` — ✅ Complete — has wallpaper upload + category + collection schemas
- ~~`src/lib/env/serverEnv.ts`~~ ✅ **Already configured** with S3/cloud storage env vars
- ~~`src/components/Header/Header.tsx`~~ ✅ **Refactored** — session-aware nav links (Wallpapers, Categories, Upload, Collections, Dashboard, Admin for admins) with DropdownMenu for authenticated user
- ~~`src/components/Auth/AuthHeader.tsx`~~ ✅ **Simplified** — presentational sign-in/sign-up links only

### Files to Delete/Move

- ~~`src/app/(private)/.gitkeep`~~ ✅ **Does not exist**
- ~~`src/hooks/.gitkeep`~~ ✅ **Does not exist**
- ~~`src/server/.gitkeep`~~ ✅ **Does not exist**

### New Environment Variables (`src/lib/env/serverEnv.ts`) ✅ **Already configured**

The following S3 env vars are already defined in `serverEnv.ts` and `clientEnv.ts`:

- `S3_ENDPOINT`: `z.string().url()`
- `S3_REGION`: `z.string().default("us-west-004")`
- `S3_ACCESS_KEY_ID`: `z.string().min(1)`
- `S3_SECRET_ACCESS_KEY`: `z.string().min(1)`
- `S3_BUCKET_NAME`: `z.string().min(1)`
- `S3_PUBLIC_URL`: `z.string().url().optional()`
- `NEXT_PUBLIC_S3_PUBLIC_URL`: In clientEnv.ts

File storage uses standard `@aws-sdk/client-s3` v3, which is fully compatible with Backblaze B2's S3 API. Images stored under `wallpapers/{userId}/{uuid}-{name}` and `wallpapers/{userId}/thumb-{uuid}-{name}` paths.

[Functions]
New and modified functions across server utilities and components.

### New Server Actions (one file per action)

**`src/server/wallpaper/` (each file exports a single function):**

- `createWallpaper.ts` — `createWallpaper(data: { title, description?, categoryId?, tags? }, userId: string, file: File)` → Sharp process (resize, thumbnail, metadata) → upload original + thumbnail to S3 → create DB record with URLs + metadata
- `updateWallpaper.ts` — `updateWallpaper(id: string, userId: string, data: Partial<WallpaperInput>)` → Update metadata only (not file)
- `deleteWallpaper.ts` — `deleteWallpaper(id: string, userId: string)` → Delete from S3 + DB, verify ownership or admin
- `likeWallpaper.ts` — `likeWallpaper(wallpaperId: string, userId: string)` → Toggle like (check if exists → create or delete)
- `downloadWallpaper.ts` — `downloadWallpaper(wallpaperId: string, userId?: string)` → Increment downloadCount, create Download record, return signed S3 URL
- `getWallpapers.ts` — `getWallpapers(params: { page, pageSize, categoryId?, tagId?, search?, sortBy?, isFeatured? })` → Paginated wallpaper list with Prisma queries, compound index usage
- `getWallpaperById.ts` — `getWallpaperById(id: string)` → Single wallpaper with user, category, tags, likes count, download count relations
- `getFeaturedWallpapers.ts` — `getFeaturedWallpapers(limit: number)` → Get featured wallpapers

**`src/server/collection/` (each file exports a single function):**

- `createCollection.ts` — `createCollection(data: CollectionInput, userId: string)` → Create collection ✅
- `updateCollection.ts` — `updateCollection(id: string, userId: string, data: Partial<CollectionInput>)` → Update ✅
- `deleteCollection.ts` — `deleteCollection(id: string, userId: string)` → Delete (verify ownership) ✅
- `addToCollection.ts` — `addToCollection(collectionId: string, wallpaperId: string)` → Add wallpaper (check duplicate) ✅
- `removeFromCollection.ts` — `removeFromCollection(collectionId: string, wallpaperId: string)` → Remove wallpaper ✅
- `getCollections.ts` — `getUserCollections(userId: string)` → Get user's collections with item count ✅
- `getCollectionById.ts` — `getCollectionById(id: string)` → Collection with items and wallpaper data ✅

**`src/server/admin/` (each file exports a single function):**

- ⚠️ **Not needed — use Better Auth admin plugin API directly:**
  - `auth.api.listUsers({ query: { limit, offset }, headers: await headers() })` — Built-in paginated user list with search, filter, sort (replaces `getAllUsers.ts`)
  - `auth.api.setRole({ body: { userId, role }, headers: await headers() })` — Built-in role change (replaces `updateUserRole.ts`)
  - `auth.api.banUser({ body: { userId, banReason?, banExpiresIn? }, headers: await headers() })` — Built-in ban with optional expiry + session revocation (replaces `banUser.ts`)
  - `auth.api.unbanUser({ body: { userId }, headers: await headers() })` — Built-in unban (replaces `unbanUser.ts`)
  - These all require admin authentication (handled automatically by Better Auth when session belongs to admin user).
  - Keep remaining admin server actions below for wallpaper and category management.
- `getAllWallpapersAdmin.ts` — `getAllWallpapersAdmin(page: number)` → All wallpapers including unlisted/private ❌
- `toggleFeatured.ts` — `toggleFeatured(wallpaperId: string)` → Toggle featured status ❌
- `createCategory.ts` — `createCategory(data: { name, slug, description? })` → Create category ❌
- `updateCategory.ts` — `updateCategory(id: string, data: Partial<CategoryInput>)` → Update category ❌
- `deleteCategory.ts` — `deleteCategory(id: string)` → Delete category (wallpapers get category set to null) ❌

**`src/server/user/` (each file exports a single function):**

- `getUserWallpapers.ts` — `getUserWallpapers(page: number)` → Paginated user uploads (session-aware, reads userId from headers) ✅
- `getUserLikes.ts` — `getUserLikes(page: number)` → Paginated user likes with wallpaper data (session-aware) ✅
- `getUserDownloads.ts` — `getUserDownloads(page: number)` → Paginated download history (session-aware) ✅

**`src/lib/fileStorage.ts`**

- `uploadFile(buffer: Buffer, key: string, contentType: string): Promise<string>` — Upload to S3 bucket, return public URL or CDN URL
- `deleteFile(key: string): Promise<void>` — Delete from S3
- `getSignedUrl(key: string, expiresIn?: number): Promise<string>` — Generate signed URL for download (expires in 60 min default)
- File naming: `wallpapers/{userId}/{uuid}-{original-name}`, thumbnails: `wallpapers/{userId}/thumb-{uuid}-{original-name}`

**`src/lib/imageProcessor.ts`**

- `processImage(buffer: Buffer): Promise<{ original: Buffer, thumbnail: Buffer, metadata: { width, height, format, fileSize } }>` — Use Sharp to:
  - Extract original dimensions, format, file size
  - Generate WebP thumbnail (max 400px width, quality 80)
  - Return both buffers + extracted metadata

### No API Routes

All operations use server actions (`"use server"` functions in `src/server/*.ts`). No `src/app/api/*` files are needed. This leverages Next.js 16's server action capabilities, including file upload handling via `arrayBuffer()` in server actions.

### Existing Function Modifications

**`src/components/Header/Header.tsx`** — Refactor to include:

- `<Link href="/wallpapers">Wallpapers</Link>` and `<Link href="/categories">Categories</Link>` (always visible)
- Conditionally authenticated: `<Link href="/upload">Upload</Link>`, `<Link href="/dashboard">Dashboard</Link>`
- Conditionally admin: `<Link href="/admin">Admin</Link>`
- Use shadcn DropdownMenu for user avatar with profile/LogoutButton actions
- Move `authClient.useSession()` call from AuthHeader into Header itself to have role data available

**`src/components/Header/AuthHeader.tsx`** — Simplify to just show skeleton/links. The session logic moves into Header.tsx.

[Classes]
No new classes. This project uses functional React components and server actions — no class-based architecture.

**New React Components:**

| Component                   | File                                                    | Purpose                        | shadcn Components Used                                         | Status |
| --------------------------- | ------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------- | ------ |
| `WallpaperGrid`             | `src/components/Wallpaper/WallpaperGrid.tsx`            | Responsive grid layout         | —                                                              | ✅     |
| `WallpaperCard`             | `src/components/Wallpaper/WallpaperCard.tsx`            | Card with thumbnail + metadata | Card, Badge, Skeleton                                          | ✅     |
| `WallpaperDetail`           | `src/components/Wallpaper/WallpaperDetail.tsx`          | Full wallpaper view            | Card, Badge, Separator, Avatar                                 | ✅     |
| `WallpaperUploadForm`       | `src/components/Wallpaper/WallpaperUploadForm.tsx`      | Upload form                    | Button, Input, Select, Textarea, Field, FieldLabel, FieldError | ✅     |
| `LikeButton`                | `src/components/Wallpaper/LikeButton.tsx`               | Heart toggle                   | Button                                                         | ✅     |
| `DownloadButton`            | `src/components/Wallpaper/DownloadButton.tsx`           | Download action                | Button                                                         | ✅     |
| `Pagination`                | `src/components/Wallpaper/Pagination.tsx`               | Page nav                       | Button                                                         | ✅     |
| `CategoryCard`              | `src/components/Category/CategoryCard.tsx`              | Category card                  | Card, Badge                                                    | ✅     |
| `CategoryGrid`              | `src/components/Category/CategoryGrid.tsx`              | Category grid                  | —                                                              | ✅     |
| `CategoryWallpapersContent` | `src/components/Category/CategoryWallpapersContent.tsx` | Category wallpaper listing     | WallpaperCard, Pagination                                      | ✅     |
| `CollectionCard`            | `src/components/Collection/CollectionCard.tsx`          | Collection card                | Card                                                           | ✅     |
| `CollectionForm`            | `src/components/Collection/CollectionForm.tsx`          | Create/edit form               | Dialog, Button, Input, Textarea, Field                         | ✅     |
| `AddToCollectionModal`      | `src/components/Collection/AddToCollectionModal.tsx`    | Collection selection modal     | Dialog, Button                                                 | ✅     |
| `DashboardNav`              | `src/components/Dashboard/DashboardNav.tsx`             | Sidebar navigation             | Button, Separator                                              | ✅     |
| `UserTable`                 | `src/components/Admin/UserTable.tsx`                    | User management table          | Table, DropdownMenu, Badge, Button                             | ❌     |
| `CategoryManager`           | `src/components/Admin/CategoryManager.tsx`              | Category CRUD                  | Dialog, Button, Input, Card, Badge                             | ❌     |

[Dependencies]
New npm packages required for cloud storage + image processing: ✅ **Already installed**

- `@aws-sdk/client-s3` ^3.1056.0 — S3-compatible storage client (Backblaze B2, AWS S3, MinIO) ✅
- `@aws-sdk/s3-request-presigner` ^3.1056.0 — Generate signed URLs for secure downloads ✅
- `sharp` ^0.34.5 — Already in `package.json` for image optimization/transformation ✅

No additional packages needed beyond these. All existing dependencies remain unchanged.

No changes to `prisma/schema.prisma` — the schema is already complete with all required models.

No changes to `next.config.ts` or `components.json`.

**New shadcn components to install:** ✅ **Already installed**

- ~~`dropdown-menu`~~, ~~`dialog`~~, ~~`badge`~~, ~~`select`~~, ~~`textarea`~~ — All 5 components installed

[Testing]
Manual testing strategy since no test framework is configured:

1. ~~**Run `bun run lint`**~~ ✅ **Complete** — 0 errors, 0 warnings
2. ~~**Run `bun run build`**~~ ✅ **Complete** — Production build succeeds with 11+ pages generated
3. ~~**Visual verification**~~ ⏳ **Pending** — Remaining features to test:
   - Upload a wallpaper → verify Sharp generates thumbnail, S3 stores both
   - Browse wallpapers → verify pagination, search, category filter
   - Wallpaper detail → verify likes, downloads, metadata display
   - Create collection → verify wallpaper can be added via dialog modal
   - Like wallpaper → verify count updates, see in dashboard
   - Download wallpaper → verify signed URL works
   - Admin: ban user, change role, toggle featured → verify effects
4. **Edge cases:** empty states, loading skeletons, error toasts, unauthorized access to admin/admin API, missing/invalid file uploads, large file rejection, S3 upload failures

[Implementation Order]
Build features in dependency order, where each phase builds on the previous.

1. ~~**Phase 0: Dependency Setup**~~ ✅ **Complete** — Install new shadcn components (`dropdown-menu`, `dialog`, `badge`, `select`, `textarea`) and npm packages (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`). Update env vars.

2. ~~**Phase 1: Image Processing + S3 Storage**~~ ✅ **Complete** — `src/lib/imageProcessor.ts` and `src/lib/fileStorage.ts` created with Sharp processing and S3 client.

3. ~~**Phase 2: Wallpaper Upload**~~ ✅ **Complete** — Upload page at `src/app/(private)/upload/page.tsx`, `WallpaperUploadForm` component, private layout, and `createWallpaper` server action implemented.

4. ~~**Phase 3: Wallpaper Browsing & Detail**~~ ✅ **Complete** — Listing page, `WallpaperGrid`/`WallpaperCard`/`Pagination`/`WallpaperDetail`/`LikeButton`/`DownloadButton` components, detail view with metadata, `likeWallpaper`/`downloadWallpaper`/`getWallpapers`/`getWallpaperById`/`getFeaturedWallpapers` server actions.

5. ~~**Phase 4: Categories**~~ ✅ **Complete** — Category browsing pages, CategoryCard, CategoryGrid, server actions.

6. ~~**Phase 5: Collections**~~ ✅ **Complete** — All 7 collection server actions + 3 components + 2 pages.

7. ~~**Phase 6: User Dashboard**~~ ✅ **Complete** — 3 user server actions + DashboardNav + layout + 3 pages + 3 client content files.

8. ~~**Phase 7: Navigation Update**~~ ✅ **Complete** — Header refactored with DropdownMenu, AuthHeader simplified, session logic moved to Header.

9. ~~**Phase 8: Admin Panel**~~ ❌ **Not Started** — No admin pages exist.

10. ~~**Phase 9: Polish & Cleanup**~~ ❌ **Not Started** — Build verification pending.
