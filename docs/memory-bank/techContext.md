# Technical Context: DripWall

## Technology Stack

| Layer         | Technology                    | Version       |
| ------------- | ----------------------------- | ------------- |
| Framework     | Next.js                       | ^16.2.6       |
| Language      | TypeScript                    | ^5.9.3        |
| Package Mgr   | Bun                           | Latest        |
| Database      | SQLite (via Prisma + LibSQL)  | Prisma ^7.8.0 |
| Auth          | Better Auth                   | ^1.6.11       |
| UI            | shadcn/ui (Base UI)           | ^1.5.0        |
| CSS           | Tailwind CSS 4                | ^4.3.0        |
| Forms         | react-hook-form ^7.76.1       | -             |
| Validation    | Zod ^4.4.3                    | -             |
| Icons         | Lucide React                  | ^1.17.0       |
| Toasts        | react-toastify                | ^11.1.0       |
| Hashing       | @node-rs/argon2               | ^2.0.2        |
| Animation     | tw-animate-css                | ^1.4.0        |
| Env           | @t3-oss/env-nextjs            | ^0.13.11      |
| Image Storage | @aws-sdk/client-s3            | ^3.1056.0     |
| Signed URLs   | @aws-sdk/s3-request-presigner | ^3.1056.0     |
| Image Proc    | sharp                         | ^0.34.5       |
| File Picker   | use-file-picker               | ^2.1.4        |

## Development Setup

### Prerequisites

- Node.js >= 22.x
- npm >= 11.x (though Bun is the primary package manager)
- Visual Studio Code with TypeScript SDK configured

### Environment Variables

```env
# Database
DATABASE_URL=file:./prisma/dev.db
CHECKPOINT_DISABLE=1

# Better Auth
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_ALLOWED_ORIGINS=http://localhost:3000
BETTER_AUTH_TELEMETRY=0

# Backblaze B2 (S3-compatible)
S3_ENDPOINT=https://s3.us-west-004.backblazeb2.com
S3_REGION=us-west-004
S3_ACCESS_KEY_ID=<your-backblaze-key-id>
S3_SECRET_ACCESS_KEY=<your-backblaze-application-key>
S3_BUCKET_NAME=dripwall
S3_PUBLIC_URL=https://f002.backblazeb2.com/file/dripwall

# Client-side
NEXT_PUBLIC_S3_PUBLIC_URL=https://f002.backblazeb2.com/file/dripwall
```

### Available Scripts (package.json)

| Script  | Command                                                 |
| ------- | ------------------------------------------------------- |
| dev     | `next dev`                                              |
| build   | `prisma generate && next build`                         |
| start   | `next start`                                            |
| lint    | `eslint`                                                |
| prod    | `prisma generate && eslint && next build && next start` |
| migrate | `prisma migrate dev && prisma generate`                 |
| studio  | `prisma studio --browser none`                          |
| seed    | `prisma db seed`                                        |

### Key Configuration Files

- **`next.config.ts`**: React Compiler enabled, typed routes
- **`prisma.config.ts`**: Schema path, migrations, datasource (Prisma 7 format)
- **`tsconfig.json`**: ES2023 target, bundler module resolution, strict mode, path aliases `@/*` and `@generated/*`
- **`components.json`**: shadcn config with `base-nova` style, RSC enabled, ui path `@/components/shadcnui`
- **`postcss.config.mjs`**: Tailwind CSS 4 PostCSS plugin
- **`eslint.config.mjs`**: Next.js core-web-vitals + TypeScript configs
- **`.prettierrc`**: Bracket same line, experimental ternaries, Tailwind CSS plugin

## Technical Constraints

### Database

- **SQLite** is used for development (not production-ready for scale)
- LibSQL adapter provides SQLite-compatible driver interface
- Prisma 7 requires driver adapters (PrismaLibSql)
- No connection pooling (SQLite is file-based)

### Authentication

- Better Auth requires `BETTER_AUTH_SECRET` (min 32 chars)
- `BETTER_AUTH_URL` must be a valid URL
- Rate limiting is IP-based (in-memory, resets on server restart)
- Email verification is disabled (TODO)
- Password reset is implemented via Better Auth's built-in `forgetPassword`/`resetPassword` APIs
- Reset token is logged to console (no email transport configured yet)
- **Admin plugin**: provides `listUsers`, `setRole`, `banUser`, `unbanUser` via `auth.api.*` — no custom server actions needed for user management
- **Open redirect prevention**: `returnTo` param validated via `URL.canParse()` — only relative paths starting with `/` are allowed, preventing malicious redirects after login

### Image Storage & Delivery (Backblaze B2 via S3 + Next.js Proxy)

- Uses standard S3 API via `@aws-sdk/client-s3` v3 — fully compatible with Backblaze B2
- Bucket must be configured for private access (signed URLs for downloads)
- **Images served through `/api/images/[...key]` proxy** with auth-based access control:
  - Public wallpapers: accessible to anyone, long-term immutable cache
  - Private wallpapers: require active session + ownership, short-lived private cache
- `runtime = "nodejs"` required for the image proxy route (S3 SDK needs Node.js APIs)
- Handles three response body types: `Readable` (stream), `Blob`, and native `ReadableStream`
- **S3 key matching**: Uses `pathname.endsWith(key)` not `pathname.includes(key)` to prevent false-positive matches on partial key prefixes
- Sharp processes images before upload (resize, thumbnail generation)
- File naming convention: `wallpapers/{userId}/{uuid}-{original-name}`

### UI Framework (shadcn)

