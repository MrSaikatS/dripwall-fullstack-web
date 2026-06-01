# System Patterns: DripWall

## System Architecture

The project follows **Next.js 16 App Router** architecture with a strict separation between client and server code.

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (private)/          # Authenticated routes (layout group)
│   │   ├── upload/         # Wallpaper upload
│   │   ├── collections/    # User collections
│   │   ├── dashboard/      # User dashboard (shadcn Sidebar layout)
│   │   ├── admin/          # Admin panel (shadcn Sidebar layout)
│   ├── (public)/           # Public routes
│   │   ├── login/          # Supports ?returnTo= param
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── wallpapers/     # Wallpaper browsing & detail
│   │   ├── categories/     # Category browsing
│   │   └── page.tsx        # Home page (hero-only, session-aware CTAs)
│   ├── api/auth/[...all]/  # Better Auth API handlers
│   ├── api/images/[...key]/ # S3 image proxy (auth-guarded)
│   ├── globals.css         # Tailwind CSS 4 + Shadcn theme
│   └── layout.tsx          # Root layout with ThemeProvider, Header
├── components/             # React components
│   ├── Admin/              # Admin panel components (AdminSidebar, MobileNav, UserTable)
│   ├── Auth/               # Auth-related (LoginForm — supports returnTo, RegisterForm, AuthHeader)
│   ├── Buttons/            # ThemeToggleButton
│   ├── Category/           # Category components
│   ├── Collection/         # Collection components
│   ├── Dashboard/          # Dashboard components (AppSidebar, MobileNav)
│   ├── Header/             # App Header
│   ├── Providers/          # ThemeProvider, ToastProvider
│   ├── shadcnui/           # Shadcn UI primitives (16 components)
│   └── Wallpaper/          # Wallpaper components (WallpaperUploadForm)
├── hooks/                  # Custom hooks
│   └── use-mobile.ts       # Mobile breakpoint detection hook
├── lib/                    # Shared utilities and configuration
│   ├── auth.ts             # Better Auth server instance
│   ├── auth-client.ts      # Better Auth client instance
│   ├── argon2.ts           # Password hashing utilities
│   ├── database/dbClient.ts # Prisma client singleton
│   ├── env/                # Server and client env validation (T3 Env)
│   ├── fileStorage.ts      # S3-compatible cloud storage client
│   ├── fonts.ts            # Geist font configuration
│   ├── imageProcessor.ts   # Sharp image processing
│   ├── resolveImageUrl.ts  # Image URL resolution (S3 key → proxy URL)
│   ├── types.ts            # Shared TypeScript types
│   ├── utils.ts            # cn(), slugify() utilities
│   └── zodSchema.ts        # Zod schemas for forms
└── server/                 # Server actions (one file per action)
    ├── wallpaper/          # Wallpaper CRUD
    ├── collection/         # Collection CRUD
    ├── admin/              # Admin wallpaper/category operations
    └── user/               # User dashboard queries
