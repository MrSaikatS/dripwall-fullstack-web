# Progress

## What Works

- ✅ Next.js 16 App Router with route groups (public/private)
- ✅ Database schema and Prisma 7 configuration
- ✅ Better Auth with email/password, admin plugin, rate limiting
- ✅ User registration, login, password reset flows
- ✅ Wallpaper upload with Sharp processing (thumbnails)
- ✅ S3-compatible storage integration
- ✅ Image serving proxy with auth-aware caching
- ✅ Wallpaper browsing with masonry grid and pagination
- ✅ Like/unlike functionality
- ✅ Download tracking
- ✅ Collections CRUD
- ✅ Category browsing
- ✅ Admin panel (stats, wallpaper management, category management, user management)
- ✅ User dashboard (overview, wallpapers, likes, profile)
- ✅ Dark/light theme (dark default)
- ✅ Responsive layout with sidebar navigation
- ✅ Seed data with categories, tags, sample content, demo users
- ✅ Form patterns with react-hook-form + zod

## What's Left to Build

- ⬜ Email verification flow (currently disabled)
- ⬜ Production deployment configuration
- ⬜ Search functionality for wallpapers
- ⬜ Tag-based filtering/browsing
- ✅ User avatar upload with old-avatar cleanup from S3 storage
- ⬜ OAuth providers (Google, GitHub, etc.)
- ⬜ Analytics / view tracking refinements
- ⬜ Rate limit tuning for production

## Known Issues

- `prismaAdapter` provider string is `"sqlite"` despite using PostgreSQL — may need correction
- Email verification is disabled — should be enabled for production
- No automated test suite configured

## Evolution of Decisions

- Moved from REST API routes to Server Actions for all mutations
- Custom shadcnui path chosen over default `@/components/ui`
- S3 proxy pattern chosen for auth-aware image serving
- Prisma client output redirected outside default `node_modules/.prisma`
- Avatar upload refactored to persist URL to DB inside the server action (avoids dual client/server writes)
- Admin table loading states moved from single `string | null` to `Set<string>` for concurrent-operation safety
- Profile page object URL lifecycle managed with `useRef` + cleanup `useEffect` to prevent memory leaks
