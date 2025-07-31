'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react'
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
  const [hasMore, setHasMore] = useState(true)

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

  if (loading) {
    return <ActivityFeedSkeleton />
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Your feed is empty</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Follow some creators to see their latest projects here
          </p>
          <Button asChild size="lg">
            <Link href="/discover">Discover Creators</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      
      {hasMore && (
        <div className="text-center py-8">
          <Button variant="outline" onClick={() => {/* TODO: Load more */}}>
            Load More
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
    
    setIsLiking(true)
    try {
      const response = await fetch(`/api/projects/${project.id}/like`, {
        method: liked ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        setLiked(!liked)
        setLikeCount(liked ? likeCount - 1 : likeCount + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card 
      className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out group cursor-pointer bg-white border-gray-200 hover:border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      tabIndex={0}
      role="article"
      aria-label={`Project: ${project.title} by ${project.user.name}`}
    >
      <CardContent className="p-0">
        {/* Project Image */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
          />
          
          {/* Image Overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Image Count Badge */}
          {project.images.length > 1 && (
            <Badge className="absolute top-3 right-3 text-xs bg-white/90 backdrop-blur-sm border-0 shadow-sm">
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
                className={`h-9 w-9 p-0 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white transition-all duration-200 ${
                  liked ? 'text-red-500 scale-110' : 'text-gray-600'
                } ${isLiking ? 'animate-pulse' : ''}`}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''} ${isLiking ? 'animate-bounce' : ''}`} />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                aria-label="Share project"
                className="h-9 w-9 p-0 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white text-gray-600 transition-all duration-200"
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
            <Avatar className="h-6 w-6 ring-2 ring-white shadow-sm">
              <AvatarImage src={project.user.avatar} />
              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {project.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link 
                href={`/profile/${project.user.username}`}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:underline truncate block transition-colors duration-200"
              >
                {project.user.name}
              </Link>
            </div>
          </div>

          {/* Project Title */}
          <Link 
            href={`/project/${project.id}`}
            className="text-base font-semibold text-gray-900 hover:text-blue-600 mb-2 block line-clamp-1 transition-colors duration-200"
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
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 2 && (
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
                >
                  +{project.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                aria-label={liked ? 'Unlike project' : 'Like project'}
                className={`h-8 px-2 rounded-md transition-all duration-200 ${
                  liked 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                } ${isLiking ? 'animate-pulse' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-1 transition-all duration-200 ${liked ? 'fill-current scale-110' : ''} ${isLiking ? 'animate-bounce' : ''}`} />
                <span className="text-sm font-medium">{likeCount}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                aria-label={`${project.comments} comments`}
                className="h-8 px-2 rounded-md text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{project.comments}</span>
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              aria-label="Share project"
              className="h-8 w-8 p-0 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 