```

## Key Technical Decisions

### Authentication: Better Auth

- Chosen for comprehensive auth out of the box (email/password, sessions, OAuth-ready, admin plugin)
- Uses Argon2 hashing with secret key from BETTER_AUTH_SECRET
- Prisma adapter with SQLite for persistence
- `nextCookies()` plugin for seamless Next.js integration
- `admin()` plugin for role-based access control

### Server Actions (No API Routes)

All domain operations use `"use server"` functions in `src/server/{domain}/{action}.ts` files:

- **One file per action** — clear separation of concerns
- Each file exports a single async function with `"use server"` directive
- File uploads handled via `file.arrayBuffer()` pattern in server actions
- The only API routes are for Better Auth (`/api/auth/[...all]`) and S3 image proxy (`/api/images/[...key]`)
- Session access: `auth.api.getSession({ headers: await headers() })` within each action

### User Management: Better Auth Admin API (No Custom Server Actions)

User management operations use Better Auth's built-in admin plugin API directly:

- `auth.api.listUsers()` — paginated user list with search, filter, sort
- `auth.api.setRole()` — role changes
- `auth.api.banUser()` — ban with optional expiry + session revocation
- `auth.api.unbanUser()` — unban

These are called directly from page/layout server components or client components, not wrapped in custom server actions.

### S3 Image Proxy Architecture

Images are served through a Next.js API route rather than directly from S3:

1. S3 keys stored in DB (e.g., `wallpapers/{userId}/{uuid}-{name}.webp`)
2. `resolveImageUrl()` converts keys to proxy URLs (`/api/images/{key}`)
3. `/api/images/[...key]` route:
   - Looks up wallpaper by S3 key suffix
   - Checks `isPublic` flag — private wallpapers require session + ownership
   - Streams image from S3 to client
   - Sets appropriate cache headers (public/immutable vs private/short)
4. Direct S3 URLs (from `S3_PUBLIC_URL`) also handled — `resolveImageUrl()` detects and returns as-is
5. `extractS3Key()` reverses the conversion for operations needing the raw key

### Wallpaper Upload Flow (Phase 2)

1. Client: `WallpaperUploadForm` validates metadata (title, description, category) via react-hook-form + Zod
2. Client: `use-file-picker` handles file selection with type/size constraints
3. Client: Constructs `FormData` with metadata fields + file, calls `createWallpaper` server action
4. Server Action: Validates session via `auth.api.getSession()`
5. Server Action: Validates file type (JPEG/PNG/WebP/GIF/AVIF/TIFF) and size (max 50MB)
6. Server Action: Validates image buffer header bytes via `validateImageBuffer()`
7. Server Action: Sharp processes image — extracts metadata (width, height, format, fileSize), generates WebP thumbnail (400px, quality 80)
8. Server Action: Uploads original + thumbnail to S3 via `@aws-sdk/client-s3`
9. Server Action: Creates DB record with S3 keys, metadata, userId, categoryId, tags
10. Server Action: Revalidates paths (`/wallpapers`, `/`), returns success result
11. Client: On success, resets form, clears file, redirects to home

### Image Storage: Backblaze B2 via S3 API

- Using `@aws-sdk/client-s3` v3 with Backblaze B2's S3-compatible API
- `@aws-sdk/s3-request-presigner` for generating signed download URLs
- File naming: `wallpapers/{userId}/{uuid}-{original-name}`
- Thumbnails: `wallpapers/{userId}/thumb-{uuid}-{original-name}`
- Images served through `/api/images/[...key]` proxy route

### Image Processing: Sharp

- `processImage(buffer)` in `src/lib/imageProcessor.ts`
- Extracts original dimensions, format, file size
- Generates WebP thumbnail (max 400px width, quality 80)
- Returns both original + thumbnail buffers + metadata

### Database: Prisma 7 + LibSQL (SQLite)

- Prisma 7 with PrismaLibSql adapter for SQLite
- Single `prisma.config.ts` for configuration
- Generated client output to `generated/prisma/` (gitignored)
- Dev database file: `prisma/dev.db`
- Compound indexes on frequently queried columns

### UI Framework: shadcn/ui (Base UI)

- Components built on `@base-ui/react` primitives
- Tailwind CSS 4 with CSS variables for theming
- `tw-animate-css` for animation utilities
- Custom field pattern using `react-hook-form` + `zodResolver` + `Controller`
- **16 shadcn components installed**: avatar, badge, button, card, dialog, dropdown-menu, field, input, label, select, separator, skeleton, textarea, **sidebar**, **sheet**, **tooltip**
- shadcn Sidebar used for admin and dashboard layouts with `variant="inset"` and `collapsible="icon"`
- Mobile navigation uses separate `MobileNav.tsx` components with fixed bottom positioning

### Form Pattern (Established Convention)

1. Zod schema in `src/lib/zodSchema.ts` with exported inferred type
2. Client component with `"use client"` directive
3. `useForm` with `zodResolver`, `mode: "all"` for real-time validation
4. `Controller` for each form field (fine-grained re-renders)
5. `Field` > `FieldLabel` + `Input` + `FieldError` component hierarchy
6. `noValidate` on form element (react-hook-form handles validation)
7. Loading state via `isSubmitting` with icon swap

### CSS Architecture

- Tailwind CSS 4 with `@import` syntax
- CSS variables for theme colors (light/dark)
- `@custom-variant dark` for dark mode support
- Shadcn `tailwind.css` import for component styles

### Utility Functions

- `cn()` in `src/lib/utils.ts` — class name merging (clsx + tailwind-merge)
- `slugify()` in `src/lib/utils.ts` — text to URL-safe slug
- `resolveImageUrl()` in `src/lib/resolveImageUrl.ts` — S3 key to proxy URL conversion
- `extractS3Key()` in `src/lib/resolveImageUrl.ts` — reverse URL to S3 key

### Metadata Pattern

- Root layout (`src/app/layout.tsx`) sets `title.template: "%s | DripWall"` and `default: "DripWall"` for consistent tab titles
- Static pages export named `metadata` object with just the page name (template handles the suffix)
- Dynamic pages (wallpapers/[id], categories/[slug], collections/[id]) export `async generateMetadata` that fetches entity name from DB
- All metadata includes `description` for SEO

### Error Handling in Server Actions

- Admin server actions sanitize error messages to generic text ("An unexpected error occurred. Please try again.")
- Original error logged to `console.error()` for debugging
- Prevents leaking internal implementation details to end users

## Component Relationships

```
RootLayout
├── ThemeProvider (next-themes)
│   ├── ToastProvider (react-toastify)
│   └── Header
│       ├── Header (client component with inline session, DropdownMenu)
│       │   ├── DropdownMenu (authenticated: avatar + user menu)
│       │   │   ├── Dashboard, My Wallpapers, Admin links
│       │   │   └── LogoutButton
│       │   └── AuthHeader (unauthenticated: sign-in/sign-up links)
│       └── ThemeToggleButton
└── <main className="pt-16"> children
    ├── (public) routes [max-w-7xl]
    │   ├── Home Page (hero-only, session-aware CTAs)
    │   ├── Login Page → LoginForm (supports returnTo)
    │   ├── Register Page → RegisterForm
    │   ├── Forgot Password Page → ForgotPasswordForm
    │   ├── Reset Password Page → ResetPasswordForm
    │   ├── Wallpapers List → WallpapersPageContent > WallpaperGrid + Pagination
    │   ├── Wallpaper Detail → WallpaperDetail + LikeButton, DownloadButton
    │   └── Categories → CategoryCard
    └── (private) routes [auth guard, full width]
        ├── Upload → WallpaperUploadForm
        ├── Collections → CollectionCard, CollectionForm, AddToCollectionModal
        ├── Dashboard [shadcn Sidebar layout]
        │   ├── AppSidebar (collapsible desktop sidebar)
        │   ├── MobileNav (fixed bottom nav)
        │   └── Dashboard pages (Overview, Wallpapers, Likes)
        └── Admin [shadcn Sidebar layout]
            ├── AdminSidebar (collapsible desktop sidebar)
            ├── MobileNav (fixed bottom nav)
            ├── UserTable
            └── CategoryManager
