'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share } from 'lucide-react'
import Link from 'next/link'
import { ActivityFeedSkeleton } from './activity-feed-skeleton'

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
  user: {
    id: string
    username: string
    name: string
    avatar: string
  }
  isLiked?: boolean
}

export function ActivityFeed() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/feed?page=1&limit=12')
        if (!response.ok) {
          throw new Error('Failed to fetch feed')
        }
        const data = await response.json()
        
        setProjects(data.projects)
        setHasMore(data.hasMore)
      } catch (error) {
        console.error('Feed error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const loadMore = async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      const response = await fetch(`/api/feed?page=${nextPage}&limit=12`)
      if (!response.ok) {
        throw new Error('Failed to load more projects')
      }
      const data = await response.json()
      
      setProjects(prev => [...prev, ...data.projects])
      setHasMore(data.hasMore)
      setCurrentPage(nextPage)
    } catch (error) {
      console.error('Error loading more projects:', error)
    } finally {
      setLoadingMore(false)
    }
  }

  if (loading) {
    return <ActivityFeedSkeleton />
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h3 className="text-portfolio-title">Your feed is empty</h3>
          <p className="text-portfolio-description">
            Follow some creators to see their latest projects here
          </p>
          <Button asChild size="lg" className="btn-primary">
            <Link href="/discover">Discover Creators</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Projects Grid */}
      <div className="portfolio-grid">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center py-8">
          <Button 
            variant="outline" 
            className="btn-secondary" 
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [liked, setLiked] = useState(project.isLiked || false)
  const [likeCount, setLikeCount] = useState(project.likes)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isLiking) return

    // Optimistic update
    const wasLiked = liked
    const originalCount = likeCount
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    
    setIsLiking(true)
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
    } catch (error) {
      // Revert optimistic update on error
      setLiked(wasLiked)
      setLikeCount(originalCount)
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card 
      className="portfolio-card group"
      tabIndex={0}
      role="article"
      aria-label={`Project: ${project.title} by ${project.user.name}`}
    >
      <CardContent className="p-0">
        {/* Project Image */}
        <div className="image-container">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Image Count Badge */}
          {project.images.length > 1 && (
            <Badge className="absolute top-3 right-3 text-xs bg-background-overlay/90 backdrop-blur-sm border-0 shadow-sm text-text-primary">
              {project.images.length} images
            </Badge>
          )}
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                aria-label={liked ? 'Unlike project' : 'Like project'}
                className={`h-9 w-9 p-0 rounded-full shadow-lg backdrop-blur-sm bg-background-overlay/90 hover:bg-background-overlay transition-all duration-200 ${
                  liked ? 'text-accent-pink scale-110' : 'text-text-muted'
                } ${isLiking ? 'animate-pulse' : ''}`}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''} ${isLiking ? 'animate-bounce' : ''}`} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Share project"
                className="h-9 w-9 p-0 rounded-full shadow-lg backdrop-blur-sm bg-background-overlay/90 hover:bg-background-overlay text-text-muted transition-all duration-200"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Project Content */}
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center space-x-2 mb-3">
            <Avatar className="h-6 w-6 ring-2 ring-background-primary shadow-sm">
              <AvatarImage src={project.user.avatar} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-accent-primary to-accent-secondary text-white">
                {project.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link 
                href={`/profile/${project.user.username}`}
                className="text-sm font-medium text-text-secondary hover:text-text-primary hover:underline truncate block transition-colors duration-200"
              >
                {project.user.name}
              </Link>
            </div>
          </div>

          {/* Project Title */}
          <Link 
            href={`/project/${project.id}`}
            className="text-base font-semibold text-text-primary hover:text-accent-primary mb-2 block line-clamp-1 transition-colors duration-200"
          >
            {project.title}
          </Link>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="text-xs bg-background-tertiary text-text-secondary hover:bg-background-overlay transition-colors duration-200"
                >
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 2 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-background-tertiary text-text-secondary hover:bg-background-overlay transition-colors duration-200"
                >
                  +{project.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-border-primary">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                aria-label={liked ? 'Unlike project' : 'Like project'}
                className={`h-8 px-2 rounded-md transition-all duration-200 ${
                  liked 
                    ? 'text-accent-pink bg-accent-pink/10 hover:bg-accent-pink/20' 
                    : 'text-text-muted hover:text-accent-pink hover:bg-accent-pink/10'
                } ${isLiking ? 'animate-pulse' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-1 transition-all duration-200 ${liked ? 'fill-current scale-110' : ''} ${isLiking ? 'animate-bounce' : ''}`} />
                <span className="text-sm font-medium">{likeCount}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                aria-label={`${project.comments} comments`}
                className="h-8 px-2 rounded-md text-text-muted hover:text-accent-primary hover:bg-accent-primary/10 transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{project.comments}</span>
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              aria-label="Share project"
              className="h-8 w-8 p-0 rounded-md text-text-muted hover:text-text-secondary hover:bg-background-tertiary transition-all duration-200"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 