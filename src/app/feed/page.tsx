import { Suspense } from 'react'
import { ActivityFeed } from '@/components/feed/activity-feed'
import { ActivityFeedSkeleton } from '@/components/feed/activity-feed-skeleton'

export default function FeedPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Activity Feed</h1>
        <p className="text-gray-600">
          Latest projects from creators you follow
        </p>
      </div>

      <Suspense fallback={<ActivityFeedSkeleton />}>
        <ActivityFeed />
      </Suspense>
    </div>
  )
} 