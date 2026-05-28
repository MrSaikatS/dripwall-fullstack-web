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
| Image Storage | @aws-sdk/client-s3            | latest        |
| Signed URLs   | @aws-sdk/s3-request-presigner | latest        |
| Image Proc    | sharp                         | ^0.34.5       |

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

# Backblaze B2 (S3-compatible) — TODO: Add these
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

### Image Storage (Backblaze B2 via S3)

- Uses standard S3 API via `@aws-sdk/client-s3` v3 — fully compatible with Backblaze B2
- Bucket must be configured for private access (signed URLs for downloads)
- Sharp processes images before upload (resize, thumbnail generation)
- File naming convention: `wallpapers/{userId}/{uuid}-{original-name}`

### UI Framework (shadcn)

- Components use `@base-ui/react` primitives (not Radix UI)
- Style variant: `base-nova`
- Field components are custom implementations (field.tsx, label.tsx)
- Accessibility: `aria-invalid`, `role="alert"` on field errors, `htmlFor`/`id` pairing
- **Installed**: avatar, button, card, field, input, label, separator, skeleton
- **To install**: dropdown-menu, dialog, badge, select, textarea

### Next.js 16

- React Compiler enabled (`reactCompiler: true` in next.config.ts)
- Typed routes enabled (`typedRoutes: true`)
- TypeScript path aliases resolved via `tsconfig.json` paths
- ESLint config uses flat config format (eslint.config.mjs)
- Server actions use `"use server"` directive (not API routes)

## Dependencies

### Runtime Dependencies

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

### Pending Install

- `@aws-sdk/client-s3` — S3-compatible storage client
- `@aws-sdk/s3-request-presigner` — Signed URL generation for downloads

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
7. Navigate on success with `router.replace()`

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
6. Return typed response

### Better Auth Admin API Pattern (No Custom Server Actions)

For user management, call Better Auth admin API directly:

1. Server component: `auth.api.listUsers({ query: { limit, offset }, headers: await headers() })`
2. Client component: `authClient.admin.setRole({ userId, role })`
3. Better Auth handles admin authentication automatically
4. Ban operation revokes all user sessions automatically
