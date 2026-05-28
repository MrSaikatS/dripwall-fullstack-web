# Active Context: DripWall

## Current Work Focus

The project is in **initial scaffolding phase** with authentication nearly fully implemented. The core authentication flow (register, login, logout, session management, forgot/reset password) is complete and functional. The primary focus areas are:

1. **Authentication**: Complete and working (register, login, logout, session, forgot/reset password)
2. **Email Verification**: Disabled (TODO flag in auth.ts)
3. **Wallpaper Features**: Schema defined but no CRUD UI yet
4. **Private Routes**: Layout group exists (`(private)`) but empty

## Recent Changes

- Better Auth configured with Argon2 hashing, Prisma adapter, SQLite
- Login/Register forms implemented with react-hook-form + Zod + Controller pattern
- AuthHeader component shows session-aware UI (login/logout toggle)
- Theme switching (dark/light) with animated icon transition
- Toast notifications integrated for all auth actions
- Rate limiting configured per-endpoint
- Admin plugin enabled for role-based access control
- Shadcn UI primitive components created (button, card, field, input, label, separator, skeleton, avatar)
- ESLint configured with Next.js core-web-vitals + TypeScript configs
- Prettier configured with Tailwind CSS plugin
- Prisma schema defined with all models (User, Session, Account, Verification, Wallpaper, Category, Tag, WallpaperTag, Collection, CollectionItem, Like, Download)
- Database migrations applied, seed script created
- **Forgot/Reset password flow implemented**: ForgotPasswordForm, ResetPasswordForm components, server actions via Better Auth `forgetPassword`/`resetPassword` APIs
- Auth config updated with reset password endpoints and token expiration settings
- Zod schemas added for forgot/reset password validation
- LoginForm updated with "Forgot password?" link
- Memory bank documentation established

## Next Steps

1. **Enable email verification**: Update auth.ts `requireEmailVerification: true`, implement verification flow
2. **Build wallpaper CRUD**: Server actions for wallpaper upload/update/delete, gallery UI
3. **Create private layout**: Apply layout group with auth guard for authenticated routes
4. **User profile page**: Display user info, collections, downloads, likes
5. **Admin dashboard**: User management, wallpaper moderation
6. **Seed more data**: Additional wallpapers, categories, tags for demo
7. **Email transport**: Configure email service for password reset emails and verification

## Active Decisions & Considerations

### Forgot Password Implementation

- Implemented using Better Auth's built-in `forgetPassword`/`resetPassword` via the email/password plugin
- Reset token generated and stored by Better Auth, with configurable expiration
- Currently logs reset token to console (no email sending service configured yet)
- Will need email sending service for production use
- Both forgot password and reset password pages complete with form validation

### Email Verification

- Better Auth supports email verification via `sendVerificationEmail`
- Requires email transport configuration
- Currently disabled to simplify development
- Same email transport will serve both verification and password reset emails

### Private Route Guard

- Need to implement middleware or layout-level auth check
- Better Auth provides `auth.api.getSession()` for server-side checks
- Client-side: `authClient.useSession()` hook

### Database Migration to Production

- SQLite is only suitable for development
- Will need to switch to PostgreSQL/MySQL for production
- Prisma 7's driver adapter pattern supports multiple databases
- LibSQL adapter would need replacement

## Important Patterns & Preferences

### Code Style

- Single attribute per line in JSX (Prettier config)
- Bracket same line for objects
- Experimental ternaries enabled
- Tailwind CSS classes sorted via prettier-plugin-tailwindcss
- Use `@base-ui/react` primitives (not native HTML elements for interactive components)

### Form Pattern

- Always use `react-hook-form` with `zodResolver`
- `Controller` pattern for all fields (not register)
- `mode: "all"` for real-time validation
- `noValidate` on `<form>` element
- `<Field>` wrapper with `data-invalid` attribute
- `<FieldError>` component with `role="alert"`

### Error Handling

- try/catch in async handlers
- `toast.error()` for user-facing errors
- `console.error()` for debugging
- Graceful fallback messages for network errors

## Learnings & Insights

- Better Auth's `nextCookies()` plugin handles cookie management automatically
- Prisma 7 requires explicit driver adapter initialization (PrismaLibSql)
- The `admin()` plugin adds `role`, `banned`, `banReason`, `banExpires` fields to User model
- shadcn Nova style uses `data-slot` attributes for component styling
- Tailwind CSS 4 uses `@import` instead of `@tailwind` directives, and `@custom-variant` instead of `@variants`
- React Compiler requires `babel-plugin-react-compiler` dev dependency
- Zod v4 API differs from v3: uses object-style errors `{ error: "message" }` instead of string messages
