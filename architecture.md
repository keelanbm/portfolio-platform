# Design Portfolio Platform Architecture

## Project Overview
A Web2-first design portfolio platform with optional Web3 features, allowing designers to showcase their work with social media-like feeds, profiles, and interactions. Optional blockchain integration for IPFS storage and NFT minting.

## Tech Stack (MVP - Cost Optimized)

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Web3 Integration**: wagmi + RainbowKit (Phase 4 only)
- **Image Handling**: next/image with Supabase loader
- **UI Components**: shadcn/ui

### Backend
- **API**: Next.js API routes
- **Database**: Supabase (PostgreSQL) with Prisma ORM
- **Authentication**: Supabase Auth (email/password + Google)
- **File Storage**: Supabase Storage
- **CDN**: Vercel Edge Network (included)
- **Search**: PostgreSQL full-text search (built-in)

### Web3 (Optional Features - Phase 4)
- **Blockchain**: Base (Ethereum L2)
- **Storage**: IPFS via web3.storage (free tier)
- **Smart Contracts**: Simple ProjectNFT contract only
- **RPC Provider**: Public RPC or Alchemy free tier

## Database Schema

### Core Tables

#### users
```sql
id: UUID (primary key)
email: String (unique)
username: String (unique)
display_name: String
bio: Text
avatar_url: String
website_url: String
location: String
wallet_address: String (nullable)
subscription_tier: Enum (free, pro, studio)
created_at: Timestamp
updated_at: Timestamp
```

#### projects
```sql
id: UUID (primary key)
user_id: UUID (foreign key)
title: String
description: Text
cover_image_url: String
slide_count: Integer
tags: String[] (array of tags)
view_count: Integer (default 0)
like_count: Integer (default 0)
is_public: Boolean (default true)
ipfs_hash: String (nullable)
contract_address: String (nullable)
token_id: String (nullable)
created_at: Timestamp
updated_at: Timestamp
```

#### project_slides
```sql
id: UUID (primary key)
project_id: UUID (foreign key)
image_url: String
slide_order: Integer
created_at: Timestamp
```

#### likes
```sql
id: UUID (primary key)
user_id: UUID (foreign key)
project_id: UUID (foreign key)
created_at: Timestamp
UNIQUE(user_id, project_id)
```

#### saves
```sql
id: UUID (primary key)
user_id: UUID (foreign key)
project_id: UUID (foreign key)
created_at: Timestamp
UNIQUE(user_id, project_id)
```

#### follows
```sql
id: UUID (primary key)
follower_id: UUID (foreign key)
following_id: UUID (foreign key)
created_at: Timestamp
UNIQUE(follower_id, following_id)
```

#### tags
```sql
id: UUID (primary key)
name: String (unique)
usage_count: Integer (default 0)
is_featured: Boolean (default false)
created_at: Timestamp
```

#### nft_mints
```sql
id: UUID (primary key)
project_id: UUID (foreign key)
minter_wallet: String
transaction_hash: String
mint_price: Decimal (nullable)
created_at: Timestamp
```

## API Routes Structure

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Projects
- `GET /api/projects` (feed with pagination, filters)
- `POST /api/projects` (create new project)
- `GET /api/projects/[id]` (get single project)
- `PUT /api/projects/[id]` (update project)
- `DELETE /api/projects/[id]` (delete project)
- `POST /api/projects/[id]/like` (like/unlike)
- `POST /api/projects/[id]/save` (save/unsave)

