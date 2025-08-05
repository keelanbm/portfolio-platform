import { Suspense } from 'react'
import { DiscoverFeed } from '@/components/discover/discover-feed'
import { DiscoverFeedSkeleton } from '@/components/discover/discover-feed-skeleton'
import { AsyncErrorBoundary } from '@/components/error-boundary'

export default function DiscoverPage() {
  return (
    <div className="w-full px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover</h1>
        <p className="text-muted-foreground">
          Explore amazing projects from talented creators
        </p>
      </div>

      <Suspense fallback={<DiscoverFeedSkeleton />}>
        <AsyncErrorBoundary>
          <DiscoverFeed />
        </AsyncErrorBoundary>
      </Suspense>
    </div>
  )
} 