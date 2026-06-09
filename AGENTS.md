<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:form-patterns -->

# Form Patterns

Schemas in `src/lib/zodSchema.ts` — export both schema and `type X = z.infer<typeof xSchema>`.

Components use `"use client"`, `react-hook-form` + `@hookform/resolvers/zod`, and shadcn primitives:

```typescript
const { handleSubmit, control, formState: { isSubmitting } } = useForm({
  resolver: zodResolver(mySchema),
  defaultValues: { ... },
  mode: "all",
});
```

Each field goes through `Controller`:

```typescript
<Controller
  name="fieldName"
  control={control}
  render={({ field, fieldState }) => (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={field.name}>Label</FieldLabel>
      <Input {...field} id={field.name} aria-invalid={fieldState.invalid} autoComplete="..." />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  )}
/>
```

Submit: `<form onSubmit={handleSubmit(handler)} noValidate>`. Button disabled while submitting with icon toggle.

See existing examples under `src/components/Auth/`.

<!-- END:form-patterns -->

## Agent behavior

- **Ask questions.** When ambiguous, when there are real implementation choices with tradeoffs, or before destructive actions, use the `question` tool. Prefer one batched question over back-and-forth guessing.
- **Remember new learning.** When you discover a gotcha, convention, or command not documented here, add it back. Keep entries concise; delete stale ones.
- **Use skills.** Before writing code for a task matching a listed skill (`shadcn`, `prisma-*`, `better-auth-*`, etc.), load it with the `skill` tool.

## Stack at a glance

- Next.js 16.2 + React 19.2 (App Router, Turbopack default, React Compiler on, `typedRoutes: true`)
- Prisma 7 on **Neon Postgres** via `@prisma/adapter-neon` (serverless driver)
- Better Auth 1.6 with the `admin` + `nextCookies` plugins; Argon2 password hashing via `@node-rs/argon2`
- S3-compatible object storage (Backblaze B2 by default) via `@aws-sdk/client-s3`; `sharp` for image processing
- Tailwind CSS v4 (CSS-only config in `globals.css`; no `tailwind.config.ts`)
- shadcn/ui (style preset `base-rhea`) with primitives from `@base-ui/react` (not Radix)
- `next-themes` (default `dark`, `enableSystem={false}`), `react-toastify`, `react-hook-form` + `@hookform/resolvers/zod`
- `@t3-oss/env-nextjs` + Zod v4 for env validation
- Zod v4 throughout (`zod`), compatible with `z.infer`, `.min()`, `.refine()`, etc.
- `next.config.ts` sets `serverActions.bodySizeLimit: "10mb"`

## Verification

- **Lint**: `bun lint` — ESLint with `eslint-config-next` core-web-vitals + typescript.
- **Type gate**: `bun run build` — runs `prisma generate && next build`. No separate `typecheck` script and no test framework; TypeScript errors surface only during build.
- **Full prod**: `bun prod` — `prisma generate && eslint && next build && next start`. Run before schema or env changes.
- No CI workflows. `.github/dependabot.yml` is the only thing under `.github/` (daily npm updates).

## Prisma (v7, custom output, Neon)

