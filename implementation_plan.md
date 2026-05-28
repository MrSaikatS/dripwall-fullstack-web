# Implementation Plan

[Overview]
Complete the DripWall full-stack wallpaper sharing platform by implementing all remaining features: wallpaper browsing/search, image upload with Sharp optimization + S3-compatible cloud storage, collections, likes/downloads, user dashboard, and admin panel.

The project currently has authentication fully implemented (login, register, forgot/reset password) with Next.js 16 + Better Auth + Prisma 7 (SQLite) + Tailwind CSS 4. The database schema defines all necessary models (Wallpaper, Category, Tag, Collection, Like, Download, etc.) but no feature pages or API routes exist beyond auth. This implementation will build the complete wallpaper platform using S3-compatible cloud storage (Cloudflare R2 or AWS S3) for images optimized/transformed via Sharp, console-level dev email logging, shadcn/ui components throughout, and the established form/component patterns.

[Types]
New Zod schemas and TypeScript types will be added to support wallpaper management, collections, categories, and user interactions.

**Wallpaper Upload Schema** (`src/lib/zodSchema.ts`)

- `title`: `z.string().trim().min(3).max(128)`
- `description`: `z.string().max(500).optional()`
- `categoryId`: `z.string().uuid()`
- `tags`: `z.array(z.string().uuid())` (tag IDs)

**Collection Schema** (`src/lib/zodSchema.ts`)

- `name`: `z.string().trim().min(1).max(64)`
- `description`: `z.string().max(300).optional()`
- `isPublic`: `z.boolean()`

**Category Create Schema** (`src/lib/zodSchema.ts`)

- `name`: `z.string().trim().min(1).max(32)`
- `description`: `z.string().max(300).optional()`

**Update `LayoutChildrenProps`** in `src/lib/types.ts` to also export `PageParams` generic type for route params.

**API Route Response Types:**

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

**New route params type:**

```typescript
type PageParams<T extends Record<string, string>> = {
  params: Promise<T>;
};
```

[Files]
New files to be created and existing files to be modified across the entire application.

### New Files to Create

**Wallpaper Upload (all server actions — no API routes):**

- `src/app/(private)/upload/page.tsx` — Upload page with metadata form + file input
- `src/components/Wallpaper/WallpaperUploadForm.tsx` — Client component for upload form (uses `use-file-picker`, shadcn Select, Textarea, Button). Calls `createWallpaper` server action.

**Wallpaper Browsing:**

- `src/app/(public)/wallpapers/page.tsx` — Browse all wallpapers with search + filter UI (public listing). Uses server component direct DB access for initial data, client component for interactive filters.
- `src/components/Wallpaper/WallpaperGrid.tsx` — Grid display component (responsive CSS grid)
- `src/components/Wallpaper/WallpaperCard.tsx` — Individual wallpaper card with shadcn Card, Badge, Avatar
- `src/components/Wallpaper/Pagination.tsx` — Pagination component with shadcn Button variants

**Wallpaper Detail:**

- `src/app/(public)/wallpapers/[id]/page.tsx` — Wallpaper detail view (server component with initial data)
- `src/components/Wallpaper/WallpaperDetail.tsx` — Full detail component
- `src/components/Wallpaper/LikeButton.tsx` — Like/unlike toggle using server action
- `src/components/Wallpaper/DownloadButton.tsx` — Download with counter using server action

**Categories:**

- `src/app/(public)/categories/page.tsx` — Browse categories (server component, direct DB)
- `src/app/(public)/categories/[slug]/page.tsx` — Wallpapers by category (server component + client interactive)
- `src/components/Category/CategoryCard.tsx` — Category card with image and count

**Tags:**

- Tags handled inline via server actions in admin. No dedicated pages.

**Collections:**

- `src/app/(private)/collections/page.tsx` — User's collections (server component + client interactions)
- `src/app/(private)/collections/[id]/page.tsx` — Collection detail
- `src/components/Collection/CollectionCard.tsx` — Collection card
- `src/components/Collection/CollectionForm.tsx` — Create/edit collection form using server actions
- `src/components/Collection/AddToCollectionModal.tsx` — Modal (shadcn Dialog) using server action

**User Dashboard:**

- `src/app/(private)/dashboard/page.tsx` — User dashboard overview (server component, direct DB)
- `src/app/(private)/dashboard/wallpapers/page.tsx` — User's uploaded wallpapers
- `src/app/(private)/dashboard/likes/page.tsx` — User's liked wallpapers
- `src/components/Dashboard/DashboardNav.tsx` — Sidebar/nav for dashboard

