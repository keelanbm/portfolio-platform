import { Suspense } from 'react'
import { DiscoverFeed } from '@/components/discover/discover-feed'
import { DiscoverFeedSkeleton } from '@/components/discover/discover-feed-skeleton'

export default function HomePage() {
  return (
    <div className="w-full px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-text-primary">Discover Amazing Work</h1>
        <p className="text-text-secondary">
          Explore projects from talented designers and creators
        </p>
      </div>

      <Suspense fallback={<DiscoverFeedSkeleton />}>
        <DiscoverFeed />
      </Suspense>
    </div>
  )
}
