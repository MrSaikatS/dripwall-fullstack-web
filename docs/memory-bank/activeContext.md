# Active Context: DripWall

## Current Work Focus

The project has a **complete implementation plan** covering all remaining features, which has been audited against Better Auth, Prisma 7, and shadcn best practices via their official MCP tools/skills. The implementation is ready to begin.

Key findings from the audit:

- **Better Auth admin plugin** provides built-in APIs for user management (`listUsers`, `setRole`, `banUser`, `unbanUser`) — no custom server actions needed for these
- **All 5 shadcn components** (dropdown-menu, dialog, badge, select, textarea) confirmed available in registry
- **Prisma schema** already complete — no changes needed
- **Session access pattern** (`auth.api.getSession({ headers: await headers() })`) confirmed correct for server actions
- **Form patterns** align with established conventions (Zod + react-hook-form + Controller)

## Recent Changes

- **Implementation plan created** (`implementation_plan.md`) — 10 phases covering all features:
  - Phase 0: Dependency Setup (shadcn components, npm packages, env vars)
  - Phase 1: Image Processing + S3 Storage (fileStorage.ts, imageProcessor.ts)
  - Phase 2: Wallpaper Upload (upload page, form, createWallpaper server action)
  - Phase 3: Wallpaper Browsing & Detail (listing, grid, card, pagination, detail, like/download)
  - Phase 4: Categories (browsing pages, CategoryCard)
  - Phase 5: Collections (CRUD pages, CollectionForm, AddToCollectionModal)
  - Phase 6: User Dashboard (dashboard pages with uploads, likes, downloads)
  - Phase 7: Navigation Update (Header refactor with shadcn DropdownMenu)
  - Phase 8: Admin Panel (user/wallpaper/category management)
  - Phase 9: Polish & Cleanup (.gitkeep removal, lint, build)
- **Implementation plan audited** against:
  - Better Auth MCP docs (Next.js integration, admin plugin, session management)
  - Prisma 7 skills (driver adapter, client API, database setup)
  - shadcn MCP registry (component availability verification)
- **4 duplicate admin server actions removed** from plan — `getAllUsers`, `updateUserRole`, `banUser`, `unbanUser` replaced with Better Auth's built-in `auth.api.listUsers()`, `auth.api.setRole()`, `auth.api.banUser()`, `auth.api.unbanUser()`
- **5 shadcn components** to install: dropdown-menu, dialog, badge, select, textarea
- **2 npm packages** to install: @aws-sdk/client-s3, @aws-sdk/s3-request-presigner
- **6 new env vars** for Backblaze B2 S3-compatible storage

## Next Steps

### Phase 0: Dependency Setup (immediate)

1. Install shadcn components: dropdown-menu, dialog, badge, select, textarea
2. Install npm packages: @aws-sdk/client-s3, @aws-sdk/s3-request-presigner
3. Update serverEnv.ts with Backblaze B2 env vars
4. Update clientEnv.ts with NEXT_PUBLIC_S3_PUBLIC_URL
5. Run `bun run lint` to verify no errors

### Phase 1: Image Processing + S3 Storage

- Create `src/lib/imageProcessor.ts` (Sharp resize/thumbnail/metadata)
- Create `src/lib/fileStorage.ts` (S3 upload/delete/signed URL)

### Phase 2+: Continue through Phase 9

## Active Decisions & Considerations

### Server Actions Architecture (No API Routes)

All operations use `"use server"` functions in `src/server/{domain}/{action}.ts` files. This leverages Next.js 16's server action capabilities, including file upload handling via `arrayBuffer()`. No `src/app/api/*` files beyond the existing Better Auth route handler.

### Better Auth Admin API vs Custom Server Actions

**Key decision from audit:** User management operations (`listUsers`, `setRole`, `banUser`, `unbanUser`) should use Better Auth's built-in admin plugin API (`auth.api.*`) rather than custom server actions. These are the APIs to use:

- `auth.api.listUsers({ query: { limit, offset }, headers: await headers() })` — paginated user list
- `auth.api.setRole({ body: { userId, role }, headers: await headers() })` — role changes
- `auth.api.banUser({ body: { userId, banReason?, banExpiresIn? }, headers: await headers() })` — ban with session revocation
- `auth.api.unbanUser({ body: { userId }, headers: await headers() })` — unban

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
- Will need email sending service for production use

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
