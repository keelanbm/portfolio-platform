'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Heart, MessageCircle, Share, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { DiscoverFeedSkeleton } from './discover-feed-skeleton'

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
    isFollowing: boolean
  }
}

export function DiscoverFeed() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('recent')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/discover?sort=${sortBy}&tag=${selectedTag}`)
        // const data = await response.json()
        
        // Mock data for now
        const mockProjects: Project[] = [
          {
            id: '1',
            title: 'Modern Web Design',
            description: 'A clean and modern web design project showcasing minimalist principles and user-centered design.',
            coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'],
            tags: ['web design', 'minimalist', 'modern'],
            likes: 42,
            comments: 8,
            createdAt: '2024-01-15T10:30:00Z',
            user: {
              id: '1',
              username: 'johndoe',
              name: 'John Doe',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
              isFollowing: false
            }
          },
          {
            id: '2',
            title: 'Mobile App UI Kit',
            description: 'Complete UI kit for mobile applications with 50+ components and dark/light themes.',
            coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'],
            tags: ['mobile', 'ui kit', 'components'],
            likes: 128,
            comments: 23,
            createdAt: '2024-01-14T15:45:00Z',
            user: {
              id: '2',
              username: 'janedoe',
              name: 'Jane Doe',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
              isFollowing: true
            }
          },
          {
            id: '3',
            title: 'Brand Identity Design',
            description: 'Complete brand identity package including logo, color palette, and brand guidelines.',
            coverImage: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop'],
            tags: ['branding', 'logo', 'identity'],
            likes: 89,
            comments: 15,
            createdAt: '2024-01-13T09:20:00Z',
            user: {
              id: '3',
              username: 'mikecreative',
              name: 'Mike Creative',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              isFollowing: false
            }
          }
        ]
        
        setProjects(mockProjects)
      } catch (error) {
        console.error('Discover error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [sortBy, selectedTag])

  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)))

  if (loading) {
    return <DiscoverFeedSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="likes">Most Liked</SelectItem>
            <SelectItem value="comments">Most Commented</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>
                {tag}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No projects found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or check back later for new projects.
          </p>
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(project.likes)
  const [isFollowing, setIsFollowing] = useState(project.user.isFollowing)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    // TODO: Call API to like/unlike
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // TODO: Call API to follow/unfollow
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-0">
        {/* Project Image */}
        <div className="relative aspect-[4/3] bg-muted overflow-hidden">
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {project.images.length > 1 && (
            <Badge className="absolute top-3 right-3 text-xs">
              {project.images.length} images
            </Badge>
          )}
        </div>

        {/* Project Content */}
        <div className="p-4">
          {/* User Info */}
          <div className="flex items-center space-x-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={project.user.avatar} />
              <AvatarFallback className="text-xs">
                {project.user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Link 
                href={`/profile/${project.user.username}`}
                className="text-sm font-medium hover:underline truncate block"
              >
                {project.user.name}
              </Link>
            </div>
            <Button
              variant={isFollowing ? "outline" : "ghost"}
              size="sm"
              onClick={handleFollow}
              className="h-6 px-2 text-xs"
            >
              <UserPlus className="h-3 w-3 mr-1" />
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </div>

          {/* Project Title */}
          <Link 
            href={`/project/${project.id}`}
            className="text-base font-semibold hover:underline block mb-2 line-clamp-1"
          >
            {project.title}
          </Link>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{project.tags.length - 2}
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`h-8 px-2 ${liked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{likeCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <MessageCircle className="h-4 w-4 mr-1" />
                <span className="text-sm">{project.comments}</span>
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 