### Users
- `GET /api/users/[username]` (public profile)
- `PUT /api/users/[username]` (update profile)
- `GET /api/users/[username]/projects` (user's projects)
- `GET /api/users/[username]/liked` (user's liked projects - private)
- `GET /api/users/[username]/saved` (user's saved projects - private)
- `POST /api/users/[username]/follow` (follow/unfollow)

### Search & Discovery
- `GET /api/search` (search projects by title, tags, description)
- `GET /api/tags` (get popular tags)
- `GET /api/feed` (personalized feed based on follows)
- `GET /api/discover` (trending/featured projects)

### File Upload
- `POST /api/upload/image` (upload single image to S3)
- `POST /api/upload/project-slides` (upload multiple slides)

### Web3 (Optional)
- `POST /api/web3/save-to-ipfs` (save project to IPFS)
- `POST /api/web3/mint-nft` (initiate NFT minting process)
- `GET /api/web3/mint-status/[id]` (check minting status)

## Frontend Pages Structure

### Public Pages
- `/` - Homepage with featured projects and discovery feed
- `/discover` - Browse all projects with filters
- `/search` - Search results page
- `/[username]` - User profile page
- `/[username]/[project-id]` - Individual project view
- `/tags/[tag]` - Projects filtered by tag

### Authenticated Pages
- `/dashboard` - User dashboard with their projects
- `/upload` - Create new project
- `/settings` - User settings and profile management
- `/liked` - User's liked projects (private)
- `/saved` - User's saved projects (private)
- `/following` - Feed from followed users

### Web3 Pages (Optional)
- `/wallet` - Web3 wallet connection and management
- `/nft/[project-id]` - NFT minting interface

## Feature Specifications

### Project Upload Flow
1. User uploads 1-20 images (3 max on free tier)
2. Select cover image from uploaded slides
3. Add title, description, and tags
4. **Optional**: Connect wallet to save to IPFS
5. Publish project

### Subscription Tiers
- **Free**: 3 slides per project, basic profile
- **Pro ($10/month)**: 20 slides per project, analytics, custom domain
- **Studio ($50/month)**: Team features, white-label options, API access

### Default Tags
```javascript
const DEFAULT_TAGS = [
  'Web Design', 'Mobile App', 'Logo Design', 'Branding', 
  'UI/UX', 'Illustration', 'Typography', 'Photography',
  'Print Design', 'Packaging', 'Landing Page', 'Dashboard',
  'E-commerce', 'SaaS', 'Fintech', 'Healthcare', 'Education'
];
```

### Feed Algorithm (MVP)
1. Recent projects from followed users (70%)
2. Popular projects from last 7 days (20%)
3. Trending tags user interacts with (10%)

## Web3 Integration Details

### Smart Contracts (Base)
- **ProfileNFT.sol**: Optional NFT representing user profile ownership
- **ProjectNFT.sol**: ERC-721 for individual project minting
- **Marketplace.sol**: Handle NFT sales and royalties

### IPFS Integration
- Store project metadata as JSON
- Include all slide URLs and project details
- Pin content using Pinata with redundancy

### Wallet Integration
- Optional wallet connection via RainbowKit
- Support Coinbase Wallet, MetaMask, WalletConnect
- Graceful fallback if wallet disconnected

## Performance Considerations

### Image Optimization
- Multiple sizes generated on upload (thumbnail, medium, large)
- WebP format with JPEG fallback
- Lazy loading with blur-up effect
- CDN caching with proper headers

### Database Optimization
- Indexes on frequently queried columns (user_id, created_at, tags)
- Pagination for feeds and search results
- Cached counts for likes, views, follows

### Caching Strategy
- Redis for session storage and API response caching
- CDN edge caching for images and static content
- Database query result caching for expensive operations

## Security & Privacy

### Data Protection
- Encrypted passwords with bcrypt
- Rate limiting on API endpoints
- CORS configuration for Web3 interactions
- Input validation and sanitization

### Web3 Security
- Smart contract audits before mainnet deployment
- Signature verification for wallet-based actions
- Proper gas estimation and slippage protection

## Deployment Architecture

### Staging Environment
- Vercel for frontend hosting
- Railway/Render for backend services
- Test database with sample data
- Base Sepolia testnet for Web3 features

### Production Environment
- Vercel Pro for frontend with analytics
- AWS/Railway for backend with auto-scaling
- Production PostgreSQL with backups
- Base mainnet for Web3 features
- Cloudflare for CDN and DDoS protection

## MVP Development Phases

### Phase 1: Core Platform (4-6 weeks)
- User authentication and profiles
- Project upload and display
- Basic feed and discovery
- Search functionality

### Phase 2: Social Features (2-3 weeks)
- Likes and saves
- Following system
- User dashboard improvements
- Basic analytics

### Phase 3: Web3 Integration (3-4 weeks)
- Wallet connection
- IPFS storage option
- NFT minting functionality
- Web3 profile features

### Phase 4: Monetization (2-3 weeks)
- Subscription tiers
- Payment processing
- Usage limits and upgrades
- Analytics dashboard

## Environment Variables

```bash
# Database
DATABASE_URL=
DIRECT_URL=

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# File Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REGION=

# Web3 (Optional)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=
ALCHEMY_API_KEY=
PINATA_API_KEY=
PINATA_SECRET_KEY=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# External Services
REDIS_URL=
ALGOLIA_APP_ID= (if using Algolia search)
ALGOLIA_API_KEY=
```

This architecture provides a solid foundation for building a scalable design portfolio platform with optional Web3 features while maintaining low operational costs and high performance.