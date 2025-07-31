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
            coverImage: 'https://picsum.photos/800/600?random=1',
            images: ['https://picsum.photos/800/600?random=1'],
            tags: ['web design', 'minimalist', 'modern'],
            likes: 42,
            comments: 8,
            createdAt: '2024-01-15T10:30:00Z',
            user: {
              id: '1',
              username: 'johndoe',
              name: 'John Doe',
              avatar: 'https://picsum.photos/100/100?random=10',
              isFollowing: false
            }
          },
          {
            id: '2',
            title: 'Mobile App UI Kit',
            description: 'Complete UI kit for mobile applications with 50+ components and dark/light themes.',
            coverImage: 'https://picsum.photos/800/600?random=2',
            images: ['https://picsum.photos/800/600?random=2'],
            tags: ['mobile', 'ui kit', 'components'],
            likes: 128,
            comments: 23,
            createdAt: '2024-01-14T15:45:00Z',
            user: {
              id: '2',
              username: 'janedoe',
              name: 'Jane Doe',
              avatar: 'https://picsum.photos/100/100?random=11',
              isFollowing: true
            }
          },
          {
            id: '3',
            title: 'Brand Identity Design',
            description: 'Complete brand identity package including logo, color palette, and brand guidelines.',
            coverImage: 'https://picsum.photos/800/600?random=3',
            images: ['https://picsum.photos/800/600?random=3'],
            tags: ['branding', 'logo', 'identity'],
            likes: 89,
            comments: 15,
            createdAt: '2024-01-13T09:20:00Z',
            user: {
              id: '3',
              username: 'mikecreative',
              name: 'Mike Creative',
              avatar: 'https://picsum.photos/100/100?random=12',
              isFollowing: false
            }
          },
          {
            id: '4',
            title: 'Dashboard UI Design',
            description: 'Modern analytics dashboard with data visualization and interactive charts.',
            coverImage: 'https://picsum.photos/800/600?random=4',
            images: ['https://picsum.photos/800/600?random=4'],
            tags: ['dashboard', 'analytics', 'ui design'],
            likes: 156,
            comments: 31,
            createdAt: '2024-01-12T14:20:00Z',
            user: {
              id: '4',
              username: 'sarahdesigner',
              name: 'Sarah Designer',
              avatar: 'https://picsum.photos/100/100?random=13',
              isFollowing: true
            }
          },
          {
            id: '5',
            title: 'E-commerce Website',
            description: 'Complete e-commerce platform with product catalog and shopping cart functionality.',
            coverImage: 'https://picsum.photos/800/600?random=5',
            images: ['https://picsum.photos/800/600?random=5'],
            tags: ['e-commerce', 'web design', 'shopping'],
            likes: 203,
            comments: 45,
            createdAt: '2024-01-11T11:15:00Z',
            user: {
              id: '5',
              username: 'alexkim',
              name: 'Alex Kim',
              avatar: 'https://picsum.photos/100/100?random=14',
              isFollowing: false
            }
          },
          {
            id: '6',
            title: 'Illustration Series',
            description: 'Collection of hand-drawn illustrations for children\'s books and educational materials.',
            coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
            tags: ['illustration', 'children', 'art'],
            likes: 67,
            comments: 12,
            createdAt: '2024-01-10T16:30:00Z',
            user: {
              id: '6',
              username: 'lilypark',
              name: 'Lily Park',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
              isFollowing: true
            }
          },
          {
            id: '7',
            title: 'Fitness App Interface',
            description: 'Mobile app design for fitness tracking with workout plans and progress monitoring.',
            coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'],
            tags: ['fitness', 'mobile app', 'ui design'],
            likes: 134,
            comments: 28,
            createdAt: '2024-01-09T09:45:00Z',
            user: {
              id: '7',
              username: 'emmathompson',
              name: 'Emma Thompson',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
              isFollowing: false
            }
          },
          {
            id: '8',
            title: 'Restaurant Branding',
            description: 'Complete branding package for a modern restaurant including logo, menu design, and signage.',
            coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop'],
            tags: ['restaurant', 'branding', 'print design'],
            likes: 98,
            comments: 19,
            createdAt: '2024-01-08T13:20:00Z',
            user: {
              id: '8',
              username: 'marcusrodriguez',
              name: 'Marcus Rodriguez',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              isFollowing: true
            }
          },
          {
            id: '9',
            title: 'Social Media App',
            description: 'Modern social media platform with photo sharing and community features.',
            coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop'],
            tags: ['social media', 'mobile app', 'ui design'],
            likes: 187,
            comments: 42,
            createdAt: '2024-01-07T10:10:00Z',
            user: {
              id: '9',
              username: 'davidchen',
              name: 'David Chen',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
              isFollowing: false
            }
          },
          {
            id: '10',
            title: 'Travel Website Design',
            description: 'Comprehensive travel booking platform with destination guides and booking system.',
            coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'],
            tags: ['travel', 'web design', 'booking'],
            likes: 145,
            comments: 33,
            createdAt: '2024-01-06T15:30:00Z',
            user: {
              id: '10',
              username: 'sophiawang',
              name: 'Sophia Wang',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
              isFollowing: true
            }
          },
          {
            id: '11',
            title: 'Product Packaging Design',
            description: 'Creative packaging solutions for consumer products with sustainable materials.',
            coverImage: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&h=600&fit=crop'],
            tags: ['packaging', 'product design', 'sustainable'],
            likes: 76,
            comments: 14,
            createdAt: '2024-01-05T12:45:00Z',
            user: {
              id: '11',
              username: 'jessicagarcia',
              name: 'Jessica Garcia',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
              isFollowing: false
            }
          },
          {
            id: '12',
            title: 'Banking App Interface',
            description: 'Secure and user-friendly banking application with transaction history and payment features.',
            coverImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop'],
            tags: ['banking', 'fintech', 'ui design'],
            likes: 167,
            comments: 38,
            createdAt: '2024-01-04T08:20:00Z',
            user: {
              id: '12',
              username: 'robertlee',
              name: 'Robert Lee',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              isFollowing: true
            }
          },
          {
            id: '13',
            title: 'Event Poster Collection',
            description: 'Series of event posters for music festivals and cultural events with bold typography.',
            coverImage: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'],
            tags: ['poster design', 'typography', 'events'],
            likes: 92,
            comments: 21,
            createdAt: '2024-01-03T17:15:00Z',
            user: {
              id: '13',
              username: 'amandawright',
              name: 'Amanda Wright',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
              isFollowing: false
            }
          },
          {
            id: '14',
            title: 'Healthcare App Design',
            description: 'Patient portal and healthcare management system with appointment scheduling and medical records.',
            coverImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop'],
            tags: ['healthcare', 'medical', 'ui design'],
            likes: 123,
            comments: 26,
            createdAt: '2024-01-02T11:30:00Z',
            user: {
              id: '14',
              username: 'michaelbrown',
              name: 'Michael Brown',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
              isFollowing: true
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
  const [imageError, setImageError] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    // TODO: Call API to like/unlike
  }

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // TODO: Call API to follow/unfollow
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
                <Share className="h-3 w-3" />
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