**Admin Panel:**

- `src/app/(private)/admin/page.tsx` — Admin dashboard overview (server component)
- `src/app/(private)/admin/users/page.tsx` — User management using Better Auth's built-in admin API (`auth.api.listUsers()`, `auth.api.setRole()`, `auth.api.banUser()`, `auth.api.unbanUser()`) — no custom server actions needed for user CRUD
- `src/app/(private)/admin/categories/page.tsx` — Category management with server actions for CRUD
- `src/app/(private)/admin/wallpapers/page.tsx` — Wallpaper management (all)
- `src/components/Admin/UserTable.tsx` — User listing with ban/role actions (shadcn Table, DropdownMenu, Badge). Calls Better Auth admin API directly rather than custom server actions.
- `src/components/Admin/CategoryManager.tsx` — Category CRUD with shadcn Dialog forms using server actions

**Private Layout:**

- `src/app/(private)/layout.tsx` — Auth-guarded layout with sidebar nav, redirects unauthenticated users

**Server Actions (one file per action, each with `"use server"` directive):**

- `src/server/wallpaper/createWallpaper.ts`
- `src/server/wallpaper/updateWallpaper.ts`
- `src/server/wallpaper/deleteWallpaper.ts`
- `src/server/wallpaper/likeWallpaper.ts`
- `src/server/wallpaper/downloadWallpaper.ts`
- `src/server/wallpaper/getWallpapers.ts`
- `src/server/wallpaper/getWallpaperById.ts`
- `src/server/wallpaper/getFeaturedWallpapers.ts`
- `src/server/collection/createCollection.ts`
- `src/server/collection/updateCollection.ts`
- `src/server/collection/deleteCollection.ts`
- `src/server/collection/addToCollection.ts`
- `src/server/collection/removeFromCollection.ts`
- `src/server/collection/getCollections.ts`
- `src/server/collection/getCollectionById.ts`
- ⚠️ **Not needed — use Better Auth admin plugin API directly:**
  - User management operations (`listUsers`, `setRole`, `banUser`, `unbanUser`) are built into Better Auth's `admin()` plugin and available via `auth.api.*` with session headers.
  - No separate server action files required — call `auth.api.listUsers()`, `auth.api.setRole()`, `auth.api.banUser()`, `auth.api.unbanUser()` directly from page/layout server components or client components with `headers: await headers()`.
- `src/server/admin/getAllWallpapersAdmin.ts`
- `src/server/admin/toggleFeatured.ts`
- `src/server/admin/createCategory.ts`
- `src/server/admin/updateCategory.ts`
- `src/server/admin/deleteCategory.ts`
- `src/server/user/getUserWallpapers.ts`
- `src/server/user/getUserLikes.ts`
- `src/server/user/getUserDownloads.ts`

**Image Upload & Storage:**

- `src/lib/fileStorage.ts` — S3-compatible cloud storage client using `@aws-sdk/client-s3` (upload, delete, getSignedUrl)
- `src/lib/imageProcessor.ts` — Sharp-based image processing (resize to multiple resolutions, generate WebP thumbnail, extract EXIF metadata: width, height, format, fileSize)

**New shadcn components to add:**

- `src/components/shadcnui/dropdown-menu.tsx` — For admin actions, user menus
- `src/components/shadcnui/dialog.tsx` — For AddToCollectionModal, confirmations
- `src/components/shadcnui/badge.tsx` — For tags, categories, roles
- `src/components/shadcnui/select.tsx` — For category dropdown in upload form
- `src/components/shadcnui/textarea.tsx` — For description field in upload form

### Existing Files to Modify

- `src/lib/types.ts` — Add `PageParams<T>` generic type and `PaginatedResponse<T>`, `ApiResponse<T>`
- `src/lib/zodSchema.ts` — Add wallpaper upload, collection, category schemas + types
- `src/lib/env/serverEnv.ts` — Add S3/cloud storage env vars
- `src/components/Header/Header.tsx` — Add navigation links (Wallpapers, Categories, Dashboard, Admin for admins) using shadcn DropdownMenu for user menu
- `src/components/Header/AuthHeader.tsx` — Refactor to provide session data + role to Header via a shared `useSession` call so Header can conditionally render admin/dashboard/upload links. Use shadcn DropdownMenu for user avatar + dropdown

### Files to Delete/Move

- `src/app/(private)/.gitkeep` — Remove
- `src/hooks/.gitkeep` — Remove
- `src/server/.gitkeep` — Remove

