'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, MessageCircle, Eye, MoreHorizontal, FolderPlus, Bookmark } from 'lucide-react'
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
    isSaved?: boolean
    backgroundColor?: string
    gradientColors?: string[]
    backgroundStyle?: 'AUTO' | 'SOLID' | 'GRADIENT'
    user: {
      id: string
      username: string
      name: string
      avatar: string
      isFollowing?: boolean
    }
  }
  onLike?: (projectId: string) => Promise<void>
  onSave?: (projectId: string) => Promise<void>
  onOpenModal?: (projectId: string) => void
  aspectRatio?: number
  showCollectionActions?: boolean // Only show for user's own projects
  priority?: boolean // For image loading priority
}

export function ProjectCard({ 
  project, 
  onLike, 
  onSave,
  onOpenModal,
  aspectRatio,
  showCollectionActions = false,
  priority = false
}: ProjectCardProps) {
  const [liked, setLiked] = useState(project.isLiked || false)
  const [likeCount, setLikeCount] = useState(project.likes)
  const [saved, setSaved] = useState(project.isSaved || false)
  
  // Generate background style based on project settings
  const getBackgroundStyle = () => {
    const { backgroundStyle, backgroundColor, gradientColors } = project
    
    if (backgroundStyle === 'SOLID' && backgroundColor) {
      return { backgroundColor }
    } else if (backgroundStyle === 'GRADIENT' && gradientColors && gradientColors.length >= 2) {
      return {
        background: `linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%)`,
      }
    }
    // AUTO or fallback - use default background
    return {}
  }
  const [imageError, setImageError] = useState(false)
  const [isLiking, setIsLiking] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showAddToCollection, setShowAddToCollection] = useState(false)

  // Calculate image height for 4:3 aspect ratio (optimized for homepage showcase)
  const imageHeight = aspectRatio ? `${300 / aspectRatio}px` : '225px' // 300px width * 0.75 = 225px for 4:3
  const minHeight = '200px'
  const maxHeight = '400px' // Reduced max height for better grid consistency

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

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isSaving || !onSave) return

    // Optimistic update
    const wasSaved = saved
    setSaved(!saved)
    
    setIsSaving(true)
    try {
      await onSave(project.id)
    } catch (error) {
      // Revert on error
      setSaved(wasSaved)
      console.error('Error toggling save:', error)
    } finally {
      setIsSaving(false)
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
      <div 
        className="relative overflow-hidden rounded-lg bg-background-secondary mb-3"
        style={getBackgroundStyle()}
      >
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
              priority={priority}
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={handleImageError}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
            />
            
            {/* Enhanced Hover Overlay with Stats and Comment Preview */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300">
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
                {/* Main Stats */}
                <div className="flex items-center space-x-8 text-white mb-4">
                  <div className="flex items-center space-x-2">
                    <Heart className={`h-6 w-6 ${liked ? 'fill-current text-accent-pink' : ''}`} />
                    <span className="font-semibold text-lg">{likeCount}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-6 w-6" />
                    <span className="font-semibold text-lg">{project.comments}</span>
                  </div>
                  {project.views && (
                    <div className="flex items-center space-x-2">
                      <Eye className="h-6 w-6" />
                      <span className="font-semibold text-lg">{project.views}</span>
                    </div>
                  )}
                </div>
                
                {/* Comment Preview */}
                {project.comments > 0 && (
                  <div className="bg-black/70 rounded-lg p-3 max-w-xs text-white text-center backdrop-blur-sm">
                    <p className="text-xs font-medium mb-1">Recent Comment</p>
                    <p className="text-xs text-gray-200 line-clamp-2">
                      &ldquo;Love the color palette! The gradient transitions are so smooth.&rdquo;
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Click to view all {project.comments} comments</p>
                  </div>
                )}
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
                  
                  {/* Save Button */}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-10 w-10 p-0 rounded-full bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm"
                  >
                    <Bookmark className={`h-4 w-4 ${saved ? 'fill-current text-accent-primary' : ''}`} />
                  </Button>

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
            
            {/* Comment Activity Indicator */}
            {project.comments > 0 && (
              <div className="absolute top-3 right-3 bg-accent-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium animate-pulse">
                {project.comments > 9 ? '9+' : project.comments}
              </div>
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