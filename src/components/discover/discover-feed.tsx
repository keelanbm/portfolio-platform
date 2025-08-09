'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MasonryGrid, MasonryGridItem } from '@/components/ui/masonry-grid'
import { ProjectCard } from '@/components/ui/project-card'
import { ProjectModal } from '@/components/project/project-modal'
import { DiscoverFeedSkeleton } from './discover-feed-skeleton'
import { DEFAULT_TAGS } from '@/lib/constants'
import { showToast, toastMessages } from '@/lib/toast'

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
  isSaved?: boolean
  user: {
    id: string
    username: string
    name: string
    avatar: string
    isFollowing: boolean
  }
}

export function DiscoverFeed() {
  const { isSignedIn } = useUser()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('recent')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const observerRef = useRef<HTMLDivElement | null>(null)

  // Get all unique tags from projects for filtering (commented out as not currently used)
  // const allTags = Array.from(new Set(projects.flatMap(project => project.tags)))

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setCurrentPage(1)
      setHasMore(true)
      try {
        // Build query parameters
        const params = new URLSearchParams()
        params.append('sort', sortBy)
        params.append('page', '1')
        params.append('limit', '20')
        if (selectedTags.length > 0) {
          params.append('tags', selectedTags.join(','))
        }
        
        const response = await fetch(`/api/discover?${params.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch projects')
        }
        
        const data = await response.json()
        setProjects(data.projects || [])
        setHasMore(data.hasMore || false)
      } catch (error) {
        showToast.error('Failed to load projects', 'Please refresh the page')
        console.error('Error fetching projects:', error)
        // Fallback to empty array on error
        setProjects([])
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [sortBy, selectedTags])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const nextPage = currentPage + 1
      const params = new URLSearchParams()
      params.append('sort', sortBy)
      params.append('page', nextPage.toString())
      params.append('limit', '20')
      if (selectedTags.length > 0) {
        params.append('tags', selectedTags.join(','))
      }
      
      const response = await fetch(`/api/discover?${params.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to load more projects')
      }
      
      const data = await response.json()
      setProjects(prev => [...prev, ...(data.projects || [])])
      setHasMore(data.hasMore || false)
      setCurrentPage(nextPage)
    } catch (error) {
      showToast.error('Failed to load more projects', 'Please try again')
      console.error('Error loading more projects:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, currentPage, sortBy, selectedTags])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasMore && !loadingMore) {
          loadMore()
        }
      },
      {
        root: null,
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    const currentObserverRef = observerRef.current
    if (currentObserverRef) {
      observer.observe(currentObserverRef)
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef)
      }
    }
  }, [hasMore, loadingMore, loadMore])

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

  const handleLike = async (projectId: string) => {
    // Check authentication state first
    if (!isSignedIn) {
      showToast.error('Please sign in', 'You need to be signed in to like projects')
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.status === 401) {
        showToast.error('Please sign in', 'Your session may have expired. Please sign in again.')
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to toggle like')
      }
      
      const result = await response.json()
      
      // Update the projects state with the new like status
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, isLiked: result.liked, likes: result.likes }
          : project
      ))
      
      // Show success message
      showToast.success(
        result.liked ? toastMessages.project.liked : toastMessages.project.unliked
      )
    } catch (error) {
      showToast.error(toastMessages.generic.error, 'Please try again')
      throw error
    }
  }

  const handleSave = async (projectId: string) => {
    // Check authentication state first
    if (!isSignedIn) {
      showToast.error('Please sign in', 'You need to be signed in to save projects')
      return
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.status === 401) {
        showToast.error('Please sign in', 'Your session may have expired. Please sign in again.')
        return
      }
      
      if (!response.ok) {
        throw new Error('Failed to toggle save')
      }
      
      const result = await response.json()
      
      // Update the projects state with the new save status
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, isSaved: result.saved }
          : project
      ))
      
      // Show success message
      showToast.success(
        result.saved ? 'Project saved!' : 'Project removed from saves'
      )
    } catch (error) {
      showToast.error(toastMessages.generic.error, 'Please try again')
      throw error
    }
  }


  const handleOpenModal = (projectId: string) => {
    setSelectedProjectId(projectId)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedProjectId('')
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

      {/* Projects Masonry Grid */}
      <MasonryGrid className="w-full">
        {projects.map((project) => (
          <MasonryGridItem key={project.id}>
            <ProjectCard 
              project={project}
              onLike={handleLike}
              onSave={handleSave}
              onOpenModal={handleOpenModal}
            />
          </MasonryGridItem>
        ))}
      </MasonryGrid>

      {/* Infinite scroll trigger */}
      {hasMore && (
        <div ref={observerRef} className="text-center py-8">
          {loadingMore ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-primary"></div>
              <span className="text-text-secondary">Loading more projects...</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="btn-secondary" 
              onClick={loadMore}
            >
              Load More
            </Button>
          )}
        </div>
      )}

      {projects.length === 0 && !loading && (
        <div className="text-center py-16">
          <h3 className="text-lg font-semibold mb-3 text-text-primary">No projects found</h3>
          <p className="text-text-secondary">
            Try adjusting your filters or check back later for new projects.
          </p>
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        projectId={selectedProjectId}
        onLike={handleLike}
      />
    </div>
  )
}

 