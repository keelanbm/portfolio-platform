'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { MasonryGrid, MasonryGridItem } from '@/components/ui/masonry-grid'
import { ProjectCard } from '@/components/ui/project-card'
import { ActivityFeedSkeleton } from './activity-feed-skeleton'
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
  user: {
    id: string
    username: string
    name: string
    avatar: string
  }
  isLiked?: boolean
  isSaved?: boolean
}

export function ActivityFeed() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const observerRef = useRef<HTMLDivElement | null>(null)

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
        showToast.error('Failed to load feed', 'Please refresh the page')
      console.error('Feed error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const loadMore = useCallback(async () => {
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
      showToast.error('Failed to load more projects', 'Please try again')
      console.error('Error loading more projects:', error)
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore, currentPage])

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
        rootMargin: '100px', // Start loading 100px before the target is visible
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

  const handleLike = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
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
    try {
      const response = await fetch(`/api/projects/${projectId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
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
    // Navigate to project page instead of modal for better mobile UX
    window.location.href = `/project/${projectId}`
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
    </div>
  )
}

 