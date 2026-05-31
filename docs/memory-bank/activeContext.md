# Active Context: DripWall

## Current Work Focus

Phase 5 (Collections) is now **complete**. The project is ready to begin Phase 6 (User Dashboard).

### Completed in Phase 5:

- ✅ `collectionCreateSchema` added to `src/lib/zodSchema.ts` with CollectionCreateFormType
- ✅ `src/server/collection/createCollection.ts` — Create collection with name, description, visibility
- ✅ `src/server/collection/getCollections.ts` — List user's collections with item count
- ✅ `src/server/collection/getCollectionById.ts` — Collection detail with wallpaper items, ownership check
- ✅ `src/server/collection/updateCollection.ts` — Update collection metadata, ownership verification
- ✅ `src/server/collection/deleteCollection.ts` — Delete collection, ownership verification
- ✅ `src/server/collection/addToCollection.ts` — Add wallpaper to collection (duplicate check)
- ✅ `src/server/collection/removeFromCollection.ts` — Remove wallpaper from collection
- ✅ `src/components/Collection/CollectionCard.tsx` — Card with icon, name, description, wallpaper count, public/private badge
- ✅ `src/components/Collection/CollectionForm.tsx` — Create form with name, description, visibility (react-hook-form + zodResolver + Controller)
- ✅ `src/components/Collection/AddToCollectionModal.tsx` — Dialog modal showing user's collections + inline create form
- ✅ `src/app/(private)/collections/page.tsx` — Server component with auth guard
- ✅ `src/app/(private)/collections/CollectionsPageContent.tsx` — Client component with loading skeletons, empty state, create dialog, collection grid
- ✅ `src/app/(private)/collections/[id]/page.tsx` — Server component with auth guard
- ✅ `src/app/(private)/collections/[id]/CollectionDetailContent.tsx` — Detail view with wallpaper grid, remove button (owner only), delete collection, empty state
- ✅ Lint verified — 0 errors, 0 warnings

## Recent Changes

- **Phase 4 complete**: Categories ✅
- **Phase 5 complete**: Collections ✅ — 7 server actions + 3 components + 2 pages + 1 modal + 1 form + 1 schema

## Next Steps

### Phase 6: User Dashboard (immediate)

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
- Use `import type { Route } from "next"` for typed route support in Link hrefs

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

### React Compiler Constraints

- Do not call `setState` synchronously inside `useEffect` — the React Compiler (babel-plugin-react-compiler) raises errors on this pattern
- Use event handlers (e.g., `onOpenChange` on Dialog) or ref-based patterns instead
- For data loading on mount, ensure the effect body calls a function that only calls setState after an async operation completes (cancelled via ref)

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
- Next.js typed routes with `typedRoutes: true` requires `import type { Route } from "next";` and using `as Route` assertion on Link hrefs
- The Base UI Button component does not support `asChild` prop — wrap Button inside Link instead for navigation
- React Compiler strictly prohibits `setState` calls directly in the body of a `useEffect` — move data fetching to event handlers or use ref-cancelled async patterns
