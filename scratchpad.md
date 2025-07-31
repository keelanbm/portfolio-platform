# Design Portfolio Platform - Development Scratchpad

# Background and Motivation

The goal is to create a Web2-first design portfolio platform that functions similar to Dribbble, with optional Web3 features for true ownership and permanence. After Dribbble's shutdown that deleted many designers' portfolios, there's a clear market need for a platform where designers truly own their work. The platform will start as a traditional social media-style portfolio site but offer optional blockchain integration for users who want permanent ownership and IPFS storage.

## Development Constraints & Strategy
- **Solo Developer**: Focus on maintainable, well-documented code with minimal external dependencies
- **Low Budget MVP**: Prioritize free tiers and cost-effective services, defer expensive features
- **Flexible Timeline**: Quality over speed, iterate based on user feedback
- **Risk Tolerant**: Willing to experiment with Web3 features but Web2-first approach
- **Low Stakes**: Can afford to pivot or fail fast, focus on learning and validation

# Key Challenges and Analysis
- Balance between Web2 accessibility and Web3 ownership benefits
- Cost management - IPFS pinning and blockchain operations can be expensive at scale
- User onboarding - need to serve both crypto-native and traditional designers
- Storage strategy - hybrid approach with traditional cloud + optional IPFS
- Monetization without alienating free users
- Performance with image-heavy content and social features
- Smart contract security for NFT minting and marketplace features

# High-level Task Breakdown

## 1. Foundation & Setup (Phase 1: 3-4 weeks)
- [ ] Project initialization with Next.js 14, TypeScript, Tailwind
- [ ] Database setup with Supabase (free tier) and Prisma ORM
- [ ] Authentication system with Clerk (email/password + social logins + Web3)
- [ ] Basic user registration and profile creation
- [ ] File upload system with Supabase Storage (free tier)
- [ ] Basic image optimization (resize, WebP conversion)
- [ ] Essential UI components with shadcn/ui

## 2. Core Portfolio Features (Phase 1 continued)
- [ ] Project creation and management system
- [ ] Multi-slide project uploads (1-10 images for MVP)
- [ ] Cover image selection functionality
- [ ] Project metadata (title, description, tags)
- [ ] Default tag system implementation (no custom tags initially)
- [ ] Public project display pages
- [ ] User profile pages with project galleries

## 3. Social Features (Phase 2: 2-3 weeks)
- [ ] Like system for projects
- [ ] Save/bookmark functionality for users
- [ ] Follow/following system between users
- [ ] Basic activity feed showing followed users' projects
- [ ] Simple discovery feed (recent projects)
- [ ] Basic search functionality (projects by title/tags)
- [ ] **Defer**: Comment system, advanced search, trending algorithms

## 4. Subscription & Monetization (Phase 3: 2-3 weeks)
- [ ] Simple subscription tier system (Free: 3 slides, Pro: 10 slides)
- [ ] Stripe payment integration (basic)
- [ ] Usage limits enforcement (slide counts per tier)
- [ ] **Defer**: Analytics, custom domains, team features
- [ ] Basic billing management

## 5. Web3 Integration (Phase 4: 2-3 weeks)
- [ ] Wallet connection with RainbowKit/wagmi
- [ ] IPFS integration with web3.storage (free tier)
- [ ] Simple smart contract on Base testnet
  - [ ] Basic ProjectNFT contract for individual project minting
  - [ ] **Defer**: ProfileNFT, Marketplace contracts
- [ ] Optional IPFS backup for projects (Pro users only)
- [ ] Basic NFT minting interface
- [ ] **Defer**: Download functionality, Web3 profile enhancements

## 6. Performance & Optimization (Phase 5: 1-2 weeks)
- [ ] Basic image optimization and lazy loading
- [ ] Database query optimization and indexing
- [ ] **Defer**: Redis caching, CDN setup
- [ ] Basic SEO optimization for public profiles and projects
- [ ] **Defer**: Advanced analytics, performance monitoring

