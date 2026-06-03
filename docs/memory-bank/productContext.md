# Product Context

## Why This Project Exists

DripWall is built to provide a modern, performant wallpaper sharing platform. It serves as both a portfolio piece demonstrating full-stack development skills and a functional application for wallpaper enthusiasts.

## Problems It Solves

- Centralized wallpaper discovery and collection
- High-quality image optimization with automatic thumbnail generation
- Secure upload and storage via S3-compatible object storage
- Role-based moderation for content quality control

## How It Should Work

- Users browse wallpapers in a responsive masonry grid
- Authenticated users can upload, like, download, and collect wallpapers
- Wallpapers are categorized for easy discovery
- Admins have a dedicated panel to manage content and users
- Images are served through a proxy layer for access control and caching

## User Experience Goals

- Fast page loads with SSR and optimized images
- Smooth dark/light theme switching
- Intuitive navigation between public browsing and authenticated features
- Responsive design working across desktop and mobile
- Minimal friction for common actions (like, download, upload)
- Accessible admin interface with proper aria labels and loading states
