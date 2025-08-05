'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Eye, MoreHorizontal, FolderPlus } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AddToCollectionDialog } from '@/components/collections/add-to-collection-dialog'

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description?: string
    coverImage: string
    images: string[]
    tags: string[]
    likes: number
    comments: number
    views?: number
    createdAt: string
    isLiked?: boolean
    user: {
      id: string
      username: string
      name: string
      avatar: string
      isFollowing?: boolean
    }
  }
  onLike?: (projectId: string) => Promise<void>
  onOpenModal?: (projectId: string) => void
  aspectRatio?: number
  showCollectionActions?: boolean // Only show for user's own projects
}

export function ProjectCard({ 
  project, 
  onLike, 
  onOpenModal,
  aspectRatio,
  showCollectionActions = false
}: ProjectCardProps) {
  const [liked, setLiked] = useState(project.isLiked || false)
  const [likeCount, setLikeCount] = useState(project.likes)
  const [imageError, setImageError] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [showAddToCollection, setShowAddToCollection] = useState(false)

  // Calculate image height based on aspect ratio or use natural aspect ratio
  const imageHeight = aspectRatio ? `${300 / aspectRatio}px` : 'auto'
  const minHeight = '200px'
  const maxHeight = '500px'

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLiking || !onLike) return

    // Optimistic update
    const wasLiked = liked
    const originalCount = likeCount
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    
    setIsLiking(true)
    try {
      await onLike(project.id)
    } catch (error) {
      // Revert on error
      setLiked(wasLiked)
      setLikeCount(originalCount)
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleCardClick = () => {
    if (onOpenModal) {
      onOpenModal(project.id)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <>
      <div 
        className="group cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
      aria-label={`View project: ${project.title} by ${project.user.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* Project Image - Main Focus */}
      <div className="relative overflow-hidden rounded-lg bg-background-secondary mb-3">
        {imageError ? (
          <div 
            className="w-full flex items-center justify-center bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10"
            style={{ 
              height: imageHeight,
              minHeight,
              maxHeight 
            }}
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-accent-primary/20 flex items-center justify-center">
                <span className="text-xl">🎨</span>
              </div>
              <p className="text-sm text-text-muted">Image unavailable</p>
            </div>
          </div>
        ) : (
          <div 
            className="relative w-full overflow-hidden"
            style={{ 
              height: imageHeight,
              minHeight,
              maxHeight 
            }}
          >
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Hover Overlay with Stats */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center space-x-6 text-white">
                  <div className="flex items-center space-x-2">
                    <Heart className={`h-5 w-5 ${liked ? 'fill-current text-accent-pink' : ''}`} />
                    <span className="font-medium">{likeCount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">{project.comments}</span>
                  </div>
                  {project.views && (
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span className="font-medium">{project.views}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2">
                  {/* Collection Actions - Only for user's own projects */}
                  {showCollectionActions && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-10 w-10 p-0 rounded-full bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setShowAddToCollection(true)}>
                          <FolderPlus className="h-4 w-4 mr-2" />
                          Add to Collection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  
                  {/* Like Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleLike}
                    disabled={isLiking}
                    className="h-10 w-10 p-0 rounded-full bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
                  >
                    <Heart className={`h-4 w-4 ${liked ? 'fill-current text-accent-pink' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Image count badge */}
            {project.images.length > 1 && (
              <Badge className="absolute top-3 left-3 text-xs bg-black/60 text-white border-0 backdrop-blur-sm">
                {project.images.length} images
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Minimal Content Below - Just Title and Author */}
      <div className="space-y-2">
        {/* Project Title */}
        <h3 className="text-sm font-medium text-text-primary line-clamp-2 leading-tight group-hover:text-accent-primary transition-colors">
          {project.title}
        </h3>

        {/* Author Info - Minimal */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={project.user.avatar} />
            <AvatarFallback className="text-xs bg-accent-primary/10 text-accent-primary">
              {project.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link 
            href={`/profile/${project.user.username}`}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {project.user.name}
          </Link>
        </div>
      </div>
      </div>
      
      {/* Add to Collection Dialog */}
    <AddToCollectionDialog
      projectId={project.id}
      projectTitle={project.title}
      open={showAddToCollection}
      onOpenChange={setShowAddToCollection}
      onSuccess={() => {
        // Could update UI or show success feedback here
      }}
    />
    </>
  )
}