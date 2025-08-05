# Design Portfolio Platform

A Web2-first design portfolio platform with optional Web3 features, allowing designers to showcase their work with social media-like feeds, profiles, and interactions.

**Latest Update**: Advanced search & discovery features implemented with comprehensive filtering! 🔍

## Features

### Core Features (MVP)
- User authentication with Clerk
- Project upload and management (1-10 images per project)
- Social features (likes, saves, follows, comments)
- User profiles and project galleries
- Advanced search and discovery with filtering
- Comment system with threading support
- Toast notifications and error handling

### Web3 Features (Phase 4)
- Optional NFT minting for projects
- IPFS storage integration
- Wallet connection support

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase (PostgreSQL)
- **Authentication**: Clerk (with Web3 support)
- **Storage**: Supabase Storage
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel → https://hifi.design

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for database)
- Clerk account (for authentication)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Portfolio-Website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Configure your environment variables in `.env.local`:
   - Set up a Supabase project and add your credentials
   - Set up a Clerk application and add your keys
   - Configure Clerk webhooks for user management

5. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # User dashboard pages
│   ├── (public)/          # Public pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Library configurations
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## Development Phases

1. **Phase 1**: Foundation & Core Features (3-4 weeks)
2. **Phase 2**: Social Features (2-3 weeks)
3. **Phase 3**: Monetization (2-3 weeks)
4. **Phase 4**: Basic Web3 (2-3 weeks)
5. **Phase 5**: Performance & SEO (1-2 weeks)
6. **Phase 6**: Deployment (1 week)

## Production Deployment

The site is deployed at **https://hifi.design**

### Deployment Steps

1. **Set up Vercel Project**:
   - Connect your GitHub repository to Vercel
   - Configure custom domain: `hifi.design`

2. **Environment Variables**:
   - Copy from `.env.production.example`
   - Update all keys with production values
   - Ensure `NEXT_PUBLIC_APP_URL=https://hifi.design`

3. **Database Setup**:
   - Use Supabase production database
   - Run migrations: `npx prisma db push`
   - Seed production data if needed

4. **Authentication**:
   - Update Clerk with production domain
   - Configure webhooks: `https://hifi.design/api/webhooks/clerk`
   - Update redirect URLs to use `hifi.design`

### Health Monitoring

- Health check: https://hifi.design/api/health
- Database status and performance metrics included

## Contributing

This is a solo project, but feedback and suggestions are welcome!

## License

MIT License
