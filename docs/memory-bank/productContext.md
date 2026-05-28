# Product Context: DripWall

## Why This Project Exists

DripWall was built to create a modern, full-stack wallpaper sharing platform with a focus on authentication best practices, clean architecture, and developer experience. It serves as a portfolio-quality application demonstrating proficiency with Next.js 16, Prisma ORM, Better Auth, and modern React patterns.

## Problems It Solves

1. **Secure Authentication**: Implements Argon2 password hashing, rate limiting, session management, and CSRF protection out of the box via Better Auth
2. **Organized Content**: Structured wallpaper data model with categories, tags, collections, and user relationships
3. **Modern Developer Experience**: TypeScript strict mode, Zod validation, React Compiler, Turbopack bundler
4. **Accessible UI**: Shadcn UI components built on Base UI with proper ARIA attributes and keyboard navigation

## How It Should Work

1. **Authentication Flow**
   - Users register with name, email, password
   - Login with email/password + optional "remember me"
   - Session persists for 7 days with daily refresh
   - Admin users can manage/impersonate other users
   - Rate limiting: 10 login attempts per 5 min, 5 registrations per 10 min

2. **Wallpaper Browsing**
   - Wallpapers displayed with metadata (title, dimensions, file size, format)
   - Filterable by category, tags
   - Sortable by popularity (download/view counts) or recency
   - Featured wallpapers highlighted

3. **User Collections**
   - Users can create public/private collections
   - Add/remove wallpapers from collections
   - Like wallpapers, track download history

## User Experience Goals

- **Seamless**: Fast page loads with React Compiler optimization, skeleton loading states
- **Consistent**: Unified form patterns (Zod + react-hook-form + Controller), shadcn component library
- **Responsive**: Mobile-first design with Tailwind CSS 4 responsive utilities
- **Accessible**: Proper labels, ARIA attributes, focus management, semantic HTML
- **Feedback-Rich**: Toast notifications for all actions (login, register, logout, errors)
- **Theme-Aware**: Dark/light mode with smooth icon transitions
