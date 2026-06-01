# Active Context: DripWall

## Current Work Focus

All 10 phases (Phase 0–9) are **complete**. Three post-Phase-9 commits have been made (sidebar migration, image proxy, returnTo redirect, security fixes), and there are **no uncommitted changes**.

### Latest Commits (Post-Phase 9)

#### `7d60f87` — Refactor admin/dashboard layouts to shadcn Sidebar

- Installed 3 new shadcn components: `sidebar.tsx` (726 lines), `sheet.tsx`, `tooltip.tsx`
- Created `use-mobile.ts` hook for responsive breakpoint detection
- Created `AppSidebar.tsx` (dashboard) with nav items: Overview, My Wallpapers, Liked Wallpapers
- Refactored `AdminSidebar.tsx` to use shadcn Sidebar with inset variant + collapsible icon mode
- Created `MobileNav.tsx` for both admin and dashboard (fixed bottom nav on mobile)
- Updated admin/dashboard layouts to use `SidebarProvider` + sidebar + `SidebarTrigger` + mobile nav
- Deleted `implementation_plan.md`

#### `d30b09b` — Fix layout overflow + add S3 image proxy

- **S3 Image Proxy** (`src/app/api/images/[...key]/route.ts`): New Next.js API route that proxies images from Backblaze B2
- **`resolveImageUrl.ts`**: New utility for converting stored keys to proxy URLs
- **Layout fix**: Removed `100dvw` breakout hack causing horizontal overflow
- **Home page**: Simplified to hero-only section
- **File storage**: `uploadFile()` returns proxy-compatible paths

#### `8f7e4dd` — Add returnTo redirect and harden S3 image proxy

- **Login page/LoginForm**: Added `?returnTo=` param support for redirect-after-login flow
- **Home page**: Session-aware CTA — unauthenticated Upload clicks redirect to `/login?returnTo=/upload`
- **S3 image proxy**: Added auth guard for private wallpapers (requires session + ownership), streaming response, proper cache headers (public immutable vs private short-lived), 404/500 error differentiation
- **resolveImageUrl.ts**: Fixed URI encoding for S3 key segments, normalized `S3_PUBLIC_URL` trailing slashes
- **Header**: Changed "Profile" to "My Wallpapers" linking to `/dashboard/wallpapers`
- **Memory bank**: Updated docs to reflect sidebar, image proxy, and returnTo changes

#### `de32e4b` — Fix: prevent open redirect and false-positive S3 key matching

- **LoginForm.tsx**: Added validation for `returnTo` URL using `URL.canParse()` to prevent open redirect vulnerability — only relative paths starting with `/` are allowed
- **Image proxy route.ts**: Fixed S3 key matching to use `pathname.endsWith(key)` instead of `pathname.includes(key)` to prevent false-positive matches on partial key prefixes

### Key Pattern: Session in Server Actions

All user server actions (`getUserWallpapers`, `getUserLikes`, `getUserDownloads`) follow the established pattern of reading the session from headers internally rather than accepting a `userId` parameter:

```typescript
"use server";
const session = await auth.api.getSession({ headers: await headers() });
if (!session?.user?.id) {
  return { data: [], total: 0, page: 1, pageSize, totalPages: 0 };
}
```

This matches the pattern used by `src/server/collection/getCollections.ts` and avoids passing the session from the client.

## Recent Changes

- **shadcn Sidebar integration**: Admin and dashboard layouts fully migrated from custom sidebar to shadcn Sidebar component with collapsible desktop sidebar and fixed mobile bottom navigation
- **S3 Image Proxy**: Added `/api/images/[...key]` route for secure image delivery with auth-based access control (public vs private wallpapers)
- **Image URL resolution**: Added `resolveImageUrl.ts` utility; all server actions resolve stored keys to proxy URLs
- **Layout restructure (width fix)**: Fixed horizontal overflow — root layout `max-w-7xl mx-auto` moved to `(public)/layout.tsx`
- **Home page simplified**: Removed featured/latest/categories grids, now hero-only with session-aware CTAs
- **Login returnTo flow**: Added `?returnTo=` param support — unauthenticated users clicking "Upload" redirected to login and returned after success
- **Security fix**: Open redirect prevention — `returnTo` validated as relative path via `URL.canParse()` before redirect
- **Security fix**: False-positive S3 key matching — `includes()` replaced with `endsWith()` in image proxy
- **Header dropdown**: Changed "Profile" link to "My Wallpapers" (`/dashboard/wallpapers`)
- **All phases complete**: Phase 0–9 all complete ✅

## Next Steps

All phases complete + sidebar migration + image proxy + returnTo flow + security fixes. Future considerations (if resumed):

- OAuth providers (Google, GitHub)
- PostgreSQL/MySQL migration
- Unit/E2E tests
- CI/CD pipeline
- Image proxy: add support for `Cache-Control` stale-while-revalidate pattern
- Consider adding `sharp` to image proxy for on-the-fly resizing
- Rate limiting to Redis (persistent rate limits across server restarts)