- Components use `@base-ui/react` primitives (not Radix UI)
- Style variant: `base-nova`
- Field components are custom implementations (field.tsx, label.tsx)
- Accessibility: `aria-invalid`, `role="alert"` on field errors, `htmlFor`/`id` pairing
- **Installed (16 total)**: avatar, badge, button, card, dialog, dropdown-menu, field, input, label, select, separator, sidebar, sheet, skeleton, textarea, tooltip
- Sidebar component uses `@base-ui/react` primitives (`useRender`, `mergeProps`) and `class-variance-authority`

### Next.js 16

- React Compiler enabled (`reactCompiler: true` in next.config.ts)
- Typed routes enabled (`typedRoutes: true`)
- TypeScript path aliases resolved via `tsconfig.json` paths
- ESLint config uses flat config format (eslint.config.mjs)
- Server actions use `"use server"` directive (not API routes)
- API routes used only for Better Auth handler and S3 image proxy

## Dependencies

### Runtime Dependencies

- `@aws-sdk/client-s3` - S3-compatible storage client
- `@aws-sdk/s3-request-presigner` - Signed URL generation for downloads
- `@base-ui/react` - UI primitives
- `@hookform/resolvers` - Zod resolver for react-hook-form
- `@node-rs/argon2` - Password hashing (Rust native)
- `@prisma/adapter-libsql` - Prisma 7 driver adapter
- `@prisma/client` - Prisma ORM client
- `@t3-oss/env-nextjs` - Environment variable validation
- `better-auth` - Authentication library
- `class-variance-authority` - Component variant API
- `clsx` / `tailwind-merge` - Class name utilities
- `lucide-react` - Icon library
- `next`, `react`, `react-dom` - Core web framework
- `next-themes` - Theme switching
- `react-hook-form` - Form state management
- `react-toastify` - Toast notifications
- `sharp` - Image processing (resize, thumbnail, metadata)
- `use-file-picker` - Client-side file selection with validation
- `zod` - Schema validation

### Dev Dependencies

- `@tailwindcss/postcss` - Tailwind CSS 4 PostCSS plugin
- `babel-plugin-react-compiler` - React Compiler Babel plugin
- `eslint` / `eslint-config-next` - Linting
- `eslint-plugin-react-hooks` - Hooks lint rules
- `prettier` / `prettier-plugin-tailwindcss` - Formatting
- `prisma` - Prisma CLI
- `shadcn` - shadcn CLI for component management
- `tailwindcss`, `tw-animate-css` - CSS framework
- `typescript` - Language compiler

## Tool Usage Patterns

### Form Creation Pattern

1. Add schema to `src/lib/zodSchema.ts`
2. Export `FormType` via `z.infer`
3. Create `"use client"` component
4. Use `useForm` + `zodResolver` + `Controller`
5. Use shadcn Field/Input/Button components
6. Handle submission with toast notifications
7. Navigate on success with `router.replace()` (use `returnTo` for login redirect)

### File Upload Pattern (Server Action)

1. Client: `use-file-picker` selects file with type/size validation
2. Client: Construct `FormData` with metadata fields + `file`
3. Client: Call `createWallpaper(fd)` server action
4. Server: Read file buffer via `file.arrayBuffer()`
5. Server: Validate buffer via `validateImageBuffer()` (header bytes, size)
6. Server: Process via `processImage()` (Sharp resize + thumbnail)
7. Server: Upload to S3 via `uploadFile()` from `fileStorage.ts`
8. Server: Create DB record with S3 keys + metadata
9. Client: On success, toast -> reset -> redirect

### Image URL Resolution Pattern

1. Store S3 keys in database (e.g., `wallpapers/{userId}/{uuid}-{name}.webp`)
2. Before returning data to client, call `resolveImageUrl()` on each URL field
3. `resolveImageUrl()` converts S3 keys to `/api/images/{encoded-key}` proxy URLs (each path segment URI-encoded via `encodeURIComponent`)
4. Full HTTP URLs (from `S3_PUBLIC_URL`) pass through unchanged
5. `extractS3Key()` reverses the conversion for operations needing the raw S3 key

### Database Access Pattern

1. Import default prisma client from `@/lib/database/dbClient`
2. Use Prisma-generated types from `@generated/prisma/client`
3. LibSQL adapter auto-initialized with DATABASE_URL
4. Singleton pattern prevents multiple instances in dev (hot reload)

### Environment Variable Pattern

1. Define schema in `src/lib/env/serverEnv.ts` (server vars) or `clientEnv.ts` (client vars)
2. Import schema files in `next.config.ts` for build-time validation
3. Access via `serverEnv.VARIABLE_NAME` or `clientEnv.VARIABLE_NAME`

### Server Action Pattern

1. Create file at `src/server/{domain}/{action}.ts`
2. Add `"use server"` directive at the top
3. Export a single async function
4. Get session: `import { headers } from "next/headers"` then `auth.api.getSession({ headers: await headers() })`
5. Perform domain logic (DB queries, S3 operations)
6. Resolve image URLs through `resolveImageUrl()` before returning
7. Return typed response

### Dashboard/Admin Sidebar Layout Pattern

1. Layout wraps children in `<SidebarProvider>`
2. Sidebar component (`AppSidebar`/`AdminSidebar`) as first child:
   - `variant="inset"` for rounded corners
   - `collapsible="icon"` for collapse/expand toggle
   - `className="top-16! h-[calc(100vh-4rem)]!"` for header offset
3. Content area: header with `<SidebarTrigger>` + `<Separator>`, then children in padded container
4. `<MobileNav>` component at bottom for mobile navigation (fixed, hidden on `md:`)

### Better Auth Admin API Pattern (No Custom Server Actions)

For user management, call Better Auth admin API directly:

1. Server component: `auth.api.listUsers({ query: { limit, offset }, headers: await headers() })`
2. Client component: `authClient.admin.setRole({ userId, role })`
3. Better Auth handles admin authentication automatically
4. Ban operation revokes all user sessions automatically
