import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DiscoverFeed } from '@/components/discover/discover-feed'
import { DiscoverFeedSkeleton } from '@/components/discover/discover-feed-skeleton'
import { ArrowRight, Sparkles, TrendingUp, Users, Award } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background-secondary via-background-primary to-background-tertiary">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        <div className="relative px-8 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            {/* Badge */}
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
                <Sparkles className="w-4 h-4 mr-2" />
                Join thousands of creators
              </Badge>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-text-primary leading-tight">
                Showcase Your
                <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent"> Creative Vision</span>
              </h1>
              <p className="text-xl lg:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
                The ultimate platform for designers and creators to share their work, 
                connect with the community, and discover amazing projects.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-primary text-lg px-8 py-6">
                <Link href="/discover">
                  Explore Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
                <Link href="/create">
                  Start Creating
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border-primary">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-accent-primary mr-2" />
                  <span className="text-3xl font-bold text-text-primary">10K+</span>
                </div>
                <p className="text-text-secondary">Projects Shared</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-accent-secondary mr-2" />
                  <span className="text-3xl font-bold text-text-primary">5K+</span>
                </div>
                <p className="text-text-secondary">Active Creators</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-accent-primary mr-2" />
                  <span className="text-3xl font-bold text-text-primary">50K+</span>
                </div>
                <p className="text-text-secondary">Likes Given</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="px-8 py-16 bg-background-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-text-primary">Featured Projects</h2>
            <p className="text-text-secondary text-lg">
              Discover the latest and greatest work from our community
            </p>
          </div>
          
          <Suspense fallback={<DiscoverFeedSkeleton />}>
            <DiscoverFeed />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
