'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Share2, ChevronLeft, ChevronRight, X, Info } from 'lucide-react'
import Link from 'next/link'
import { formatRelativeTime } from '@/utils/format'
import { showToast, toastMessages } from '@/lib/toast'

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
  const [showInfo, setShowInfo] = useState(false)
  const [isLiking, setIsLiking] = useState(false)

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
    }
  }, [project])

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

  // Handle clicking on the dark background to close modal
  const handleBackgroundClick = (event: React.MouseEvent) => {
    // Only close if clicking directly on the background (not on modal content)
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

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
        <div className="flex flex-col h-full max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-primary bg-background-primary">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={project.user.avatar} />
                <AvatarFallback className="text-xs bg-accent-primary/10 text-accent-primary">
                  {project.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Link 
                  href={`/profile/${project.user.username}`}
                  className="text-sm font-medium text-text-primary hover:text-accent-primary"
                  onClick={onClose}
                >
                  {project.user.name}
                </Link>
                <p className="text-xs text-text-muted">
                  {formatRelativeTime(project.createdAt)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(!showInfo)}
                className="h-8 w-8 p-0"
              >
                <Info className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Image Area */}
            <div 
              className="flex-1 relative bg-black flex items-center justify-center cursor-pointer" 
              onClick={handleBackgroundClick}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={project.images[currentImageIndex] || project.coverImage}
                  alt={`${project.title} - Image ${currentImageIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="80vw"
                  priority
                  onClick={(e) => e.stopPropagation()} 
                />
              </div>
              
              {/* Navigation Arrows */}
              {project.images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateImage('prev')
                    }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigateImage('next')
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}

              {/* Image Counter */}
              {project.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                  {currentImageIndex + 1} / {project.images.length}
                </div>
              )}
            </div>

            {/* Info Panel */}
            {showInfo && (
              <div className="w-80 border-l border-border-primary bg-background-primary overflow-y-auto">
                <div className="p-4 space-y-4">
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">
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
                      <h3 className="text-sm font-medium text-text-primary mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-sm font-medium text-text-primary mb-2">Stats</h3>
                    <div className="space-y-2 text-sm text-text-secondary">
                      <div className="flex justify-between">
                        <span>Likes</span>
                        <span>{likeCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Comments</span>
                        <span>{project.comments}</span>
                      </div>
                      {project.views && (
                        <div className="flex justify-between">
                          <span>Views</span>
                          <span>{project.views}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between p-4 border-t border-border-primary bg-background-primary">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLiking}
                className={`flex items-center space-x-2 ${
                  liked ? 'text-accent-pink' : 'text-text-muted hover:text-accent-pink'
                }`}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                <span className="text-sm font-medium">{likeCount}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2 text-text-muted hover:text-text-primary"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm">{project.comments}</span>
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center space-x-2 text-text-muted hover:text-text-primary"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </Button>
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