# Design Portfolio Platform

A Web2-first design portfolio platform with optional Web3 features, allowing designers to showcase their work with social media-like feeds, profiles, and interactions.

**Latest Update**: Build errors fixed and ready for deployment! 🚀

## Features

### Core Features (MVP)
- User authentication with Supabase Auth
- Project upload and management (1-10 images per project)
- Social features (likes, saves, follows)
- User profiles and project galleries
- Basic search and discovery
- Subscription tiers (Free: 3 slides, Pro: 10 slides)

### Web3 Features (Phase 4)
- Optional NFT minting for projects
- IPFS storage integration
- Wallet connection support

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Google OAuth credentials (for social login)

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
   - Add Google OAuth credentials
   - Configure other services as needed

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

## Contributing

This is a solo project, but feedback and suggestions are welcome!

## License

MIT License
