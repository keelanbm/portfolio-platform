# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (runs on localhost:3000)
- `npm run build` - Build for production (includes Prisma generation)
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting
- `npm run seed` - Seed database with sample data using tsx

## Architecture Overview

This is a **design portfolio platform** built with Next.js 15, Prisma, PostgreSQL, and Clerk authentication. The platform allows designers to showcase projects with social features like likes, follows, and comments.

### Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM, PostgreSQL
- **Authentication**: Clerk (replaces Supabase Auth mentioned in README)
- **UI Components**: Radix UI primitives with custom styling
- **State Management**: TanStack Query for server state
- **Deployment**: Vercel

### Project Structure

**App Router Organization**:
- `src/app/(auth)/` - Authentication pages (login, signup)
- `src/app/(dashboard)/` - Protected dashboard pages
- `src/app/(public)/` - Public pages
- `src/app/api/` - API routes for CRUD operations

**Key API Routes**:
- `/api/projects/` - Project CRUD and project-specific operations
- `/api/users/[username]/` - User profile data
- `/api/discover/` - Feed discovery and recommendations
- `/api/comments/` - Comment system with threading
- `/api/notifications/` - User notifications
- `/api/webhooks/clerk/` - Clerk authentication webhooks

**Component Architecture**:
- `src/components/ui/` - Reusable UI primitives (Radix-based)
- `src/components/*/` - Feature-specific components (create, discover, profile, etc.)
- Each feature has its own skeleton components for loading states

### Database Schema (Prisma)

**Core Models**:
- `User` - User profiles with subscription tiers (FREE/PRO), optional wallet addresses
- `Project` - Design projects with slides, metadata, and Web3 fields (IPFS, contract addresses)
- `ProjectSlide` - Individual project images with ordering
- `Comment` - Threaded comment system with types (COMMENT/QUESTION/ANSWER)
- `Like` - Unified like/vote system for projects and comments with vote types
- `Follow` - User following relationships
- `Notification` - User notification system

**Key Features**:
- Projects support 1-10 images per project based on subscription tier
- Comments support threading and can be questions/answers with acceptance
- Web3 integration ready with IPFS hashes and NFT minting capability
- Social features: likes, saves, follows with proper relationships

### Authentication & Authorization

Uses **Clerk** for authentication with middleware at `src/middleware.ts`. The middleware protects all routes except static files and public assets.

**Important**: The codebase switched from Supabase Auth (mentioned in README) to Clerk. All authentication logic uses Clerk's Next.js integration.

### Database Management

- Database connection: `src/lib/prisma.ts` with connection health checking
- Run `npx prisma generate` after schema changes
- Run `npx prisma db push` to sync schema to database
- Use `npm run seed` to populate with sample data

### Key Libraries & Patterns

- **TanStack Query** for server state management and caching
- **Radix UI** for accessible UI primitives
- **Lucide React** for icons
- **date-fns** for date formatting
- **Sonner** for toast notifications
- **React Dropzone** for file uploads

### Development Notes

- The project uses Next.js 15 with React 19 (latest versions)
- TypeScript is configured throughout
- Tailwind with custom CSS variables for theming
- Components follow shadcn/ui patterns for consistency
- API routes use proper HTTP methods and error handling
- Database queries use Prisma Client with proper error handling

### Production Deployment

- **Production Domain**: https://hifi.design
- **Platform**: Vercel (recommended for Next.js)
- **Database**: Supabase PostgreSQL with connection pooling
- **Authentication**: Clerk with webhook integration
- **File Storage**: Supabase Storage for project images
- **Environment**: Update `NEXT_PUBLIC_APP_URL` to production domain
- **Monitoring**: Built-in health checks at `/api/health`