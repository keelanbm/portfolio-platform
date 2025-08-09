'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { ProjectCard } from '@/components/ui/project-card'
import { Bookmark, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { showToast } from '@/lib/toast'

interface SavedProject {
  id: string
  title: string
  description?: string
  coverImage: string
  images: string[]
  tags: string[]
  likes: number
  comments: number
  saves: number
  views: number
  createdAt: string
  savedAt: string
  backgroundColor?: string
  gradientColors?: string[]
  backgroundStyle?: 'AUTO' | 'SOLID' | 'GRADIENT'
  user: {
    id: string
    username: string
    name: string
    avatar: string
  }
}

interface SavedProjectsResponse {
  projects: SavedProject[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export default function SavedPage() {
  const { isLoaded, isSignedIn } = useAuth()
  const [projects, setProjects] = useState<SavedProject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchSavedProjects()
    } else if (isLoaded && !isSignedIn) {
      setError('Please sign in to view your saved projects')
      setLoading(false)
    }
  }, [isLoaded, isSignedIn])

  const fetchSavedProjects = async (pageNum = 1, append = false) => {
    try {
      setLoading(pageNum === 1)
      const response = await fetch(`/api/saved?page=${pageNum}&limit=20`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch saved projects')
      }

      const data: SavedProjectsResponse = await response.json()
      
      if (append) {
        setProjects(prev => [...prev, ...data.projects])
      } else {
        setProjects(data.projects)
      }
      
      setHasMore(data.pagination.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error('Error fetching saved projects:', error)
      setError('Failed to load saved projects')
      showToast.error('Failed to load saved projects')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to toggle like')
      }

      const data = await response.json()
      
      // Update project in list
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { 
              ...project, 
              likes: data.liked ? project.likes + 1 : project.likes - 1,
              isLiked: data.liked 
            }
          : project
      ))

      showToast.success(data.liked ? 'Project liked!' : 'Project unliked')
    } catch (error) {
      console.error('Error toggling like:', error)
      showToast.error('Failed to toggle like')
      throw error
    }
  }

  const handleUnsave = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/save`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Failed to unsave project')
      }

      const data = await response.json()
      
      if (!data.saved) {
        // Remove from saved projects list
        setProjects(prev => prev.filter(project => project.id !== projectId))
        showToast.success('Project removed from saves')
      }
    } catch (error) {
      console.error('Error removing save:', error)
      showToast.error('Failed to remove save')
      throw error
    }
  }

  const handleLoadMore = () => {
    fetchSavedProjects(page + 1, true)
  }

  if (!isLoaded) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-background-secondary rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[4/3] bg-background-secondary rounded-lg"></div>
                <div className="h-4 bg-background-secondary rounded w-3/4"></div>
                <div className="h-3 bg-background-secondary rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <Bookmark className="h-16 w-16 mx-auto mb-6 text-text-muted" />
        <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
        <p className="text-text-muted mb-8">
          Please sign in to view and manage your saved projects.
        </p>
        <Button asChild>
          <a href="/login">Sign In</a>
        </Button>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-red-500 mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-4">Error Loading Saved Projects</h1>
        <p className="text-text-muted mb-8">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Bookmark className="h-8 w-8 text-accent-primary" />
            <div>
              <h1 className="text-3xl font-bold">Saved Projects</h1>
              <p className="text-text-muted">
                {loading ? 'Loading...' : `${projects.length} saved project${projects.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading && projects.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-[4/3] bg-background-secondary rounded-lg"></div>
              <div className="h-4 bg-background-secondary rounded w-3/4"></div>
              <div className="h-3 bg-background-secondary rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="h-16 w-16 mx-auto mb-6 text-text-muted" />
          <h3 className="text-xl font-semibold mb-2">No Saved Projects</h3>
          <p className="text-text-muted mb-8">
            Start exploring and save projects you love to see them here.
          </p>
          <Button asChild>
            <a href="/discover">Explore Projects</a>
          </Button>
        </div>
      ) : (
        <>
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
              : "space-y-4"
          }>
            {projects.map((project) => (
              <div key={project.id} className="relative">
                <ProjectCard
                  project={{
                    ...project,
                    isSaved: true // All projects on this page are saved
                  }}
                  onLike={handleLike}
                  onSave={handleUnsave}
                  aspectRatio={viewMode === 'grid' ? 4/3 : undefined}
                />
                
                {/* Saved Date Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 text-xs bg-accent-primary/20 text-accent-primary border-accent-primary/20"
                >
                  Saved {new Date(project.savedAt).toLocaleDateString()}
                </Badge>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-12">
              <Button 
                onClick={handleLoadMore}
                disabled={loading}
                size="lg"
              >
                {loading ? 'Loading...' : 'Load More Projects'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}