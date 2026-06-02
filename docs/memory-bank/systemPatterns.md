# System Patterns & Architecture

## Architecture Overview

- **Framework**: Next.js 16 (App Router) with React 19
- **Architecture Pattern**: Server Actions + RSC hybrid
- **Auth**: Better Auth with Prisma adapter
- **Database**: PostgreSQL via Neon (serverless)
- **Storage**: S3-compatible (Backblaze B2 / Cloudflare R2 / AWS S3)

## Route Groups

- `(public)/` — Unauthenticated routes (max-w-7xl centered layout)
- `(private)/` — Authenticated routes (redirects to /login if no session)

## Key Design Patterns

### Server Actions Pattern

All data mutations use `"use server"` functions in `src/server/`, organized by domain:

1. Get session via `auth.api.getSession({ headers: await headers() })`
2. Validate auth (user exists, admin check if needed)
3. Validate input (Zod schema or manual)
4. Execute database operation
5. Revalidate affected paths
6. Return typed response `{ success, data?, error? }`

### Image Pipeline

1. Upload: Client → FormData → Server validates → Sharp processes (thumbnail) → S3 upload
2. Serve: S3 proxy via `/api/images/[...key]` with auth-aware caching
3. URL resolution: `resolveImageUrl()` handles S3 key → proxy URL mapping

### Form Pattern (docs/form-patterns.md)

- `react-hook-form` + `zodResolver` + `Controller` pattern
- Custom shadcn-style components: `Field`, `FieldLabel`, `FieldError`
- Zod schemas in `src/lib/zodSchema.ts` with exported inferred types

### Component Architecture

- Feature components in `src/components/{Feature}/`
- Shared shadcn UI components in `src/components/shadcnui/`
- Providers (Theme, Toast) in `src/components/Providers/`

### Loading State Pattern (Admin Tables)

- Per-row loading tracked via `Set<string>` in state (not single `string | null`) to support concurrent operations
- Helper callbacks (`markLoading`, `clearLoading`) wrapped in `useCallback` for stable references

### Avatar Upload Flow

1. Client: File selected → `URL.createObjectURL` preview → FormData sent to server action
2. Server: Fetches existing user record (to capture old image URL) → validates session/file → uploads to S3 → persists URL to user DB record → cleans up S3 file on DB write failure → on success, extracts S3 key from old image URL via `extractS3Key` and `deleteFile`s the previous avatar
3. Client: On success, revokes object URL preview, calls `refetch()` from `authClient.useSession()` to update `session.user.image` immediately; no client-side `authClient.updateUser` call needed

## Data Flow

1. **Reads**: Server Components fetch data directly via Prisma → render
2. **Mutations**: Client → Server Action (RSC) → Database → revalidate path
3. **Auth**: Better Auth handles sessions; middleware redirects unauthenticated users

## Authentication Flow

- Better Auth with email/password credential provider
- Argon2 password hashing
- Rate limiting (login: 10/5min, register: 5/10min)
- Admin plugin for role-based access
- Session management with cookie cache (5min), 7-day expiry
