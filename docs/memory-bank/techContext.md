# Technical Context

## Technologies

| Technology         | Version   | Role                 |
| ------------------ | --------- | -------------------- |
| Next.js            | ^16.2.6   | Full-stack framework |
| React              | ^19.2.6   | UI library           |
| TypeScript         | ^5.9.3    | Type safety          |
| Prisma             | ^7.8.0    | ORM + Neon adapter   |
| PostgreSQL (Neon)  | —         | Database             |
| Better Auth        | ^1.6.11   | Authentication       |
| @aws-sdk/client-s3 | ^3.1056.0 | S3 storage           |
| sharp              | ^0.34.5   | Image processing     |
| Tailwind CSS       | ^4.3.0    | Styling              |
| shadcn/ui          | ^4.9.0    | Component library    |
| react-hook-form    | ^7.76.1   | Form management      |
| zod                | ^4.4.3    | Schema validation    |
| @t3-oss/env-nextjs | ^0.13.11  | Env validation       |

## Development Setup

- **Package Manager**: Bun
- **Runtime**: Node >= 22.x
- **Key scripts**: `bun dev`, `bun run build`, `bun run lint`, `bun run migrate`
- **Database**: Neon PostgreSQL (pooled URL for runtime, direct URL for migrations)
- **Prisma config**: New format (`prisma.config.ts`), custom generated client location (`../generated/prisma`)

## Project Structure

```
src/
  app/         — Next.js App Router (route groups: (public)/, (private)/)
  components/  — React components by feature + shadcnui/
  hooks/       — Custom hooks (use-mobile)
  lib/         — Shared utilities, config, env validation, types
  server/      — Server actions by domain (wallpaper, category, collection, admin, user)
prisma/        — Schema, migrations, seed
docs/          — Documentation (form-patterns.md, memory-bank/)
generated/     — Prisma client output
```

## Key Technical Decisions

1. **Server Actions over REST APIs** for data mutations
2. **Prisma + Neon** for serverless PostgreSQL with connection pooling
3. **S3 proxy** (`/api/images/[...key]`) for auth-aware image serving
4. **Custom UI path** (`@/components/shadcnui/` instead of `@/components/ui/`)
5. **React Compiler** enabled (`reactCompiler: true` in next.config.ts)
6. **Typed routes** enabled for type-safe routing

## Environment Variables

- `DATABASE_URL` — Pooled Neon URL (runtime)
- `DIRECT_URL` — Direct Neon URL (migrations)
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_ALLOWED_ORIGINS`
- `S3_ENDPOINT`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`

## Database Models

User, Session, Account, Verification, Wallpaper, Category, Tag, WallpaperTag, Collection, CollectionItem, Like, Download