### New Environment Variables (`src/lib/env/serverEnv.ts`)

- `S3_ENDPOINT`: `z.string().url()` — Backblaze B2 S3-compatible endpoint (e.g., `https://s3.us-west-004.backblazeb2.com`)
- `S3_REGION`: `z.string().default("us-west-004")` — Backblaze B2 region
- `S3_ACCESS_KEY_ID`: `z.string().min(1)` — Backblaze B2 application key ID
- `S3_SECRET_ACCESS_KEY`: `z.string().min(1)` — Backblaze B2 application key
- `S3_BUCKET_NAME`: `z.string().min(1)` — Backblaze B2 bucket name
- `S3_PUBLIC_URL`: `z.string().url().optional()` — Optional public URL base for direct image access (e.g., `https://f002.backblazeb2.com/file/<bucketName>`)
- `NEXT_PUBLIC_S3_PUBLIC_URL`: Add to clientEnv.ts for client-side image URLs

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

- `createCollection.ts` — `createCollection(data: CollectionInput, userId: string)` → Create collection
- `updateCollection.ts` — `updateCollection(id: string, userId: string, data: Partial<CollectionInput>)` → Update
- `deleteCollection.ts` — `deleteCollection(id: string, userId: string)` → Delete (verify ownership)
- `addToCollection.ts` — `addToCollection(collectionId: string, wallpaperId: string)` → Add wallpaper (check duplicate)
- `removeFromCollection.ts` — `removeFromCollection(collectionId: string, wallpaperId: string)` → Remove wallpaper
- `getCollections.ts` — `getUserCollections(userId: string)` → Get user's collections with item count
- `getCollectionById.ts` — `getCollectionById(id: string)` → Collection with items and wallpaper data

**`src/server/admin/` (each file exports a single function):**

- ⚠️ **Not needed — use Better Auth admin plugin API directly:**
  - `auth.api.listUsers({ query: { limit, offset }, headers: await headers() })` — Built-in paginated user list with search, filter, sort (replaces `getAllUsers.ts`)
  - `auth.api.setRole({ body: { userId, role }, headers: await headers() })` — Built-in role change (replaces `updateUserRole.ts`)
  - `auth.api.banUser({ body: { userId, banReason?, banExpiresIn? }, headers: await headers() })` — Built-in ban with optional expiry + session revocation (replaces `banUser.ts`)
  - `auth.api.unbanUser({ body: { userId }, headers: await headers() })` — Built-in unban (replaces `unbanUser.ts`)
  - These all require admin authentication (handled automatically by Better Auth when session belongs to admin user).
  - Keep remaining admin server actions below for wallpaper and category management.
- `getAllWallpapersAdmin.ts` — `getAllWallpapersAdmin(page: number)` → All wallpapers including unlisted/private
- `toggleFeatured.ts` — `toggleFeatured(wallpaperId: string)` → Toggle featured status
- `createCategory.ts` — `createCategory(data: { name, slug, description? })` → Create category
- `updateCategory.ts` — `updateCategory(id: string, data: Partial<CategoryInput>)` → Update category
- `deleteCategory.ts` — `deleteCategory(id: string)` → Delete category (wallpapers get category set to null)

**`src/server/user/` (each file exports a single function):**

- `getUserWallpapers.ts` — `getUserWallpapers(userId: string, page: number)` → Paginated user uploads
- `getUserLikes.ts` — `getUserLikes(userId: string, page: number)` → Paginated user likes with wallpaper data
- `getUserDownloads.ts` — `getUserDownloads(userId: string, page: number)` → Paginated download history

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

