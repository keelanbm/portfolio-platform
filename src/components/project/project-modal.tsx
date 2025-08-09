'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/utils/format'
import { showToast, toastMessages } from '@/lib/toast'
import CommentSection from './comment-section'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  projectId: string
  onLike?: (projectId: string) => Promise<void>
}

interface ProjectDetail {
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
  backgroundColor?: string
  user: {
    id: string
    username: string
    name: string
    avatar: string
  }
}

export function ProjectModal({ isOpen, onClose, projectId, onLike }: ProjectModalProps) {
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isLiking, setIsLiking] = useState(false)
  const [activeTab, setActiveTab] = useState<'project' | 'comments'>('comments')
  const [showHeartAnimation, setShowHeartAnimation] = useState(false)
  const [doubleClickTimeout, setDoubleClickTimeout] = useState<NodeJS.Timeout | null>(null)
  const [imageError, setImageError] = useState(false)

  const fetchProjectDetails = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch project details')
      }
      const data = await response.json()
      setProject(data)
    } catch (error) {
      showToast.error(toastMessages.project.loadError, 'Please try again')
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  // Fetch project details when modal opens
  useEffect(() => {
    if (isOpen && projectId) {
      fetchProjectDetails()
    }
  }, [isOpen, projectId, fetchProjectDetails])

  // Update state when project data changes
  useEffect(() => {
    if (project) {
      setLiked(project.isLiked || false)
      setLikeCount(project.likes)
      setCurrentImageIndex(0)
      setImageError(false) // Reset image error state
    }
  }, [project])

  const handleImageError = () => {
    setImageError(true)
  }

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (!project || project.images.length <= 1) return

    if (direction === 'prev') {
      setCurrentImageIndex(prev => 
        prev === 0 ? project.images.length - 1 : prev - 1
      )
    } else {
      setCurrentImageIndex(prev => 
        prev === project.images.length - 1 ? 0 : prev + 1
      )
    }
  }, [project])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          navigateImage('prev')
          break
        case 'ArrowRight':
          event.preventDefault()
          navigateImage('next')
          break
        case 'Escape':
          event.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentImageIndex, project, navigateImage, onClose])

  // Instagram-style double-click to like
  const handleImageClick = (event: React.MouseEvent) => {
    // Single click - close modal if clicking on background
    if (event.target === event.currentTarget) {
      if (doubleClickTimeout) {
        clearTimeout(doubleClickTimeout)
        setDoubleClickTimeout(null)
        return // This is part of a double-click, don't close
      }
      
      const timeout = setTimeout(() => {
        onClose()
        setDoubleClickTimeout(null)
      }, 300)
      
      setDoubleClickTimeout(timeout)
    }
  }

  const handleDoubleClick = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    
    // Clear single click timeout
    if (doubleClickTimeout) {
      clearTimeout(doubleClickTimeout)
      setDoubleClickTimeout(null)
    }
    
    // Trigger like action
    await handleLike()
    
    // Show heart animation
    setShowHeartAnimation(true)
    setTimeout(() => setShowHeartAnimation(false), 1000)
  }

  const handleLike = async () => {
    if (!project || !onLike || isLiking) return

    const wasLiked = liked
    const originalCount = likeCount
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
    
    setIsLiking(true)
    try {
      await onLike(project.id)
    } catch (error) {
      // Revert on error
      setLiked(wasLiked)
      setLikeCount(originalCount)
      showToast.error(toastMessages.generic.error, 'Please try again')
      console.error('Error toggling like:', error)
    } finally {
      setIsLiking(false)
    }
  }

  const handleShare = async () => {
    if (!project) return

    const url = `${window.location.origin}/project/${project.id}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: project.description,
          url: url,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
        showToast.success(toastMessages.social.shareSuccess)
      } catch (error) {
        showToast.error(toastMessages.social.shareError)
        console.error('Error copying to clipboard:', error)
      }
    }
  }

  if (!isOpen) return null


  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      size="full"
      showCloseButton={false}
      closeOnOverlayClick={true}
    >
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary"></div>
        </div>
      ) : project ? (
        <div className="flex flex-col h-screen max-h-screen">
          {/* Streamlined Header - Instagram Style */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-border-primary bg-background-primary flex-shrink-0">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={project.user.avatar} />
                <AvatarFallback className="text-sm bg-accent-primary/10 text-accent-primary font-semibold">
                  {project.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link 
                  href={`/profile/${project.user.username}`}
                  className="text-sm font-semibold text-text-primary hover:text-accent-primary transition-colors duration-200"
                  onClick={onClose}
                >
                  {project.user.name}
                </Link>
                <p className="text-xs text-text-muted">
                  {formatRelativeTime(project.createdAt)}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-background-secondary rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Main Content - Responsive Layout */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0">
            {/* Image Area - 75% width on desktop, full width on mobile */}
            <div 
              className="flex-1 md:flex-[0_0_75%] relative flex items-center justify-center cursor-pointer"
              style={{ 
                backgroundColor: project.backgroundColor || '#0a0a0a'
              }}
              onClick={handleImageClick}
              onDoubleClick={handleDoubleClick}
            >
              <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
                <div className="relative w-full h-full flex items-center justify-center">
                  {imageError ? (
                    <div className="flex flex-col items-center justify-center space-y-4 text-white/70">
                      <div className="w-24 h-24 bg-white/10 rounded-lg flex items-center justify-center">
                        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm">Image unavailable</p>
                    </div>
                  ) : (
                    <Image
                      src={project.images[currentImageIndex] || project.coverImage}
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      width={1600}
                      height={1200}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl rounded-lg"
                      sizes="(max-width: 768px) 100vw, 75vw"
                      priority
                      onClick={(e) => e.stopPropagation()}
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
              
              {/* Enhanced Navigation Arrows - Instagram Style */}
              {project.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateImage('prev')
                    }}
                    className="absolute left-2 md:left-6 top-1/2 transform -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 p-0 bg-black/20 hover:bg-black/30 text-white rounded-full backdrop-blur-md transition-all duration-200 border border-white/20 hover:border-white/30 shadow-lg"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateImage('next')
                    }}
                    className="absolute right-2 md:right-6 top-1/2 transform -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 p-0 bg-black/20 hover:bg-black/30 text-white rounded-full backdrop-blur-md transition-all duration-200 border border-white/20 hover:border-white/30 shadow-lg"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}

              {/* Slide indicators */}
              {project.images.length > 1 && (
                <div className="absolute bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentImageIndex(index)
                      }}
                      className={`transition-all duration-200 rounded-full ${
                        index === currentImageIndex
                          ? 'w-3 h-3 bg-white shadow-lg scale-110'
                          : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/75 hover:scale-105'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Image counter */}
              {project.images.length > 1 && (
                <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-black/30 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-medium backdrop-blur-md border border-white/20">
                  {currentImageIndex + 1} of {project.images.length}
                </div>
              )}
              
              {/* Double-click heart animation */}
              {showHeartAnimation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="animate-ping">
                    <Heart className="h-20 w-20 text-red-500 fill-current drop-shadow-2xl" />
                  </div>
                </div>
              )}
            </div>

            {/* Comments Sidebar - 25% width on desktop, full width on mobile */}
            <div className="flex-1 md:flex-[0_0_25%] border-t md:border-t-0 md:border-l border-border-primary bg-background-primary flex flex-col h-full min-h-0 max-h-[50vh] md:max-h-none">
              {/* Tab Navigation */}
              <div className="flex border-b border-border-primary bg-background-primary flex-shrink-0">
                <button
                  onClick={() => setActiveTab('project')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    activeTab === 'project'
                      ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/5'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary/50'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-all duration-200 relative ${
                    activeTab === 'comments'
                      ? 'text-accent-primary border-b-2 border-accent-primary bg-accent-primary/5'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-secondary/50'
                  }`}
                >
                  Comments
                  {project.comments > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-accent-primary text-white rounded-full font-medium">
                      {project.comments}
                    </span>
                  )}
                </button>
              </div>

              {/* Tab Content - Properly scrollable */}
              <div className="flex-1 min-h-0 flex flex-col">
                {activeTab === 'project' ? (
                  <div className="flex-1 overflow-y-auto">
                    <div className="p-4 space-y-4">
                      <div>
                        <h2 className="text-lg font-bold text-text-primary mb-2 leading-tight">
                          {project.title}
                        </h2>
                        {project.description && (
                          <p className="text-sm text-text-secondary leading-relaxed">
                            {project.description}
                          </p>
                        )}
                      </div>

                      {project.tags.length > 0 && (
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-3 pt-4 border-t border-border-primary">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleLike}
                              disabled={isLiking}
                              className={`p-0 h-8 hover:scale-110 transition-all duration-200 flex items-center space-x-2 ${
                                liked ? 'text-red-500' : 'text-text-primary hover:text-red-500'
                              }`}
                            >
                              <Heart className={`h-5 w-5 ${liked ? 'fill-current' : ''}`} />
                              <span className="font-medium">{likeCount}</span>
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveTab('comments')}
                              className="p-0 h-8 hover:scale-110 transition-all duration-200 flex items-center space-x-2 text-text-primary hover:text-accent-primary"
                            >
                              <MessageCircle className="h-5 w-5" />
                              <span className="font-medium">{project.comments}</span>
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleShare}
                              className="p-0 h-8 text-text-primary hover:text-accent-primary hover:scale-110 transition-all duration-200"
                            >
                              <Share2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <span className="font-semibold text-text-primary">{likeCount} likes</span>
                          {project.views && (
                            <span>{project.views.toLocaleString()} views</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 min-h-0 flex flex-col">
                    <CommentSection projectId={projectId} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-text-muted">Project not found</p>
        </div>
      )}
    </Modal>
  )
}