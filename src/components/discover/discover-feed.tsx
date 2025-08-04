'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share2, UserPlus } from 'lucide-react'
import { DiscoverFeedSkeleton } from './discover-feed-skeleton'
import { DEFAULT_TAGS } from '@/lib/constants'

interface Project {
  id: string
  title: string
  description: string
  coverImage: string
  images: string[]
  tags: string[]
  likes: number
  comments: number
  createdAt: string
  isLiked?: boolean
  user: {
    id: string
    username: string
    name: string
    avatar: string
    isFollowing: boolean
  }
}

export function DiscoverFeed() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get all unique tags from projects for filtering (commented out as not currently used)
  // const allTags = Array.from(new Set(projects.flatMap(project => project.tags)))

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        // Build query parameters
        const params = new URLSearchParams()
        params.append('sort', sortBy)
        if (selectedTags.length > 0) {
          params.append('tags', selectedTags.join(','))
        }
        
        const response = await fetch(`/api/discover?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        
        const data = await response.json()
        setProjects(data.projects)
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Fallback to empty array on error
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [sortBy, selectedTags])

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearAllFilters = () => {
    setSelectedTags([])
    setSortBy('recent')
  }

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'comments', label: 'Most Commented' }
  ]

  if (loading) {
    return <DiscoverFeedSkeleton />
  }

  return (
    <div className="w-full space-y-8">
      {/* Enhanced Filters Section */}
      <div className="space-y-6">
        {/* Sort Options */}
        <div className="flex flex-wrap gap-3">
          <span className="text-sm font-medium text-text-secondary mr-2">Sort by:</span>
          {sortOptions.map((option) => (
            <Button
              key={option.value}
              variant={sortBy === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(option.value)}
              className="text-sm"
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Tag Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Filter by tags:</span>
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-sm text-text-muted hover:text-text-primary"
              >
                Clear all
              </Button>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {DEFAULT_TAGS.map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagToggle(tag)}
                className="text-sm"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2 pt-4 border-t border-border-primary">
            <span className="text-sm text-text-secondary">Active filters:</span>
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer hover:bg-background-tertiary"
                onClick={() => handleTagToggle(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold mb-3 text-text-primary">No projects found</h3>
          <p className="text-text-secondary">
            Try adjusting your filters or check back later for new projects.
          </p>
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [liked, setLiked] = useState(project.isLiked || false)
  const [likeCount, setLikeCount] = useState(project.likes)
  const [isFollowing, setIsFollowing] = useState(project.user.isFollowing)
  const [imageError, setImageError] = useState(false)

  const handleLike = async () => {
    // Optimistic update
    const wasLiked = liked
    const originalCount = likeCount
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    
    try {
      const response = await fetch(`/api/projects/${project.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to toggle like')
      }
      
      const result = await response.json()
      setLiked(result.liked)
      // The like count will be updated by the API, but we'll keep our optimistic update
    } catch (error) {
      // Revert optimistic update on error
      setLiked(wasLiked)
      setLikeCount(originalCount)
      console.error('Error toggling like:', error)
    }
  }

  const handleFollow = async () => {
    // Optimistic update
    const wasFollowing = isFollowing
    setIsFollowing(!isFollowing)
    
    try {
      if (isFollowing) {
        // Unfollow
        const response = await fetch(`/api/follows?followingId=${project.user.id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          throw new Error('Failed to unfollow')
        }
      } else {
        // Follow
        const response = await fetch('/api/follows', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            followingId: project.user.id,
          }),
        })
        
        if (!response.ok) {
          throw new Error('Failed to follow')
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsFollowing(wasFollowing)
      console.error('Error toggling follow:', error)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group bg-background-secondary border-border-primary">
      <CardContent className="p-0">
        {/* Project Image */}
        <div className="relative aspect-[4/3] bg-background-tertiary overflow-hidden">
          {imageError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-accent-primary/30 flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <p className="text-sm text-text-secondary">Image unavailable</p>
              </div>
            </div>
          ) : (
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={handleImageError}
              loading="lazy"
            />
          )}
          {project.images.length > 1 && (
            <Badge className="absolute top-3 right-3 text-xs bg-background-overlay/80 text-text-primary">
              {project.images.length} images
            </Badge>
          )}
        </div>

        {/* Project Content */}
        <div className="px-4 pb-3">
          {/* User Info with Follow Icon */}
          <div className="flex items-center space-x-2 mb-2 mt-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.user.avatar} />
              <AvatarFallback className="text-xs bg-accent-primary/20 text-accent-primary">
                {project.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 flex items-center space-x-1">
              <Link 
                href={`/profile/${project.user.username}`}
                className="text-sm font-medium hover:underline truncate block text-text-primary"
              >
                {project.user.name}
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFollow}
                className={`h-4 w-4 p-0 ${isFollowing ? 'text-accent-primary' : 'text-text-secondary'}`}
              >
                <UserPlus className={`h-3 w-3 ${isFollowing ? 'fill-current' : ''}`} />
              </Button>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`h-6 w-6 p-0 ${liked ? 'text-accent-pink' : 'text-text-secondary'}`}
              >
                <Heart className={`h-3 w-3 ${liked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-text-secondary">
                <MessageCircle className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-text-secondary">
                <Share2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Project Title */}
          <Link 
            href={`/project/${project.id}`}
            className="text-base font-semibold hover:underline block mb-1 line-clamp-1 text-text-primary"
          >
            {project.title}
          </Link>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs bg-background-tertiary text-text-secondary">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs bg-background-tertiary text-text-secondary">
                  +{project.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center space-x-3 text-xs text-text-secondary">
            <span>{likeCount} likes</span>
            <span>{project.comments} comments</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 