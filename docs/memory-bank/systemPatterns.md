# System Patterns: DripWall

## System Architecture

The project follows **Next.js 16 App Router** architecture with a strict separation between client and server code.

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (private)/          # Authenticated routes (layout group)
│   │   ├── upload/         # Wallpaper upload
│   │   ├── collections/    # User collections
│   │   ├── dashboard/      # User dashboard
│   │   └── admin/          # Admin panel
│   ├── (public)/           # Public routes
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   ├── wallpapers/     # Wallpaper browsing & detail
│   │   ├── categories/     # Category browsing
│   │   └── page.tsx        # Home page
│   ├── api/auth/[...all]/  # Better Auth API handlers
│   ├── globals.css         # Tailwind CSS 4 + Shadcn theme
│   └── layout.tsx          # Root layout with ThemeProvider, Header
├── components/             # React components
│   ├── Admin/              # Admin panel components
│   ├── Auth/               # Auth-related (LoginForm, RegisterForm, AuthHeader, LogoutButton)
│   ├── Buttons/            # ThemeToggleButton
│   ├── Category/           # Category components
│   ├── Collection/         # Collection components
│   ├── Dashboard/          # Dashboard components
│   ├── Header/             # App Header
│   ├── Providers/          # ThemeProvider, ToastProvider
│   ├── shadcnui/           # Shadcn UI primitives (button, card, field, input, label, etc.)
│   └── Wallpaper/          # Wallpaper components (WallpaperUploadForm)
├── hooks/                  # Custom hooks (empty)
├── lib/                    # Shared utilities and configuration
│   ├── auth.ts             # Better Auth server instance
│   ├── auth-client.ts      # Better Auth client instance
│   ├── argon2.ts           # Password hashing utilities
│   ├── database/dbClient.ts # Prisma client singleton
│   ├── env/                # Server and client env validation (T3 Env)
│   ├── fileStorage.ts      # S3-compatible cloud storage client
│   ├── fonts.ts            # Geist font configuration
│   ├── imageProcessor.ts   # Sharp image processing
│   ├── types.ts            # Shared TypeScript types (+ PageParams, PaginatedResponse, ApiResponse)
│   ├── utils.ts            # cn() utility (clsx + tailwind-merge)
│   └── zodSchema.ts        # Zod schemas for forms (+ wallpaperUploadSchema)
└── server/                 # Server actions (one file per action)
    ├── wallpaper/          # Wallpaper CRUD — createWallpaper.ts
    ├── collection/         # Collection CRUD, add/remove items
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
- No `src/app/api/*` files beyond the existing Better Auth route handler
- Session access: `auth.api.getSession({ headers: await headers() })` within each action

### User Management: Better Auth Admin API (No Custom Server Actions)

User management operations use Better Auth's built-in admin plugin API directly:

- `auth.api.listUsers()` — paginated user list with search, filter, sort
- `auth.api.setRole()` — role changes
- `auth.api.banUser()` — ban with optional expiry + session revocation
- `auth.api.unbanUser()` — unban

These are called directly from page/layout server components or client components, not wrapped in custom server actions.

### Wallpaper Upload Flow (Phase 2)

1. Client: `WallpaperUploadForm` validates metadata (title, description, category) via react-hook-form + Zod
2. Client: `use-file-picker` handles file selection with type/size constraints
3. Client: Constructs `FormData` with metadata fields + file, calls `createWallpaper` server action
4. Server Action: Validates session via `auth.api.getSession()`
5. Server Action: Validates file type (JPEG/PNG/WebP/GIF/AVIF/TIFF) and size (max 50MB)
6. Server Action: Validates image buffer header bytes via `validateImageBuffer()`
7. Server Action: Sharp processes image — extracts metadata (width, height, format, fileSize), generates WebP thumbnail (400px, quality 80)
8. Server Action: Uploads original + thumbnail to S3 via `@aws-sdk/client-s3`
9. Server Action: Creates DB record with URLs, metadata, userId, categoryId, tags
10. Server Action: Revalidates paths (`/wallpapers`, `/`), returns success result
11. Client: On success, resets form, clears file, redirects to home