## 7. Deployment & DevOps (Phase 6: 1 week)
- [ ] Production deployment on Vercel (free tier)
- [ ] Supabase production database setup
- [ ] Basic error tracking (Vercel Analytics)
- [ ] **Defer**: Staging environment, advanced monitoring, security audit

# Project Status Board

## Foundation & Setup
- [x] Next.js 14 project initialized with TypeScript and Tailwind
- [x] Project structure created with organized directories
- [x] Prisma ORM setup with initial schema design
- [x] Supabase client configuration created
- [x] TypeScript types defined for all models
- [x] Utility functions created (formatting, class names)
- [x] Environment variables template created
- [x] shadcn/ui component library installed and configured
- [x] Basic layout components (Header, Footer) created
- [x] Homepage with hero, features, and pricing sections
- [x] Development server running and tested
- [x] Clerk authentication system integrated
- [x] Dashboard page for authenticated users
- [x] Middleware for protected routes configured
- [ ] Clerk project created and configured
- [ ] Supabase project created and configured
- [ ] Database schema deployed to Supabase

## Core Portfolio Features
- [ ] User registration and profile creation implemented
- [ ] Project creation form with multi-slide upload
- [ ] Image processing pipeline (resize, WebP conversion)
- [ ] Cover image selection UI component
- [ ] Tag system with default tags and custom input
- [ ] Project display pages with image gallery
- [ ] User profile pages with project grid
- [ ] Responsive design for mobile and desktop

## Social Features
- [ ] Like system database schema and API routes
- [ ] Save/bookmark functionality implemented
- [ ] Follow system with proper database relationships
- [ ] Activity feed algorithm and rendering
- [ ] Search functionality with full-text search
- [ ] Discovery feed with trending/popular content
- [ ] Notification system for likes, follows, comments

## Subscription System
- [ ] Stripe integration and webhook handling
- [ ] Subscription tier enforcement in upload limits
- [ ] Payment flow and subscription management UI
- [ ] Usage tracking and analytics for subscribers
- [ ] Premium feature gating and access control

## Web3 Features
- [ ] RainbowKit wallet connection integration
- [ ] IPFS pinning service setup with Pinata
- [ ] Smart contracts deployed to Base testnet
- [ ] Smart contracts audited and deployed to Base mainnet
- [ ] NFT minting interface and transaction handling
- [ ] Marketplace functionality for trading projects
- [ ] Web3 profile ownership and verification

## Performance & Monitoring
- [ ] CDN configured for global image delivery
- [ ] Database indexes optimized for query performance
- [ ] Redis caching implemented for expensive operations
- [ ] Error monitoring with Sentry
- [ ] Analytics dashboard for user insights
- [ ] Performance benchmarks established

# Technical Decisions Log

## Database Schema Decisions
- **Decision**: Use Supabase (PostgreSQL) with UUID primary keys
- **Rationale**: Free tier available, built-in auth, real-time features, easier solo development
- **Impact**: Faster development, lower initial costs, built-in features reduce complexity

## Storage Strategy
- **Decision**: Supabase Storage (free tier) + optional web3.storage for Web3
- **Rationale**: Free tier covers MVP needs, web3.storage has generous free allowance
- **Impact**: Near-zero storage costs for MVP, gradual cost scaling with usage

## Subscription Tiers
- **Decision**: 2-tier system (Free: 3 slides, Pro: 10 slides)
- **Rationale**: Simpler to implement, lower barrier to entry, easier to validate
- **Impact**: Faster MVP development, can expand tiers based on user feedback

## Web3 Integration Approach
- **Decision**: Minimal Web3 integration for MVP (basic NFT minting only)
- **Rationale**: Reduces complexity, focuses on core value proposition first
- **Impact**: Faster time to market, lower development risk, can expand based on user demand

# Cost Optimization Strategy

