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

4. **UI/UX**
   - Dark/light theme support via next-themes
   - Responsive design with Tailwind CSS 4
   - Shadcn UI components (Base UI powered)
   - Toast notifications for user feedback
   - Loading states and skeleton screens

### Non-Functional Requirements

- **Database**: SQLite (via Prisma + LibSQL adapter)
- **Performance**: React Compiler optimization enabled
- **Type Safety**: Full TypeScript with strict mode
- **Validation**: Zod schemas for forms and environment variables
- **Accessibility**: ARIA attributes, semantic HTML, keyboard navigation
- **Build Pipeline**: Prisma generate + Next.js build

## Project Status

- **Phase**: 2 (Wallpaper Upload) — ✅ Complete
- **Auth**: ✅ Complete (core flow functional)
- **Database**: ✅ Schema defined, seeded, signed URLs ready
- **UI**: ✅ All 13 shadcn components installed
- **S3 Storage**: ✅ Client configured, upload/delete/signed URL functions ready
- **Image Processing**: ✅ Sharp processor installed (resize, thumbnail, metadata)
- **Wallpaper Upload**: ✅ Complete — server action, form, auth-guarded page
- **Wallpaper Browsing**: ❌ Not started (next phase)
- **Collections**: ❌ Not started
- **Dashboard**: ❌ Not started
- **Admin Panel**: ❌ Not started