### Image Storage: Backblaze B2 via S3 API

- Using `@aws-sdk/client-s3` v3 with Backblaze B2's S3-compatible API
- `@aws-sdk/s3-request-presigner` for generating signed download URLs
- File naming: `wallpapers/{userId}/{uuid}-{original-name}`
- Thumbnails: `wallpapers/{userId}/thumb-{uuid}-{original-name}`

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
- 13 shadcn components installed: avatar, badge, button, card, dialog, dropdown-menu, field, input, label, select, separator, skeleton, textarea

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
- `slugify()` in `src/lib/utils.ts` — text to URL-safe slug (extracted from admin server actions to avoid duplication)

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
│       │   │   ├── Dashboard, Upload, Collections, Admin links
│       │   │   └── LogoutButton
│       │   └── AuthHeader (unauthenticated: sign-in/sign-up links)
│       └── ThemeToggleButton
└── <main className="pt-16"> children
    ├── (public) routes
    │   ├── Home Page (server component)
    │   │   ├── Hero section with CTAs (Browse Wallpapers, Upload)
    │   │   ├── Featured wallpapers grid → WallpaperGrid > WallpaperCard
    │   │   ├── Latest wallpapers grid → WallpaperGrid > WallpaperCard
    │   │   ├── Categories grid → CategoryGrid > CategoryCard
    │   │   └── Bottom CTA section → Button
    │   ├── Login Page → LoginForm
    │   ├── Register Page → RegisterForm
    │   ├── Forgot Password Page → ForgotPasswordForm
    │   ├── Reset Password Page → ResetPasswordForm
    │   ├── Wallpapers List → WallpapersPageContent > WallpaperGrid > WallpaperCard + Pagination
    │   ├── Wallpaper Detail → WallpaperDetail > LikeButton, DownloadButton
    │   └── Categories → CategoryCard
    └── (private) routes [auth guard]
        ├── Upload → WallpaperUploadForm
        ├── Collections → CollectionCard, CollectionForm, AddToCollectionModal
        ├── Dashboard → DashboardNav
        └── Admin → UserTable, CategoryManager
```

### Home Page Data Fetching Pattern

The home page (`src/app/(public)/page.tsx`) fetches multiple data sources concurrently in an async server component:

```typescript
const [featured, latest, categories] = await Promise.all([
  getWallpapers({ isFeatured: true, pageSize: 4 }),
  getWallpapers({ pageSize: 8, sortBy: "newest" }),
  getCategories(),
]);
```

Sections rendered: hero with CTAs, featured wallpapers grid (conditional), latest wallpapers grid with "View All" link, categories grid with "All Categories" link, and bottom CTA section.

### Layout Spacing

Root layout `<main>` uses `pt-16` to prevent content from being hidden behind the fixed header.

## Critical Implementation Paths

### Authentication Flow

1. User submits form -> `authClient.signIn.email()` or `authClient.signUp.email()`
2. Better Auth validates credentials (Argon2 verify/hash)
3. Session created in SQLite via Prisma adapter
4. Cookie set with prefix `cit`, 7-day expiry, daily refresh
5. `authClient.useSession()` checks session via `GET /api/auth/get-session`
6. Admin plugin enables `user.role` field and impersonation

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

### Server Action Pattern

1. File at `src/server/{domain}/{action}.ts` with `"use server"`
2. Export a single async function
3. Get session: `const session = await auth.api.getSession({ headers: await headers() })`
4. Validate permissions (admin check, ownership check)
5. Perform operation (DB query, S3 upload, etc.)
6. Return result or throw error

### Form Submission Pattern

1. Client validates with Zod schema (all mode)
2. Submit handler calls server action or auth API
3. On success: toast + reset form + router.replace("/")
4. On error: toast error message
5. Button disabled during `isSubmitting`

### Admin User Management (via Better Auth API)

1. Server component calls `auth.api.listUsers({ query: { limit, offset }, headers: await headers() })`
2. Client component calls `authClient.admin.setRole()`, `authClient.admin.banUser()`, etc.
3. Better Auth handles authentication check (must be admin role)
4. Ban operation automatically revokes all user sessions
5. No custom server actions needed for these operations
