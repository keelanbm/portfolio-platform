import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function CreateProjectSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Form Skeleton */}
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>

        {/* Image Upload Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full rounded-lg border-2 border-dashed" />
          </CardContent>
        </Card>

        {/* Project Details Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>

        {/* Tags Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-20 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-6 w-16" />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button Skeleton */}
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Right Column - Preview Skeleton */}
      <div className="lg:sticky lg:top-8 lg:h-fit">
        <div className="mb-4">
          <Skeleton className="h-5 w-20 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <Skeleton className="w-16 h-16 mx-auto rounded-lg mb-4" />
            <Skeleton className="h-5 w-32 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 