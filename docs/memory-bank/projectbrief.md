# Project Brief: DripWall Full-Stack Web

## Overview

DripWall is a full-stack wallpaper sharing platform that allows users to discover, collect, and share high-quality wallpapers. Built with Next.js 16, Prisma 7, Better Auth, and Tailwind CSS 4.

## Core Requirements

### Functional Requirements

1. **User Authentication**
   - Email/password registration and login via Better Auth
   - Session management with 7-day expiry
   - Remember me functionality
   - Password hashing with Argon2
   - Rate limiting on auth endpoints
   - `returnTo` redirect param on login flow

2. **User Roles & Permissions**
   - Admin role with elevated privileges
   - Standard user role
   - User banning capability
   - Impersonation support (via Better Auth admin plugin)

3. **Wallpaper Management**
   - CRUD operations for wallpapers
   - Categories, tags, collections
   - Download tracking
   - Like/unlike functionality
   - View count tracking
   - Featured wallpaper support
   - S3 image proxy with auth-based access control (private/public wallpapers)

4. **UI/UX**
   - Dark/light theme support via next-themes
   - Responsive design with Tailwind CSS 4
   - Shadcn UI components (Base UI powered) — including sidebar, sheet, tooltip
   - Toast notifications for user feedback
   - Loading states and skeleton screens
   - shadcn Sidebar for admin and dashboard layouts with mobile bottom nav
   - Collapsible sidebar with persisted state

### Non-Functional Requirements

- **Database**: SQLite (via Prisma + LibSQL adapter)
- **Performance**: React Compiler optimization enabled
- **Type Safety**: Full TypeScript with strict mode
- **Validation**: Zod schemas for forms and environment variables
- **Accessibility**: ARIA attributes, semantic HTML, keyboard navigation
- **Build Pipeline**: Prisma generate + Next.js build

## Project Status

- **Phase**: 9 (Polish & Cleanup) — ✅ All phases complete
- **Auth**: ✅ Complete (core flow functional + returnTo redirect)
- **Database**: ✅ Schema defined, seeded, signed URLs ready
- **UI**: ✅ All 16 shadcn components installed (13 original + sidebar, sheet, tooltip)
- **S3 Storage**: ✅ Client configured, upload/delete/signed URL functions + image proxy route
- **Image Processing**: ✅ Sharp processor installed (resize, thumbnail, metadata)
- **Wallpaper Upload**: ✅ Complete — Phase 2
- **Wallpaper Browsing & Detail**: ✅ Complete — Phase 3
- **Categories**: ✅ Complete — Phase 4
- **Collections**: ✅ Complete — Phase 5
- **Dashboard**: ✅ Complete — Phase 6 (migrated to shadcn Sidebar)
- **Navigation Update**: ✅ Complete — Phase 7
- **Admin Panel**: ✅ Complete — Phase 8 (migrated to shadcn Sidebar)
- **Polish & Cleanup**: ✅ Complete — Phase 9
- **Home Page**: ✅ Simplified to hero-only with session-aware CTA buttons
- **SEO Metadata**: ✅ Template-based titles + generateMetadata on all pages
- **UI Polish**: ✅ Centered hero, backdrop-blur header, upload image preview, shadcn Sidebar
- **Code Quality**: ✅ slugify extracted, error messages sanitized
- **S3 Image Proxy**: ✅ Next.js API route for proxying images with auth checks and streaming
- **Build**: ✅ Verified — 18 pages generated, lint 0 errors
