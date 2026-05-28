# System Patterns: DripWall

## System Architecture

The project follows **Next.js 16 App Router** architecture with a strict separation between client and server code.

```
src/
├── app/                    # Next.js App Router pages & API routes
│   ├── (private)/          # Authenticated routes (layout group)
│   ├── (public)/           # Public routes (login, register, forgot-password, home)
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   └── page.tsx        # Home page
│   ├── api/auth/[...all]/  # Better Auth API handlers
│   ├── globals.css         # Tailwind CSS 4 + Shadcn theme
│   └── layout.tsx          # Root layout with ThemeProvider, Header
├── components/             # React components
│   ├── Auth/               # Auth-related (LoginForm, RegisterForm, AuthHeader, LogoutButton)
│   ├── Buttons/            # ThemeToggleButton
│   ├── Header/             # App Header
│   ├── Providers/          # ThemeProvider, ToastProvider
│   └── shadcnui/           # Shadcn UI primitives (button, card, field, input, label, etc.)
├── hooks/                  # Custom hooks (empty, .gitkeep)
├── lib/                    # Shared utilities and configuration
│   ├── auth.ts             # Better Auth server instance
│   ├── auth-client.ts      # Better Auth client instance
│   ├── argon2.ts           # Password hashing utilities
│   ├── database/dbClient.ts # Prisma client singleton
│   ├── env/                # Server and client env validation (T3 Env)
│   ├── fonts.ts            # Geist font configuration
│   ├── types.ts            # Shared TypeScript types
│   ├── utils.ts            # cn() utility (clsx + tailwind-merge)
│   └── zodSchema.ts        # Zod schemas for forms
└── server/                 # Server-side logic (empty, .gitkeep)
```

## Key Technical Decisions

### Authentication: Better Auth

- Chosen for comprehensive auth out of the box (email/password, sessions, OAuth-ready, admin plugin)
- Uses Argon2 hashing with secret key from BETTER_AUTH_SECRET
- Prisma adapter with SQLite for persistence
- `nextCookies()` plugin for seamless Next.js integration
- `admin()` plugin for role-based access control

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

## Component Relationships

```
RootLayout
├── ThemeProvider (next-themes)
│   ├── ToastProvider (react-toastify)
│   └── Header
│       ├── AuthHeader
│       │   ├── Skeleton (loading state)
│       │   ├── LogoutButton (authenticated)
│       │   └── Sign in / Sign up links (unauthenticated)
│       └── ThemeToggleButton
└── <main> children
    ├── Home Page (public)
    ├── Login Page
    │   └── LoginForm (authClient.signIn.email)
    ├── Register Page
    │   └── RegisterForm (authClient.signUp.email)
    └── Forgot Password Page (placeholder)
```

## Critical Implementation Paths

### Authentication Flow

1. User submits form -> `authClient.signIn.email()` or `authClient.signUp.email()`
2. Better Auth validates credentials (Argon2 verify/hash)
3. Session created in SQLite via Prisma adapter
4. Cookie set with prefix `cit`, 7-day expiry, daily refresh
5. `authClient.useSession()` checks session via `GET /api/auth/get-session`
6. Admin plugin enables `user.role` field and impersonation

### Session Validation

1. `AuthHeader` calls `authClient.useSession()` (React hook)
2. Shows skeleton during `isPending`/`isRefetching`
3. Renders `LogoutButton` if session exists, auth links otherwise
4. Rate-limited: `/get-session` allows 60 requests per minute

### Form Submission Pattern

1. Client validates with Zod schema (all mode)
2. Submit handler calls auth API
3. On success: toast + reset form + router.replace("/")
4. On error: toast error message
5. Button disabled during `isSubmitting`
