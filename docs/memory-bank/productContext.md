# Product Context: DripWall

## Why This Project Exists

DripWall was built to create a modern, full-stack wallpaper sharing platform with a focus on authentication best practices, clean architecture, and developer experience. It serves as a portfolio-quality application demonstrating proficiency with Next.js 16, Prisma ORM, Better Auth, and modern React patterns.

## Problems It Solves

1. **Secure Authentication**: Implements Argon2 password hashing, rate limiting, session management, and CSRF protection out of the box via Better Auth
2. **Organized Content**: Structured wallpaper data model with categories, tags, collections, and user relationships
3. **Image Upload & Processing**: Sharp-based optimization (resize, WebP thumbnails) with S3-compatible cloud storage (Backblaze B2)
4. **Secure Image Delivery**: S3 image proxy (`/api/images/[...key]`) with auth checks — private wallpapers require session ownership, public wallpapers are cached long-term
5. **Modern Developer Experience**: TypeScript strict mode, Zod validation, React Compiler, Turbopack bundler, server actions (no API routes)
6. **Accessible UI**: Shadcn UI components built on Base UI with proper ARIA attributes and keyboard navigation
7. **Admin Capabilities**: User management via Better Auth admin plugin API, wallpaper/category moderation via custom server actions
8. **Responsive Navigation**: Dashboard and admin panels use shadcn Sidebar with collapsible sidebar on desktop and bottom nav on mobile

## How It Should Work

1. **Authentication Flow**
   - Users register with name, email, password
   - Login with email/password + optional "remember me"
   - Session persists for 7 days with daily refresh
   - Admin users can manage/impersonate other users via Better Auth admin plugin
   - Rate limiting: 10 login attempts per 5 min, 5 registrations per 10 min
   - Unauthenticated users clicking "Upload" are redirected to `/login?returnTo=/upload` and returned after login

2. **Wallpaper Browsing**
   - Wallpapers displayed with metadata (title, dimensions, file size, format)
   - Filterable by category, tags
   - Sortable by popularity (download/view counts) or recency
   - Featured wallpapers highlighted
   - Paginated results with server-side queries

3. **Wallpaper Upload & Storage**
   - Users upload image files via `use-file-picker` with client-side validation
   - Server action receives file, processes via Sharp (resize, thumbnail generation, metadata extraction)
   - Original + thumbnail uploaded to Backblaze B2 (S3-compatible) via `@aws-sdk/client-s3`
   - Database record created with URLs and metadata
   - Images served through `/api/images/[...key]` proxy route with auth-based access control
   - Downloads use signed URLs via `@aws-sdk/s3-request-presigner`

4. **User Collections**
   - Users can create public/private collections
   - Add/remove wallpapers from collections via shadcn Dialog modal
   - Like wallpapers, track download history

5. **User Dashboard**
   - Overview of user's uploaded wallpapers, likes, and downloads
   - Paginated lists for each section
   - shadcn Sidebar for navigation with collapsible desktop sidebar and mobile bottom nav

6. **Admin Panel**
   - User management via Better Auth admin plugin API
   - Wallpaper management (all wallpapers, toggle featured)
   - Category management (CRUD with server actions)
   - shadcn Sidebar for navigation with collapsible desktop sidebar and mobile bottom nav

## User Experience Goals

- **Seamless**: Fast page loads with React Compiler optimization, skeleton loading states
- **Consistent**: Unified form patterns (Zod + react-hook-form + Controller), shadcn component library
- **Responsive**: Mobile-first design with Tailwind CSS 4 responsive utilities, dedicated mobile bottom nav
- **Accessible**: Proper labels, ARIA attributes, focus management, semantic HTML
- **Feedback-Rich**: Toast notifications for all actions (login, register, logout, upload, errors)
- **Theme-Aware**: Dark/light mode with smooth icon transitions
- **SEO-Friendly**: Template-based metadata with dynamic `generateMetadata` on entity pages
- **Polished UI**: Centered hero layout, backdrop-blur header, image preview on upload, shadcn Sidebar