| Component              | File                                                 | Purpose                        | shadcn Components Used                                         |
| ---------------------- | ---------------------------------------------------- | ------------------------------ | -------------------------------------------------------------- |
| `WallpaperGrid`        | `src/components/Wallpaper/WallpaperGrid.tsx`         | Responsive grid layout         | —                                                              |
| `WallpaperCard`        | `src/components/Wallpaper/WallpaperCard.tsx`         | Card with thumbnail + metadata | Card, Badge, Skeleton                                          |
| `WallpaperDetail`      | `src/components/Wallpaper/WallpaperDetail.tsx`       | Full wallpaper view            | Card, Badge, Separator, Avatar                                 |
| `WallpaperUploadForm`  | `src/components/Wallpaper/WallpaperUploadForm.tsx`   | Upload form                    | Button, Input, Select, Textarea, Field, FieldLabel, FieldError |
| `LikeButton`           | `src/components/Wallpaper/LikeButton.tsx`            | Heart toggle                   | Button                                                         |
| `DownloadButton`       | `src/components/Wallpaper/DownloadButton.tsx`        | Download action                | Button                                                         |
| `Pagination`           | `src/components/Wallpaper/Pagination.tsx`            | Page nav                       | Button                                                         |
| `CategoryCard`         | `src/components/Category/CategoryCard.tsx`           | Category card                  | Card, Badge                                                    |
| `CollectionCard`       | `src/components/Collection/CollectionCard.tsx`       | Collection card                | Card                                                           |
| `CollectionForm`       | `src/components/Collection/CollectionForm.tsx`       | Create/edit form               | Dialog, Button, Input, Textarea, Field                         |
| `AddToCollectionModal` | `src/components/Collection/AddToCollectionModal.tsx` | Collection selection modal     | Dialog, Button                                                 |
| `DashboardNav`         | `src/components/Dashboard/DashboardNav.tsx`          | Sidebar navigation             | —                                                              |
| `UserTable`            | `src/components/Admin/UserTable.tsx`                 | User management table          | Table, DropdownMenu, Badge, Button                             |
| `CategoryManager`      | `src/components/Admin/CategoryManager.tsx`           | Category CRUD                  | Dialog, Button, Input, Card, Badge                             |

[Dependencies]
New npm packages required for cloud storage + image processing:

- `@aws-sdk/client-s3` — S3-compatible storage client (Cloudflare R2, AWS S3, MinIO)
- `@aws-sdk/s3-request-presigner` — Generate signed URLs for secure downloads
- `sharp` — Already in `package.json` for image optimization/transformation

No additional packages needed beyond these. All existing dependencies remain unchanged.

No changes to `prisma/schema.prisma` — the schema is already complete with all required models.

No changes to `next.config.ts` or `components.json`.

**New shadcn components to install:**

- `dropdown-menu` — For user menu, admin actions
- `dialog` — For modals (AddToCollection, confirmations)
- `badge` — For tags, category counts, roles
- `select` — For category/tag dropdowns
- `textarea` — For description fields

[Testing]
Manual testing strategy since no test framework is configured:

1. **Run `bun run lint`** after each phase to ensure no TypeScript/ESLint errors
2. **Run `bun run build`** to verify production build succeeds
3. **Visual verification** of all new pages in browser:
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

1. **Phase 0: Dependency Setup** — Install new shadcn components (`dropdown-menu`, `dialog`, `badge`, `select`, `textarea`) and npm packages (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`). Update env vars.

2. **Phase 1: Image Processing + S3 Storage** — Create `src/lib/imageProcessor.ts` (Sharp resize/thumbnail/metadata extraction) and `src/lib/fileStorage.ts` (S3 upload/delete/signed URL). Required by wallpaper upload.

3. **Phase 2: Wallpaper Upload** — Create upload page + `WallpaperUploadForm` component, private layout, and `createWallpaper` server action (Sharp → S3 → DB). Enables adding content.

4. **Phase 3: Wallpaper Browsing & Detail** — Create listing page (search/filter), `WallpaperGrid`/`WallpaperCard`/`Pagination` components, detail view, `likeWallpaper`/`downloadWallpaper` server actions.

5. **Phase 4: Categories** — Create category browsing pages, `CategoryCard` component, category server actions in admin. Enables content organization.

6. **Phase 5: Collections** — Create collection CRUD pages, `CollectionForm`, `AddToCollectionModal`, server actions.

7. **Phase 6: User Dashboard** — Create dashboard pages showing user's wallpapers, likes, downloads with server actions.

8. **Phase 7: Navigation Update** — Refactor Header to include session-aware nav links using shadcn DropdownMenu for user avatar.

9. **Phase 8: Admin Panel** — Create admin pages for user/wallpaper/category management using:
   - **User management**: Better Auth admin plugin API (`auth.api.listUsers()`, `auth.api.setRole()`, `auth.api.banUser()`, `auth.api.unbanUser()`) — no custom server actions needed
   - **Wallpaper management**: Custom server actions (`getAllWallpapersAdmin.ts`, `toggleFeatured.ts`)
   - **Category management**: Custom server actions (`createCategory.ts`, `updateCategory.ts`, `deleteCategory.ts`)
   - UI: shadcn Table, DropdownMenu, Dialog, Badge, Button

10. **Phase 9: Polish & Cleanup** — Remove `.gitkeep` files, run lint, run build, fix any issues.