## Free Tier Services (MVP)
- **Database**: Supabase (50MB, 2 projects, 50,000 monthly active users)
- **Storage**: Supabase Storage (1GB free)
- **Hosting**: Vercel (100GB bandwidth, 100 serverless function executions)
- **Web3 Storage**: web3.storage (5GB free)
- **Authentication**: Supabase Auth (free with database)
- **CDN**: Vercel Edge Network (included with hosting)

## Paid Services (Only When Needed)
- **Stripe**: Only when users upgrade to Pro ($0.30 + 2.9% per transaction)
- **Supabase Pro**: $25/month (when free tier limits exceeded)
- **Vercel Pro**: $20/month (when free tier limits exceeded)

## Cost Monitoring
- Set up alerts for when approaching free tier limits
- Monitor storage usage monthly
- Track bandwidth consumption
- Plan upgrade triggers based on user growth

# Environment Variables Needed

```bash
# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
DATABASE_URL=

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# File Storage (Supabase Storage)
# Uses same Supabase keys above

# Web3 (Optional - Phase 4)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
WEB3_STORAGE_TOKEN=
NEXT_PUBLIC_BASE_RPC_URL=

# Payments (Phase 3)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Deployment
NEXT_PUBLIC_APP_URL=
```

# Revised MVP Approach

## Core MVP Features (Phases 1-3)
1. **User Authentication & Profiles** - Supabase Auth with Google login
2. **Project Upload & Display** - 1-10 images per project, basic metadata
3. **Social Features** - Likes, saves, follows, basic feeds
4. **Simple Monetization** - Free (3 slides) vs Pro (10 slides) tiers
5. **Basic Web3** - Optional NFT minting for Pro users only

## Deferred Features (Post-MVP)
- Comments system
- Advanced search and filtering
- Custom tags
- Analytics dashboard
- Team/agency features
- Marketplace functionality
- Advanced Web3 features

## Success Metrics for MVP
- 100 registered users
- 50+ projects uploaded
- 10% conversion to Pro tier
- 5+ Web3 integrations completed

## Development Timeline (Revised)
- **Phase 1**: Foundation & Core Features (3-4 weeks)
- **Phase 2**: Social Features (2-3 weeks)
- **Phase 3**: Monetization (2-3 weeks)
- **Phase 4**: Basic Web3 (2-3 weeks)
- **Phase 5**: Performance & SEO (1-2 weeks)
- **Phase 6**: Deployment (1 week)

**Total MVP Timeline**: 11-16 weeks (3-4 months)
**Estimated Cost**: $0-50/month during development and initial launch

# Executor's Feedback or Assistance Requests

## Progress Update - Clerk Authentication Integration Complete ✅
- **Completed**: Next.js 14 project initialization with TypeScript and Tailwind
- **Completed**: Organized project structure with proper directory layout
- **Completed**: Prisma schema with all database models defined
- **Completed**: Supabase client configuration for both client and server-side usage
- **Completed**: TypeScript types for all application data structures
- **Completed**: Utility functions for formatting and class name management
- **Completed**: Environment variables template and documentation
- **Completed**: shadcn/ui component library installed and configured
- **Completed**: Basic layout components (Header, Footer) created
- **Completed**: Homepage with hero, features, and pricing sections
- **Completed**: Development server running and tested
- **Completed**: Clerk authentication system integrated with Web3 capabilities
- **Completed**: Dashboard page for authenticated users with stats and actions
- **Completed**: Header integration with Clerk UserButton and SignInButton
- **Completed**: Middleware configured for protected routes

## Next Steps Required
1. ✅ **Clerk Project Setup**: Completed - credentials added to .env.local
2. ✅ **Supabase Project Setup**: Completed - credentials added to .env.local
3. **Database Deployment**: Deploy Prisma schema to Supabase
4. **User Profile Creation**: Create user profiles in database after Clerk signup
5. **Test Authentication Flow**: Verify signup, login, and dashboard access

