import { Suspense } from 'react'
import { ActivityFeed } from '@/components/feed/activity-feed'
import { ActivityFeedSkeleton } from '@/components/feed/activity-feed-skeleton'

export default function FeedPage() {
  return (
    <div className="w-full px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-text-primary">Activity Feed</h1>
        <p className="text-text-secondary">
          Latest projects from creators you follow
        </p>
      </div>

      <Suspense fallback={<ActivityFeedSkeleton />}>
        <ActivityFeed />
      </Suspense>
    </div>
  )
} 