- Generator: `provider = "prisma-client"`, `output = "../generated/prisma"`. This is the Prisma 7 generator, **not** `prisma-client-js`. Import as `import { PrismaClient } from "@generated/prisma/client"` — never from `@prisma/client` (even though it's in deps).
- `prisma/schema.prisma` has **no** `datasource.url`. URLs are wired through `prisma.config.ts` and the runtime client separately:
  - `prisma.config.ts` uses `env("DIRECT_URL")` — the **unpooled** Neon URL, for the Prisma CLI (`migrate`, `studio`, `db seed`).
  - `src/lib/database/dbClient.ts` uses `serverEnv.DATABASE_URL` — the **pooled** Neon URL, for runtime queries via `PrismaNeon` adapter.
  - Both must be set. `serverEnv` validates `DATABASE_URL` starts with `postgres`.
- `dbClient.ts` is a `globalThis` singleton (HMR-safe). Do not instantiate `PrismaClient` elsewhere — except in `prisma/seed.ts`, which intentionally builds its own adapter+client (it runs outside the Next runtime).
- Initial migration `prisma/migrations/20260601154748_neon_init` exists. Schema changes go through `bun migrate` (`prisma migrate dev && prisma generate`), not `prisma db push`.
- `bun studio` runs headless (`--browser none`); open the printed URL manually.
- `bun seed` runs `prisma db seed`, which `prisma.config.ts` resolves to `bun prisma/seed.ts`.
- `generated/**` is gitignored and excluded from ESLint. Do not hand-edit generated files.
- `build` and `prod` scripts prepend `prisma generate` — raw `next build` will fail with missing types if the client is stale.
- Quirk: `src/lib/auth.ts` passes `prismaAdapter(prisma, { provider: "sqlite" })` even though the DB is Postgres. This is intentional for the current Better Auth wiring — don't "correct" it without testing.

## Env validation (T3 env)

- `src/lib/env/clientEnv.ts` and `src/lib/env/serverEnv.ts` define Zod schemas via `@t3-oss/env-nextjs`.
- `serverEnv.ts` uses `experimental__runtimeEnv: process.env`. The `experimental__` prefix is required for non-Next-runtime access (Prisma CLI, seed script) — keep it verbatim.
- `next.config.ts` imports both env modules **as side effects** at the top so validation runs at load time. Do not remove those imports.
- Required server vars (see `.env.example`): `DATABASE_URL`, `DIRECT_URL`, `BETTER_AUTH_SECRET` (≥32 chars), `BETTER_AUTH_URL`, `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`. Optional: `BETTER_AUTH_ALLOWED_ORIGINS` (comma-separated), `S3_PUBLIC_URL`, `NEXT_PUBLIC_S3_PUBLIC_URL`, `CHECKPOINT_DISABLE`, `BETTER_AUTH_TELEMETRY`.
- New vars: add to `serverEnv.ts` (server) or `clientEnv.ts` (must be `NEXT_PUBLIC_*`) and mirror in `.env.example`.

## Auth (Better Auth)

- Server instance: `src/lib/auth.ts`. Client instance: `src/lib/auth-client.ts` (uses `inferAdditionalFields<typeof auth>` + `adminClient`).
- Route handler: `src/app/api/auth/[...all]/route.ts` — single line, `toNextJsHandler(auth)` exports `GET`/`POST`.
- Password hashing is **custom** (`@node-rs/argon2` with `BETTER_AUTH_SECRET` as the pepper, see `src/lib/argon2.ts`). Do not call `argon2` directly elsewhere — go through `hashPasswordFunction` / `verifyPasswordFunction`.
- Auth config: cookie prefix `cit`, `nextCookies()` plugin, custom per-route rate limits (`/sign-in/*`, `/sign-up/*`, `/reset-password/*`, `/get-session`). `sendResetPassword` currently `console.log`s — no email service wired yet.
- Session reads on the server use `auth.api.getSession({ headers: await headers() })` (Next 16 async headers).

## App layout & route groups

- `src/app/(public)/` — unauthenticated pages (landing, categories, wallpapers, login/register/forgot/reset). Layout wraps in `mx-auto max-w-7xl`.
- `src/app/(private)/` — `layout.tsx` redirects to `/login` if no session. **Any page that requires auth must live under `(private)/`**.
- `src/app/api/images/[...key]/route.ts` — proxy/auth-gate for S3 objects when `S3_PUBLIC_URL` isn't set. Forces `runtime = "nodejs"` (needed for AWS SDK + stream conversion). Any route using `sharp`, `@node-rs/argon2`, or AWS SDK must also set `runtime = "nodejs"`.
- `next.config.ts` allows `images.remotePatterns` `{ protocol: "https", hostname: "**" }`.

## Server actions (`src/server/`)

- Layout: `src/server/<domain>/<actionName>.ts` (domains: `admin`, `category`, `collection`, `user`, `wallpaper`). **One action per file**, each starts with `"use server"`.
- **Mutations** (create, update, delete, toggle) return `{ success: boolean; data?: T; error?: string }` — matching `ApiResponse<T>` in `src/lib/types.ts`. Throw only for exceptional cases; surface user-facing problems via `error`.
- **Read-only queries** (`getWallpapers`, `getCategories`, `getUserWallpapers`, etc.) return domain types directly (`PaginatedResponse<T>`, `CategoryListItem[]`, etc.) — no success/error envelope.
- **Auth gating**: mutations and private queries gate with `auth.api.getSession(...)`. Public read queries (e.g. `getCategories`, `getWallpapers`) skip the gate.
- Mutations call `revalidatePath(...)` on affected routes after writes.
- File uploads go through `src/lib/fileStorage.ts` (S3 helpers) and `src/lib/imageProcessor.ts` (sharp). Keys follow `wallpapers/{userId}/{uuid}-{name}` with a `thumb-` prefix for thumbnails.

## Styling

- Tailwind v4: all config lives in `src/app/globals.css` via `@theme inline` and `@custom-variant`. PostCSS plugin is `@tailwindcss/postcss`. There is no `tailwind.config.ts` — do not create one.
- `globals.css` imports `shadcn/tailwind.css` and `tw-animate-css`; removing either breaks the Base Rhea tokens or animations.
- Prettier: `singleAttributePerLine: true`, `bracketSameLine: true`, `experimentalTernaries: true`, `prettier-plugin-tailwindcss` enabled. New JSX: one prop per line, closing bracket on the same line as the tag.

## shadcn / Base UI

- `components.json` sets `style: "base-rhea"`, `ui` → `@/components/shadcnui` (not the default `@/components/ui`), `hooks` → `@/hooks`. Add components with `bunx shadcn add ...`; they land in `src/components/shadcnui/`.
- Primitives come from `@base-ui/react` (e.g. `Button as ButtonPrimitive` from `@base-ui/react/button`). Do not introduce Radix or `react-aria` primitives — they don't share Base Rhea styling.
- App components live under `src/components/<Domain>/<Name>.tsx` (PascalCase folders and files). Only shadcnui primitives use kebab-case filenames.

## Notable dependencies

- **`react-masonry-css`** — wallpaper grid layout. Import from `react-masonry-css` (no types needed).
- **`use-file-picker`** — file selection in upload forms. See existing forms under `src/components/Wallpaper/`.
- **`@tanstack/react-table`** — admin data tables. See `src/components/Admin/`.
- **`lucide-react`** — icon library used throughout.

## Useful libraries & utilities

- `cn(...)` and `slugify(...)` in `src/lib/utils.ts`. Use these; don't reinvent.
- `LayoutChildrenProps` and `ApiResponse<T>` in `src/lib/types.ts`.
- Image resolution helpers: `src/lib/resolveImageUrl.ts`, `src/lib/imageProcessor.ts`.

## Path aliases (`tsconfig.json`)

- `@/*` → `./src/*`
- `@generated/*` → `./generated/*` (Prisma client only)

## Package manager

- `bun.lock` is committed; Bun is the primary workflow (`bun install`, `bun <script>`, `bunx shadcn ...`). npm works (`node >=22`, `npm >=11` in `engines`) but configs are written around Bun. `prisma db seed` shells out to `bun prisma/seed.ts`.

## Misc

- ESLint ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`, `generated/**`.
- `.env` is gitignored; `.env.example` is the committed template. Do not commit secrets.
- `CHECKPOINT_DISABLE=1` silences Prisma telemetry; `BETTER_AUTH_TELEMETRY=0` silences Better Auth telemetry.
- VSCode: `typescript.tsdk` set to `node_modules/typescript/lib`.