## Issues Found & Fixed ✅
- [x] **File Extension Issue**: Fixed `use-auth.ts` → `use-auth.tsx` (JSX requires .tsx extension)
- [x] **Header Component**: Fixed user property access to use Supabase User metadata structure
- [x] **Supabase Client**: Fixed async cookie handling for Next.js 15 compatibility
- [x] **TypeScript Errors**: All compilation errors resolved
- [x] **Clerk Integration**: Successfully migrated from Supabase Auth to Clerk with Web3 capabilities
- [x] **Clerk Middleware**: Fixed middleware import issues by using Protect component instead

## Current Blockers
- [ ] Need to finalize the exact subscription pricing model
- [ ] Require smart contract audit before mainnet deployment
- [ ] Need to determine IPFS pinning redundancy strategy
- [ ] Clarify marketplace royalty structure for creators

## Next Steps Priority
1. **Immediate**: Complete Phase 1 foundation and core portfolio features
2. **Short-term**: Implement social features and basic monetization
3. **Medium-term**: Add Web3 features for differentiation
4. **Long-term**: Scale and optimize for growth

## Technical Risks
- **IPFS Costs**: Could spiral if pinning strategy isn't carefully managed
- **Gas Fees**: Base fees could increase, affecting user adoption
- **Storage Scaling**: S3 costs will grow linearly with user uploads
- **Performance**: Image-heavy feeds may impact load times

## Business Risks
- **Market Timing**: Portfolio platforms are competitive space
- **User Education**: Web3 features may confuse traditional designers
- **Retention**: Social features must drive engagement beyond initial upload

# Lessons Learned (To be updated as development progresses)

## Architecture Lessons
- Hybrid Web2/Web3 approach provides best of both worlds
- Progressive enhancement allows gradual feature adoption
- Separation of concerns between core platform and blockchain features

## Development Lessons
- Start with solid Web2 foundation before adding Web3 complexity
- User experience should never be compromised for technical features
- Cost modeling is critical for sustainable Web3 integrations

## Business Lessons
- Freemium model works well for creative platforms
- Storage costs must be carefully managed and passed to users appropriately
- Multiple revenue streams provide more stability than single subscription model

# Testing Strategy

## Unit Tests
- [ ] Database models and relationships
- [ ] API route handlers
- [ ] Authentication and authorization logic
- [ ] File upload and processing functions
- [ ] Smart contract functions

## Integration Tests
- [ ] End-to-end user registration and project creation
- [ ] Payment flow and subscription management
- [ ] Web3 wallet connection and IPFS upload
- [ ] Social features (like, follow, save)
- [ ] Search and discovery functionality

## Performance Tests
- [ ] Image upload and processing under load
- [ ] Feed rendering with large datasets
- [ ] Database query performance with realistic data volumes
- [ ] CDN cache hit rates and image delivery speed

## Security Tests
- [ ] Authentication bypass attempts
- [ ] File upload security (malicious files, size limits)
- [ ] Smart contract security audit
- [ ] API rate limiting and abuse prevention

# Launch Checklist

## Pre-Launch (MVP Ready)
- [ ] Core features tested and stable
- [ ] Basic subscription system functional
- [ ] Essential Web3 features working on testnet
- [ ] Performance optimized for expected initial load
- [ ] Security vulnerabilities addressed
- [ ] Legal terms and privacy policy in place

## Launch Day
- [ ] Production deployment verified
- [ ] Monitoring and alerting active
- [ ] Customer support channels ready
- [ ] Marketing materials and landing pages live
- [ ] Community spaces (Discord, Twitter) prepared
- [ ] Backup and rollback procedures tested

## Post-Launch (First 30 days)
- [ ] User feedback collection and analysis
- [ ] Performance monitoring and optimization
- [ ] Bug fixes and minor feature improvements
- [ ] Community engagement and support
- [ ] Growth metrics tracking and analysis
- [ ] Iteration planning based on user behavior