# dripwall — Full-Stack Wallpaper Platform

A modern wallpaper sharing platform built with **Next.js 16**, **React 19**, **Prisma 7** on **Neon Postgres**, and **Better Auth**. Features user uploads, collections, categories, admin management, and S3-compatible image storage.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack, React Compiler) |
| UI | [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com), [Base UI](https://base-ui.com) via [shadcn/ui](https://ui.shadcn.com) (style preset `base-rhea`) |
| Database | [Neon Postgres](https://neon.tech) (serverless) via [Prisma 7](https://prisma.io) & `@prisma/adapter-neon` |
| Auth | [Better Auth](https://better-auth.com) with password (Argon2), admin plugin, session management |
| Storage | S3-compatible object storage (Backblaze B2, Cloudflare R2, AWS S3) via `@aws-sdk/client-s3` |
| Forms | `react-hook-form` + `@hookform/resolvers/zod` |
| Tables | `@tanstack/react-table` |
| Icons | `lucide-react` |
| Themes | `next-themes` (dark default) |
| Package Manager | [Bun](https://bun.sh) |

## Features

- **User authentication** — Email/password sign-up, sign-in, password reset (Better Auth)
- **Argon2 password hashing** — Custom hashing with pepper sourced from `BETTER_AUTH_SECRET`
- **Rate limiting** — Per-endpoint rate limits (sign-in, registration, password reset, session checks)
- **Role-based access** — Admin and user roles via Better Auth admin plugin
- **Wallpaper management** — Upload, browse, search, download with image processing (sharp)
- **Categories & tags** — Browse wallpapers by category or tag
- **Collections** — Create and manage public/private collections
- **Likes & downloads** — Track user engagement
- **Admin dashboard** — Manage users, wallpapers, categories with data tables
- **Responsive design** — Mobile-friendly layout with sidebar navigation
- **Dark/light theme** — Persistent theme toggle (dark by default)
- **Toast notifications** — `react-toastify` for user feedback

## Prerequisites

- **Node.js** ≥ 22
- **Bun** (recommended) or **npm** ≥ 11
- A **Neon Postgres** database (or any PostgreSQL with connection pooling)
- An **S3-compatible** object storage bucket (Backblaze B2, Cloudflare R2, AWS S3, etc.)
- **Better Auth secret** (generate with `openssl rand -base64 32`)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/MrSaikatS/dripwall-fullstack-web.git
cd dripwall-fullstack-web
bun install
```

### 2. Set up environment variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Pooled Neon connection string (runtime) |
| `DIRECT_URL` | Direct Neon connection string (migrations) |
| `BETTER_AUTH_SECRET` | ≥ 32-char random string |
| `BETTER_AUTH_URL` | Base URL of your app |
| `S3_ENDPOINT` | S3-compatible endpoint |
| `S3_REGION` | S3 region |
| `S3_ACCESS_KEY_ID` | S3 access key |
| `S3_SECRET_ACCESS_KEY` | S3 secret key |
| `S3_BUCKET_NAME` | S3 bucket name |

### 3. Run database migrations

```bash
bun migrate
```

This runs `prisma migrate dev` and generates the Prisma client.

### 4. (Optional) Seed the database

```bash
bun seed
```

### 5. Start the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Command | Description |
|---|---|---|
| `bun dev` | `next dev` | Start development server |
| `bun build` | `prisma generate && next build` | Production build |
| `bun start` | `next start` | Start production server |
| `bun lint` | `eslint` | Run ESLint |
| `bun prod` | `prisma generate && eslint && next build && next start` | Full production pipeline |
| `bun migrate` | `prisma migrate dev && prisma generate` | Run migrations |
| `bun studio` | `prisma studio --browser none` | Open Prisma Studio (headless) |
| `bun seed` | `prisma db seed` | Seed database |

## Project Structure

```
src/
├── app/
│   ├── (public)/           # Public pages (login, register, forgot-password, reset-password, categories, wallpapers)
│   ├── (private)/          # Authenticated pages (dashboard, upload, collections, admin)
│   ├── api/
│   │   ├── auth/[...all]/  # Better Auth route handler
│   │   └── images/[...key]/# S3 image proxy
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Tailwind CSS v4 config
├── components/
│   ├── Admin/              # Admin dashboard components
│   ├── Auth/               # Login, register, password reset forms
│   ├── Category/           # Category grid and cards
│   ├── Collection/         # Collection management components
│   ├── Dashboard/          # User dashboard components
│   ├── Header/             # App header / navigation
│   ├── Providers/          # Theme and toast providers
│   ├── Wallpaper/          # Wallpaper grid, cards, upload form, detail view
│   └── shadcnui/           # Base UI primitives (shadcn/ui base-rhea)
├── lib/
│   ├── auth.ts             # Better Auth server instance
│   ├── auth-client.ts      # Better Auth client instance
│   ├── argon2.ts           # Custom Argon2 hash/verify
│   ├── database/dbClient.ts# Prisma client singleton
│   ├── env/                # T3 env validation (clientEnv.ts, serverEnv.ts)
│   ├── fileStorage.ts      # S3 upload/delete helpers
│   ├── imageProcessor.ts   # Sharp image resizing/thumbnails
│   ├── resolveImageUrl.ts  # S3 URL resolution
│   ├── types.ts            # Shared TypeScript types
│   ├── utils.ts            # cn(), slugify()
│   └── zodSchema.ts        # Zod validation schemas
├── hooks/                  # Shared React hooks
└── server/
    ├── admin/              # Admin server actions
    ├── category/           # Category server actions
    ├── collection/         # Collection server actions
    ├── user/               # User profile server actions
    └── wallpaper/          # Wallpaper CRUD server actions
prisma/
├── schema.prisma           # Database schema
├── seed.ts                 # Seed script
└── migrations/             # Migration history
```

## Database

- **Provider:** PostgreSQL (Neon serverless)
- **ORM:** Prisma 7 with `@prisma/adapter-neon` driver adapter
- **Client location:** `generated/prisma/client` (custom output path; import from `@generated/prisma/client`)
- **Connection pooling:** Runtime uses the pooled `DATABASE_URL`; CLI uses the direct `DIRECT_URL`
- **Key models:** `User`, `Session`, `Account`, `Wallpaper`, `Category`, `Tag`, `Collection`, `Like`, `Download`

### Schema changes

```bash
bun migrate    # Creates migration + generates client
```

Do not use `prisma db push` for production schema changes.

## Authentication

Powered by **Better Auth 1.6** with:

- **Email/password** authentication with custom Argon2 hashing (peppered with `BETTER_AUTH_SECRET`)
- **Admin plugin** for role-based access control (`role` field on User model)
- **Session management** — 7-day expiry, 1-day refresh window, cookie caching
- **Per-route rate limiting** — Different limits for sign-in, registration, password reset, and session checks
- **nextCookies plugin** for seamless server/client session handling

## Image Storage

- **Backend:** S3-compatible object storage (Backblaze B2 by default)
- **Processing:** Sharp for thumbnail generation and resizing
- **Keys follow:** `wallpapers/{userId}/{uuid}-{name}` with `thumb-` prefix for thumbnails
- **Access:** Direct via `S3_PUBLIC_URL` when configured, or proxied through the app's `/api/images/*` route

## Licensing

MIT — see [LICENSE](LICENSE).

Copyright (c) 2026 Saikat Sardar