## Active Decisions & Considerations

### Server Actions Architecture (No API Routes)

All operations use `"use server"` functions in `src/server/{domain}/{action}.ts` files. This leverages Next.js 16's server action capabilities, including file upload handling via `arrayBuffer()`. The only API routes are `/api/auth/[...all]` (Better Auth) and `/api/images/[...key]` (S3 image proxy).

### Better Auth Admin API vs Custom Server Actions

User management operations (`listUsers`, `setRole`, `banUser`, `unbanUser`) use Better Auth's built-in admin plugin API (`auth.api.*`) rather than custom server actions.

Custom server actions are still needed for:

- Wallpaper management (CRUD, likes, downloads)
- Collection management (CRUD, add/remove items)
- Category management (CRUD — admin only)
- Dashboard data (user wallpapers, likes, downloads)

### Image Storage & Delivery: Backblaze B2 via S3 API + Next.js Proxy

- Using `@aws-sdk/client-s3` v3 with Backblaze B2's S3-compatible API
- Sharp for image processing (resize, WebP thumbnail, metadata extraction)
- **Images served through `/api/images/[...key]` proxy**:
  - Queries DB to check wallpaper ownership and `isPublic` status
  - Private wallpapers require valid session + matching userId
  - Public wallpapers get long-term immutable cache headers
  - Streams response directly from S3
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

### Bun (Package Manager & Runtime)

This project uses **Bun** as the package manager and runtime. All commands (`dev`, `build`, `lint`, `migrate`, `seed`, `studio`, `add <package>`, `install`) must be run with `bun`, never `npm` or `npx`.

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

### Metadata Pattern

- Root layout exports `metadata` with `title.template` and `title.default` for consistent tab titles (`"%s | DripWall"`, default `"DripWall"`)
- Static pages export `metadata` with just page name (no "| DripWall" suffix — the template handles it)
- Dynamic pages use `generateMetadata` async function fetching from DB (wallpaper title, collection name, category name)
- Pages without meaningful dynamic content return empty object `{}` from `generateMetadata`

### Error Message Pattern

- Admin server actions sanitize errors to generic messages like `"An unexpected error occurred. Please try again."`
- Original error logged to `console.error()` for debugging
- Prevents leaking implementation details to users

### Utility Extraction Pattern

- Shared utility functions (like `slugify`) extracted to `src/lib/utils.ts`
- Eliminates duplication across server action files

### Image URL Resolution Pattern

- Store S3 keys in database (not full URLs)
- Before returning data to client, pass URLs through `resolveImageUrl()` which converts keys to proxy URLs (`/api/images/{key}`)
- `resolveImageUrl()` skips conversion for full HTTP URLs or already-proxied paths
- `extractS3Key()` reverses the conversion for operations that need the raw S3 key

### Open Redirect Prevention Pattern

- `returnTo` URLs validated using `URL.canParse()` to ensure they are relative paths starting with `/`
- Prevents malicious redirects after login
- Falls back to `/` if invalid

### S3 Key Matching Pattern

- Image proxy uses `pathname.endsWith(key)` instead of `pathname.includes(key)` to prevent false-positive matches
- Ensures only exact key suffixes match, not partial prefixes

## Preferred Verification

- Use `bun run lint` (not `bun run build`) for quick verification after changes — faster and sufficient for catching errors

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
- Admin role guard uses `session.user.role !== "admin"` check in nested layout within `(private)/` route group
- Better Auth admin plugin: `auth.api.listUsers()` for server-side paginated user list; `authClient.admin.setRole()`, `authClient.admin.banUser()`, `authClient.admin.unbanUser()` for client-side mutations
- Admin wallpapers page uses `getAllWallpapersAdmin` server action (not `auth.api.*`) because wallpaper management is domain-specific
- Category CRUD server actions use `categoryCreateSchema` from `zodSchema.ts` with `.partial()` for updates; slug is auto-generated from name with conflict detection
- Git commit messages in PowerShell: heredoc syntax (`<<EOF`) doesn't work. Use `git commit -m "subject" -m "body"` or pass via temporary file with `Set-Content`
- shadcn Sidebar component uses `@base-ui/react` primitives (`useRender`, `mergeProps`) and class-variance-authority for button variants
- S3 image proxy requires `runtime = "nodejs"` and handles three body types: `Readable`, `Blob`, and native `ReadableStream`
- Image proxy cache headers should differentiate public (immutable) vs private (short-lived) content
- The shadcn Sidebar `render` prop on `SidebarMenuButton` is used for wrapping with Link components (`render={<Link href={...} />}`)
- Mobile nav for admin/dashboard uses a separate `MobileNav.tsx` component with fixed bottom positioning, hidden on `md:` breakpoint
- Open redirect prevention: use `URL.canParse(returnTo, origin)` and verify the parsed URL is relative (starts with `/`) before redirecting
- S3 key matching in proxy: use `endsWith()` instead of `includes()` to prevent false-positive matches on partial key prefixes
