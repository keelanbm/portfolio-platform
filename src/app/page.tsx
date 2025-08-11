'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ProjectCard } from '@/components/ui/project-card'
import { ProjectModal } from '@/components/project/project-modal'
import { CategoryFilterBar } from '@/components/homepage/category-filter-bar'
import { HOMEPAGE_PROJECTS } from '@/data/homepage-projects'
import { TrendingUp, Users, Award } from 'lucide-react'
import { showToast } from '@/lib/toast'

interface Project {
  id: string
  title: string
  description: string
  coverImage: string
  images: string[]
  tags: string[]
  likes: number
  comments: number
  views?: number
  createdAt: string
  isLiked?: boolean
  user: {
    id: string
    username: string
    name: string
    avatar: string
    isFollowing?: boolean
  }
}

// Simple cache for API responses
const apiCache = new Map<string, { data: Project[]; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export default function HomePage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true) // Start with loading true
  const [loadingMore, setLoadingMore] = useState(false)
  const [useRealData, setUseRealData] = useState(true) // Default to real data
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observer = useRef<IntersectionObserver | null>(null)

  // Fetch function for initial load and filter changes
  const fetchData = useCallback(
    async (tags: string[], realData: boolean, pageNum: number = 1, append: boolean = false) => {
      if (pageNum === 1 && !append) {
        setLoading(true)
        setError(null)
        setPage(1)
        setHasMore(true)
      } else {
        setLoadingMore(true)
      }
      
      if (!realData) {
        // Use mock data
        setProjects(HOMEPAGE_PROJECTS)
        setLoading(false)
        setLoadingMore(false)
        setHasMore(false)
        return
      }

      try {
        const params = new URLSearchParams()
        params.append('limit', '12') // Reduced limit for better infinite scroll experience
        params.append('page', pageNum.toString())
        
        // Default to popular sorting for "Most Popular", otherwise recent
        if (tags.length === 0) {
          params.append('sort', 'popular')
        } else {
          params.append('sort', 'popular') // Keep popular for filtered results too
          params.append('tags', tags.join(','))
        }

        const cacheKey = `${params.toString()}-page-${pageNum}`
        const cached = apiCache.get(cacheKey)
        const now = Date.now()
        
        // Check cache first (only for first page to avoid stale pagination)
        if (pageNum === 1 && !append && cached && (now - cached.timestamp) < CACHE_DURATION) {
          setProjects(cached.data)
          setLoading(false)
          setLoadingMore(false)
          return
        }

        const response = await fetch(`/api/discover?${params.toString()}`, {
          // Add timeout for faster fallback to mock data
          signal: AbortSignal.timeout(8000) // 8 second timeout
        })
        if (response.ok) {
          const data = await response.json()
          const newProjects = data.projects || []
          
          if (append && pageNum > 1) {
            setProjects(prev => [...prev, ...newProjects])
            if (newProjects.length > 0) {
              showToast.success('More Projects Loaded', `Found ${newProjects.length} more projects`)
            }
          } else {
            setProjects(newProjects)
            // Cache the response for first page only
            if (pageNum === 1) {
              apiCache.set(cacheKey, { data: newProjects, timestamp: now })
            }
            
            // Show success message for filter changes
            if (tags.length > 0 && newProjects.length > 0) {
              showToast.info('Filter Applied', `Found ${newProjects.length} projects for ${tags.join(', ')}`)
            }
          }
          
          setHasMore(data.hasMore || false)
          
          if (newProjects.length === 0 && tags.length > 0 && pageNum === 1) {
            const errorMessage = `No projects found for ${tags.join(', ')}. Try different categories.`
            setError(errorMessage)
            showToast.warning('No Results', errorMessage)
          }
        } else {
          throw new Error('Failed to fetch projects')
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
        if (pageNum === 1 && !append) {
          const errorMessage = 'Unable to load projects. Switching to example data.'
          setError(errorMessage)
          showToast.warning('Connection Issue', 'Unable to load latest projects. Showing examples instead.')
          setProjects(HOMEPAGE_PROJECTS)
          setUseRealData(false)
          setHasMore(false)
        } else {
          showToast.error('Loading Error', 'Failed to load more projects. Please try again.')
        }
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    []
  )

  // Debounced function for initial loads and filter changes
  const debouncedFetchData = useCallback(
    async (tags: string[], realData: boolean) => {
      await fetchData(tags, realData, 1, false)
    },
    [fetchData]
  )

  // Load more projects when reaching the bottom
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingMore || loading) return
    
    const nextPage = page + 1
    setPage(nextPage)
    await fetchData(selectedTags, useRealData, nextPage, true)
  }, [hasMore, loadingMore, loading, page, selectedTags, useRealData, fetchData])

  // Intersection observer for infinite scroll
  const lastProjectElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return
    if (observer.current) observer.current.disconnect()
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore()
      }
    }, {
      threshold: 0.1,
      rootMargin: '100px' // Load more when 100px from the bottom
    })
    
    if (node) observer.current.observe(node)
  }, [loading, loadingMore, hasMore, loadMore])

  // Debounced effect to avoid excessive API calls on rapid tag changes
  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedFetchData(selectedTags, useRealData)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [selectedTags, useRealData, debouncedFetchData])

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [])

  // Projects are already filtered server-side, no need for client-side filtering
  const filteredProjects = projects

  // Enhanced like handler with real API integration and toast feedback
  const handleLike = async (projectId: string) => {
    try {
      const project = projects.find(p => p.id === projectId)
      if (!project) return

      // Optimistic update
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 }
          : p
      ))

      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        throw new Error('Failed to update like status')
      }

      const data = await response.json()
      
      // Show toast notification
      if (data.isLiked) {
        showToast.success('❤️ Liked!', `Added "${project.title}" to your likes`)
      } else {
        showToast.info('Removed like', `Removed "${project.title}" from your likes`)
      }

      // Update with actual server response
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, isLiked: data.isLiked, likes: data.likeCount }
          : p
      ))

    } catch (error) {
      console.error('Error updating like:', error)
      
      // Revert optimistic update on error
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes + 1 : p.likes - 1 }
          : p
      ))
      
      showToast.error('Like Failed', 'Please sign in to like projects')
    }
  }

  // Modal state for homepage projects
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')

  // Modal handler that works with current data (mock or real)
  const handleOpenModal = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setSelectedProjectId(projectId)
      setModalOpen(true)
      showToast.info('Project Details', `Viewing "${project.title}" by ${project.user.name}`)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedProjectId('')
  }

  return (
    <div className="w-full">
      {/* Compact Hero Section (reduced vertical space) */}
      <div className="px-8 py-6 border-b border-border-primary bg-background-primary">
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-2"> {/* Updated with seeded data */}
          <div className="text-sm text-text-secondary">Join thousands of creators</div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Showcase Your <span className="text-accent-primary">Creative Vision</span>
          </h1>
          <div className="flex gap-3 pt-2">
            <Button size="sm" className="btn-primary">Start Sharing</Button>
            <Button size="sm" variant="outline">Explore Work</Button>
          </div>
        </div>
      </div>

      {/* Development Helper (hidden by default) */}
      {/* Removed the live/examples toggle and counts for a cleaner UI */}

      {/* Sticky Category Filter Bar (more compact) */}
      <CategoryFilterBar 
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        loading={loading}
      />

      {/* Main Project Showcase - The Hero Content */}
      <section className="px-8 py-12 bg-background-primary min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
              {[...Array(20)].map((_, index) => (
                <div key={index} className="group cursor-pointer">
                  {/* Image Skeleton */}
                  <div className="relative bg-background-secondary rounded-lg aspect-[4/3] animate-pulse overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-background-secondary via-background-tertiary to-background-secondary animate-shimmer bg-size-200 bg-pos-neg"></div>
                  </div>
                  
                  {/* Content Skeleton */}
                  <div className="mt-3 space-y-2">
                    {/* Title */}
                    <div className="h-4 bg-background-secondary rounded animate-pulse"></div>
                    
                    {/* User info */}
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 bg-background-secondary rounded-full animate-pulse"></div>
                      <div className="h-3 bg-background-secondary rounded w-20 animate-pulse"></div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center space-x-4 text-xs">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-background-secondary rounded animate-pulse"></div>
                        <div className="h-3 bg-background-secondary rounded w-6 animate-pulse"></div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-background-secondary rounded animate-pulse"></div>
                        <div className="h-3 bg-background-secondary rounded w-4 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Projects Grid - Larger cards with fewer columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                {filteredProjects.map((project, index) => {
                  // Add ref to the last few projects to trigger loading more
                  const isLastProject = index === filteredProjects.length - 1
                  const isNearEnd = index >= filteredProjects.length - 3
                  
                  return (
                    <div
                      key={project.id}
                      ref={isLastProject ? lastProjectElementRef : null}
                      className={isNearEnd ? 'animate-in slide-in-from-bottom-4 duration-300' : ''}
                    >
                      <ProjectCard
                        project={project}
                        onLike={handleLike}
                        onOpenModal={handleOpenModal}
                        aspectRatio={4/3} // Force 4:3 aspect ratio for homepage
                        priority={index < 8} // Priority loading for first 8 projects (above fold)
                      />
                    </div>
                  )
                })}
              </div>

              {/* Loading More Indicator */}
              {loadingMore && (
                <div className="flex justify-center items-center py-8 mt-8">
                  <div className="flex items-center space-x-3 text-text-secondary">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-primary"></div>
                    <span className="text-sm font-medium">Loading more projects...</span>
                  </div>
                </div>
              )}

              {/* End of Results Indicator */}
              {!hasMore && !loading && filteredProjects.length > 0 && (
                <div className="text-center py-8 mt-8">
                  <div className="text-text-secondary text-sm">
                    You&apos;ve reached the end! {filteredProjects.length} projects loaded.
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold mb-3 text-text-primary">Oops! Something went wrong</h3>
                  <p className="text-text-secondary mb-6">{error}</p>
                  <div className="flex items-center justify-center space-x-4">
                    <Button
                      onClick={() => {
                        setError(null)
                        setUseRealData(true)
                      }}
                      variant="default"
                    >
                      Try Again
                    </Button>
                    <Button
                      onClick={() => setSelectedTags([])}
                      variant="outline"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}

              {/* No Results State */}
              {filteredProjects.length === 0 && !loading && !error && (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold mb-3 text-text-primary">No projects found</h3>
                  <p className="text-text-secondary mb-6">
                    {selectedTags.length > 0 
                      ? `No projects found for ${selectedTags.join(', ')}. Try different categories or clear filters.`
                      : useRealData 
                        ? "No projects in the database yet. Check back soon or try example data."
                        : "Try selecting a different category to see more amazing work."
                    }
                  </p>
                  <div className="flex items-center justify-center space-x-4">
                    {selectedTags.length > 0 && (
                      <Button
                        onClick={() => setSelectedTags([])}
                        variant="default"
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button
                      onClick={() => setUseRealData(!useRealData)}
                      variant="outline"
                    >
                      {useRealData ? 'Switch to Examples' : 'Switch to Real Data'}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Simplified Social Proof Section */}
      <section className="px-8 py-16 bg-background-secondary/30 border-t border-border-primary">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-accent-primary mr-3" />
                <span className="text-4xl font-bold text-text-primary">10K+</span>
              </div>
              <p className="text-text-secondary text-lg">Projects Shared</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <Users className="w-8 h-8 text-accent-secondary mr-3" />
                <span className="text-4xl font-bold text-text-primary">5K+</span>
              </div>
              <p className="text-text-secondary text-lg">Creative Professionals</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <Award className="w-8 h-8 text-accent-primary mr-3" />
                <span className="text-4xl font-bold text-text-primary">50K+</span>
              </div>
              <p className="text-text-secondary text-lg">Community Interactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Updated Project Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        projectId={selectedProjectId}
        onLike={handleLike}
      />
    </div>
  )
}