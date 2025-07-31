'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle } from 'lucide-react'

interface ProjectPreviewProps {
  projectData: {
    title: string
    description: string
    tags: string[]
    images: File[]
    coverImageIndex: number
  }
  user: any
}

export function ProjectPreview({ projectData, user }: ProjectPreviewProps) {
  const hasData = projectData.images.length > 0 || projectData.title || projectData.description || projectData.tags.length > 0

  if (!hasData) {
    return (
      <Card className="border-dashed border-2 border-gray-200">
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Project Preview</h4>
          <p className="text-sm text-gray-600">
            Start adding content to see how your project will appear
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Feed Preview */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Feed Preview</h4>
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
          <CardContent className="p-0">
            {/* Project Image */}
            <div className="relative aspect-[4/3] bg-muted overflow-hidden">
              {projectData.images.length > 0 ? (
                <img
                  src={URL.createObjectURL(projectData.images[projectData.coverImageIndex])}
                  alt={projectData.title || 'Project preview'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No image uploaded</span>
                </div>
              )}
              {projectData.images.length > 1 && (
                <Badge className="absolute top-3 right-3 text-xs">
                  {projectData.images.length} images
                </Badge>
              )}
            </div>

            {/* Project Content */}
            <div className="p-4">
              {/* User Info */}
              <div className="flex items-center space-x-2 mb-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback className="text-xs">
                    {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium hover:underline truncate block">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.username || 'Your Name'
                    }
                  </span>
                </div>
              </div>

              {/* Project Title */}
              <div className="text-base font-semibold hover:underline mb-2 block line-clamp-1">
                {projectData.title || 'Project Title'}
              </div>

              {/* Tags */}
              {projectData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {projectData.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {projectData.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{projectData.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Heart className="w-4 h-4" />
                  0
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <MessageCircle className="w-4 h-4" />
                  0
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Page Preview */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Project Page Preview</h4>
        <Card>
          <CardContent className="p-4">
            {/* Project Header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {projectData.title || 'Project Title'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>
                      {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.username || 'Your Name'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Main Image */}
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 mb-4">
              {projectData.images.length > 0 ? (
                <img
                  src={URL.createObjectURL(projectData.images[projectData.coverImageIndex])}
                  alt={projectData.title || 'Project preview'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No image uploaded</span>
                </div>
              )}
            </div>

            {/* Description */}
            {projectData.description && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {projectData.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {projectData.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {projectData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 