```

### Layout Spacing

Root layout `<main>` uses `pt-16` to prevent content from being hidden behind the fixed header. Public routes wrapped in `(public)/layout.tsx` with `mx-auto max-w-7xl`. Private routes (dashboard/admin) are full-width with shadcn Sidebar.

## Critical Implementation Paths

### Authentication Flow

1. User submits form -> `authClient.signIn.email()` or `authClient.signUp.email()`
2. Better Auth validates credentials (Argon2 verify/hash)
3. Session created in SQLite via Prisma adapter
4. Cookie set with prefix `cit`, 7-day expiry, daily refresh
5. `authClient.useSession()` checks session via `GET /api/auth/get-session`
6. Admin plugin enables `user.role` field and impersonation
7. Login accepts `?returnTo=` param — redirects there after success

### Session Validation

1. Server component/layout calls `auth.api.getSession({ headers: await headers() })`
2. Server action calls `auth.api.getSession({ headers: await headers() })` at the start
3. Client uses `authClient.useSession()` React hook
4. Cookie cache enabled (5 min) for reducing DB lookups

### Private Route Guard

1. `src/app/(private)/layout.tsx` is an async server component
2. Calls `auth.api.getSession({ headers: await headers() })`
3. If no session, redirects to `/login`
4. If authenticated, renders children normally

### Admin Route Guard

1. `src/app/(private)/admin/layout.tsx` is an async server component
2. Calls `auth.api.getSession({ headers: await headers() })`
3. If `session?.user?.role !== "admin"`, redirects to `/`
4. If admin, renders shadcn Sidebar layout

### Dashboard/Admin Sidebar Layout Pattern

1. Layout wraps children in `<SidebarProvider>`
2. `AppSidebar`/`AdminSidebar` component placed as first child (desktop sidebar)
3. Content area: `<SidebarTrigger>` + `<Separator>` + children
4. `<MobileNav>` component for fixed bottom navigation (hidden on md+)
5. Sidebar uses `variant="inset"`, `collapsible="icon"`, `className="top-16! h-[calc(100vh-4rem)]!"`

### S3 Image Proxy Flow

1. User requests `/api/images/wallpapers/{userId}/{uuid}-{name}.webp`
2. Route handler joins params into S3 key
3. Looks up wallpaper in DB where `imageUrl` or `thumbnailUrl` ends with the key
4. If wallpaper not found -> 404
5. If wallpaper is not public -> check session ownership -> 403 if unauthorized
6. Fetch object from S3 via `GetObjectCommand`
7. Stream response with appropriate Content-Type and Cache-Control headers
8. Catch S3 NoSuchKey/NotFound -> 404; other errors -> 500

### Server Action Pattern

1. File at `src/server/{domain}/{action}.ts` with `"use server"`
2. Export a single async function
3. Get session: `const session = await auth.api.getSession({ headers: await headers() })`
4. Validate permissions (admin check, ownership check)
5. Perform operation (DB query, S3 upload, etc.)
6. Resolve image URLs through `resolveImageUrl()` before returning
7. Return result or throw error

### Form Submission Pattern

1. Client validates with Zod schema (all mode)
2. Submit handler calls server action or auth API
3. On success: toast + reset form + router.replace("/") (or returnTo for login)
4. On error: toast error message
5. Button disabled during `isSubmitting`

### Admin User Management (via Better Auth API)

1. Server component calls `auth.api.listUsers({ query: { limit, offset }, headers: await headers() })`
2. Client component calls `authClient.admin.setRole()`, `authClient.admin.banUser()`, etc.
3. Better Auth handles authentication check (must be admin role)
4. Ban operation automatically revokes all user sessions
5. No custom server actions needed for these operations
