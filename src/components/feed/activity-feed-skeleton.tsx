import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ActivityFeedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="overflow-hidden bg-white border-gray-200">
          <CardContent className="p-0">
            {/* Image Skeleton */}
            <div className="relative aspect-[4/3] bg-gray-100">
              <Skeleton className="w-full h-full" />
              <div className="absolute top-3 right-3">
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </div>
            
            {/* Content Skeleton */}
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center space-x-2 mb-3">
                <Skeleton className="h-6 w-6 rounded-full ring-2 ring-white" />
                <Skeleton className="h-4 w-24" />
              </div>
              
              {/* Title */}
              <Skeleton className="h-5 w-3/4 mb-2" />
              
              {/* Tags */}
              <div className="flex gap-1 mb-3">
                <Skeleton className="h-5 w-12 rounded-full" />
                <Skeleton className="h-5 w-10 rounded-full" />
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
} 