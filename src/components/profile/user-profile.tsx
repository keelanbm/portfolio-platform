'use client'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Heart, MessageCircle, Share, UserPlus, Settings } from 'lucide-react'
import Link from 'next/link'
import { UserProfileSkeleton } from './user-profile-skeleton'

interface User {
  id: string
  username: string
  name: string
  bio: string
  avatar: string
  website?: string
  location?: string
  followersCount: number
  followingCount: number
  projectsCount: number
  isFollowing: boolean
  isOwnProfile: boolean
}

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
}

interface UserProfileProps {
  username: string
}

export function UserProfile({ username }: UserProfileProps) {
  const { user: currentUser } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('projects')

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/users/${username}`)
        // const data = await response.json()
        
        // Mock data for now
        const mockUser: User = {
          id: '1',
          username: username,
          name: 'John Doe',
          bio: "UI/UX Designer passionate about creating beautiful digital experiences. I love working with modern design systems and user-centered design principles.",
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
          website: 'https://johndoe.design',
          location: 'San Francisco, CA',
          followersCount: 1247,
          followingCount: 89,
          projectsCount: 23,
          isFollowing: false,
          isOwnProfile: currentUser?.username === username
        }

        const mockProjects: Project[] = [
          {
            id: '1',
            title: 'Modern Web Design',
            description: 'A clean and modern web design project showcasing minimalist principles',
            coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'],
            tags: ['web design', 'minimalist', 'modern'],
            likes: 42,
            comments: 8,
            createdAt: '2024-01-15T10:30:00Z'
          },
          {
            id: '2',
            title: 'Mobile App UI Kit',
            description: 'Complete UI kit for mobile applications with 50+ components',
            coverImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
            images: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'],
            tags: ['mobile', 'ui kit', 'components'],
            likes: 128,
            comments: 23,
            createdAt: '2024-01-14T15:45:00Z'
          }
        ]
        
        setUser(mockUser)
        setProjects(mockProjects)
      } catch (error) {
        console.error('Profile error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserProfile()
  }, [username, currentUser?.username])

  const handleFollow = async () => {
    if (!user) return
    
    try {
      // TODO: Call API to follow/unfollow
      setUser(prev => prev ? {
        ...prev,
        isFollowing: !prev.isFollowing,
        followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
      } : null)
    } catch (error) {
      console.error('Follow error:', error)
    }
  }

  if (loading) {
    return <UserProfileSkeleton />
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">User not found</h2>
        <p className="text-muted-foreground">
          The user you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card className="bg-background-secondary border-border-primary">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            {/* Avatar Section */}
            <div className="flex-shrink-0">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl bg-accent-primary/20 text-accent-primary">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            {/* Content Section */}
            <div className="flex-1 min-w-0 text-center md:text-left">
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                <h1 className="text-2xl font-bold text-text-primary">{user.name}</h1>
                <Badge variant="outline" className="bg-background-tertiary text-text-secondary border-border-primary">
                  @{user.username}
                </Badge>
                {user.isOwnProfile && (
                  <Button variant="ghost" size="sm" className="text-text-secondary hover:text-text-primary hover:bg-background-tertiary">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
              
              {user.bio && (
                <p className="text-text-secondary mb-4 max-w-2xl mx-auto md:mx-0">
                  {user.bio}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
                {user.location && (
                  <span className="text-sm text-text-muted">
                    📍 {user.location}
                  </span>
                )}
                {user.website && (
                  <a 
                    href={user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-accent-primary hover:underline"
                  >
                    🌐 {user.website.replace(/^https?:\/\//, '')}
                  </a>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto text-text-primary hover:text-accent-primary">
                      <span className="font-semibold">{user.followersCount}</span>
                      <span className="text-text-muted ml-1">followers</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background-secondary border-border-primary">
                    <DialogHeader>
                      <DialogTitle className="text-text-primary">Followers</DialogTitle>
                    </DialogHeader>
                    <FollowersList />
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="p-0 h-auto text-text-primary hover:text-accent-primary">
                      <span className="font-semibold">{user.followingCount}</span>
                      <span className="text-text-muted ml-1">following</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background-secondary border-border-primary">
                    <DialogHeader>
                      <DialogTitle className="text-text-primary">Following</DialogTitle>
                    </DialogHeader>
                    <FollowingList />
                  </DialogContent>
                </Dialog>
                
                <Button variant="ghost" className="p-0 h-auto text-text-primary hover:text-accent-primary">
                  <span className="font-semibold">{user.projectsCount}</span>
                  <span className="text-text-muted ml-1">projects</span>
                </Button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              {!user.isOwnProfile && (
                <>
                  <Button 
                    onClick={handleFollow}
                    variant={user.isFollowing ? "outline" : "default"}
                    className={user.isFollowing ? "btn-secondary" : "btn-primary"}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    {user.isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="outline" className="btn-secondary">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 bg-background-secondary border-border-primary">
          <TabsTrigger value="projects" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-background-tertiary">
            Projects ({projects.length})
          </TabsTrigger>
          <TabsTrigger value="liked" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-background-tertiary">
            Liked
          </TabsTrigger>
          <TabsTrigger value="collections" className="text-text-secondary data-[state=active]:text-text-primary data-[state=active]:bg-background-tertiary">
            Collections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2 text-text-primary">No projects yet</h3>
              <p className="text-text-secondary">
                {user.isOwnProfile 
                  ? "Start creating your first project to showcase your work."
                  : "This user hasn't shared any projects yet."
                }
              </p>
              {user.isOwnProfile && (
                <Button asChild className="mt-4 btn-primary">
                  <Link href="/create">Create Project</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="liked" className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2 text-text-primary">Liked Projects</h3>
          <p className="text-text-secondary">
            {user.isOwnProfile 
              ? "Projects you've liked will appear here."
              : "This user's liked projects are private."
            }
          </p>
        </TabsContent>

        <TabsContent value="collections" className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2 text-text-primary">Collections</h3>
          <p className="text-text-secondary">
            {user.isOwnProfile 
              ? "Create collections to organize your favorite projects."
              : "This user hasn't created any collections yet."
            }
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(project.likes)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    // TODO: Call API to like/unlike
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <CardContent className="p-0">
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
        
        <div className="p-4">
          <Link 
            href={`/project/${project.id}`}
            className="text-base font-semibold hover:underline block mb-2 line-clamp-1"
          >
            {project.title}
          </Link>
          
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

function FollowersList() {
  // TODO: Implement followers list
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Followers list will be implemented here</p>
    </div>
  )
}

function FollowingList() {
  // TODO: Implement following list
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Following list will be implemented here</p>
    </div>
  )
} 