# Progress: DripWall

## What Works

### Authentication

- [x] Better Auth configuration (Prisma adapter, SQLite, Argon2 hashing)
- [x] Email/password registration (`authClient.signUp.email()`)
- [x] Email/password login (`authClient.signIn.email()`)
- [x] Session management (7-day expiry, daily refresh, cookie cache)
- [x] Logout functionality
- [x] Session-aware UI (AuthHeader shows logged-in vs logged-out state)
- [x] Rate limiting per-endpoint (login: 10/5min, register: 5/10min, reset: 3/15min)
- [x] Admin plugin (role field, user banning, impersonation)
- [x] Remember me functionality

### UI Components

- [x] Button (with variants: default, outline, secondary, ghost, destructive, link)
- [x] Card (with Header, Title, Description, Content, Footer, Action)
- [x] Field system (Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet, etc.)
- [x] Input (with Base UI primitive)
- [x] Label
- [x] Separator
- [x] Skeleton (loading placeholder)
- [x] Avatar (with Image, Fallback, Badge, Group)
- [x] Header with auth-aware navigation
- [x] Theme toggle (dark/light with animated icons)

### Forms (Zod + react-hook-form + Controller pattern)

- [x] Login form
- [x] Register form (with confirm password validation)

### Pages

- [x] Home page (landing hero)
- [x] Login page
- [x] Register page
- [x] Forgot Password page (placeholder)

### Infrastructure

- [x] TypeScript strict mode configuration
- [x] ESLint (Next.js core-web-vitals + TypeScript)
- [x] Prettier (with Tailwind CSS plugin)
- [x] Environment variable validation (T3 Env)
- [x] CSS variables for light/dark theme
- [x] Font configuration (Geist sans)
- [x] Path aliases (`@/*`, `@generated/*`)

### Database

- [x] Prisma schema with all models
- [x] SQLite database configured (dev.db)
- [x] Prisma 7 with LibSQL driver adapter
- [x] Database migrations applied
- [x] Seed script (admin user + demo user + categories + tags)

## What's Left to Build

### High Priority

- [ ] **Forgot password flow** (reset email, reset password form)
- [ ] **Email verification** (`requireEmailVerification: true`)
- [ ] **Private route guard** (middleware or layout-level auth check)
- [ ] **Wallpaper CRUD** (upload, edit, delete wallpapers with server actions)

### Medium Priority

- [ ] **Wallpaper gallery** (grid display with filtering, sorting, pagination)
- [ ] **Category pages** (wallpapers filtered by category)
- [ ] **Tag system** (tag browsing, tag filtering)
- [ ] **Collections** (create, manage, view collections)
- [ ] **Like/Unlike** functionality (heart button, liked wallpapers page)
- [ ] **Download tracking** (download count, download history)
- [ ] **User profile page** (info, wallpapers, collections, likes)

### Low Priority

- [ ] **Admin dashboard** (user management, wallpaper moderation)
- [ ] **Wallpaper upload with image optimization** (sharp, thumbnails)
- [ ] **Search** (wallpaper search by title, description, tags)
- [ ] **View count tracking**
- [ ] **Featured wallpapers** (admin curation)

### Future Considerations

- [ ] **OAuth providers** (Google, GitHub login via Better Auth)
- [ ] **PostgreSQL/MySQL migration** (replace SQLite for production)
- [ ] **Image CDN** (optimized image delivery)
- [ ] **Rate limiting to Redis** (persistent rate limits across server restarts)
- [ ] **Unit/E2E tests**
- [ ] **CI/CD pipeline**

## Current Status

- **Phase**: Initial Scaffolding
- **Auth**: ✅ Complete (core flow functional)
- **UI**: ✅ Core components built, more needed
- **Database**: ✅ Schema defined, seeded
- **Wallpapers**: ❌ Not started (schema only)
- **Testing**: ❌ None
- **Production Deploy**: ❌ Not configured

## Known Issues

1. **Forgot Password**: Placeholder page, not functional
2. **Email Verification**: Disabled (TODO in auth.ts line 28)
3. **SQLite**: Only suitable for development, not production
4. **Rate Limiting**: In-memory, resets on server restart
5. **Password Reset**: Better Auth supports it but no UI implemented
6. **Server Actions**: `src/server/` directory empty (no server actions yet)
7. **Custom Hooks**: `src/hooks/` directory empty (no custom hooks yet)

## Evolution of Project Decisions

### Why Better Auth over NextAuth/Auth.js?

- Modern library with TypeScript-first design
- Built-in admin plugin for role management
- Argon2 support out of the box
- Simpler API surface for email/password auth

### Why Prisma 7 + LibSQL + SQLite?

- Prisma 7 introduces driver adapters for better database compatibility
- LibSQL provides SQLite-compatible driver with fewer dependencies
- SQLite is ideal for development (zero configuration, file-based)
- Easy to swap to PostgreSQL/MySQL later by changing the adapter

### Why shadcn Nova (Base UI) over Radix UI?

- shadcn Nova style is the latest shadcn evolution
- Base UI provides modern React primitives with better accessibility
- Smaller bundle size compared to Radix UI
- Customizable field system with proper form validation UX

### Why Controller pattern over register() in react-hook-form?

- Fine-grained re-renders (only the specific field re-renders)
- Better TypeScript inference
- Explicit control over field state and error display
- Consistent with shadcn form examples
