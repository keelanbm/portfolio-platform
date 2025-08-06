'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Eye, X } from 'lucide-react'
import { ProjectCard } from '@/components/ui/project-card'
import { HeroSection } from '@/components/homepage/hero-section'
import { CategoryFilterBar } from '@/components/homepage/category-filter-bar'
import { HOMEPAGE_PROJECTS } from '@/data/homepage-projects'
import { TrendingUp, Users, Award } from 'lucide-react'

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

export default function HomePage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [projects, setProjects] = useState<Project[]>(HOMEPAGE_PROJECTS)
  const [loading, setLoading] = useState(false)
  const [useRealData, setUseRealData] = useState(false)

  // Fetch real projects from database
  useEffect(() => {
    const fetchRealData = async () => {
      if (!useRealData) return

      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.append('limit', '20')
        params.append('sort', 'recent')
        if (selectedTags.length > 0) {
          params.append('tags', selectedTags.join(','))
        }

        const response = await fetch(`/api/discover?${params.toString()}`)
        if (response.ok) {
          const data = await response.json()
          setProjects(data.projects || [])
        } else {
          // Fallback to mock data on error
          setProjects(HOMEPAGE_PROJECTS)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
        // Fallback to mock data on error
        setProjects(HOMEPAGE_PROJECTS)
      } finally {
        setLoading(false)
      }
    }

    fetchRealData()
  }, [selectedTags, useRealData])

  // Filter projects (works for both mock and real data)
  const filteredProjects = selectedTags.length === 0 
    ? projects 
    : projects.filter(project => 
        selectedTags.some(tag => 
          project.tags.some(projectTag => 
            projectTag.toLowerCase().includes(tag.toLowerCase()) ||
            tag.toLowerCase().includes(projectTag.toLowerCase())
          )
        )
      )

  // Mock like handler (would connect to API in real implementation)
  const handleLike = async (projectId: string) => {
    console.log('Liked project:', projectId)
    return Promise.resolve()
  }

  // Modal state for homepage projects
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Modal handler that works with current data (mock or real)
  const handleOpenModal = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    if (project) {
      setSelectedProject(project)
      setModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedProject(null)
  }

  return (
    <div className="w-full">
      {/* Compact Hero Section */}
      <HeroSection />

      {/* Data Source Toggle (Development Helper) */}
      <div className="px-8 py-2 bg-background-secondary/30 border-b border-border-primary">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-text-secondary">Data Source:</span>
            <Button
              variant={!useRealData ? "default" : "outline"}
              size="sm"
              onClick={() => setUseRealData(false)}
              className="text-xs"
            >
              Mock Data
            </Button>
            <Button
              variant={useRealData ? "default" : "outline"}
              size="sm"
              onClick={() => setUseRealData(true)}
              className="text-xs"
            >
              Real Database
            </Button>
          </div>
          {loading && (
            <div className="flex items-center space-x-2 text-text-secondary text-sm">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-primary"></div>
              <span>Loading projects...</span>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Category Filter Bar */}
      <CategoryFilterBar 
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />

      {/* Main Project Showcase - The Hero Content */}
      <section className="px-8 py-12 bg-background-primary min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Loading State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
              {[...Array(12)].map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="bg-background-secondary rounded-lg aspect-[4/3] animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-background-secondary rounded animate-pulse" />
                    <div className="h-3 bg-background-secondary rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Projects Grid - 4 Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8">
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onLike={handleLike}
                    onOpenModal={handleOpenModal}
                    aspectRatio={4/3} // Force 4:3 aspect ratio for homepage
                    priority={index < 8} // Priority loading for first 8 projects (above fold)
                  />
                ))}
              </div>

              {/* No Results State */}
              {filteredProjects.length === 0 && !loading && (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold mb-3 text-text-primary">No projects found</h3>
                  <p className="text-text-secondary mb-6">
                    {useRealData 
                      ? "No projects in the database match your filters. Try switching to Mock Data to see examples."
                      : "Try selecting a different category to see more amazing work."
                    }
                  </p>
                  {useRealData && (
                    <Button
                      onClick={() => setUseRealData(false)}
                      variant="outline"
                      className="mt-4"
                    >
                      Switch to Mock Data
                    </Button>
                  )}
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

      {/* Simple Project Modal for Homepage */}
      {modalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal Content */}
          <div className="relative bg-background-secondary rounded-lg max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Project Content */}
            <div className="flex flex-col">
              {/* Project Image */}
              <div className="relative w-full h-96">
                <Image
                  src={selectedProject.coverImage}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Project Info */}
              <div className="p-6 space-y-4">
                {/* Title and User */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedProject.user.avatar} />
                      <AvatarFallback>{selectedProject.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-bold text-text-primary">{selectedProject.title}</h2>
                      <p className="text-text-secondary">{selectedProject.user.name}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed">{selectedProject.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-6 pt-4 border-t border-border-primary">
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Heart className="w-5 h-5" />
                    <span>{selectedProject.likes}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <MessageCircle className="w-5 h-5" />
                    <span>{selectedProject.comments}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-text-secondary">
                    <Eye className="w-5 h-5" />
                    <span>{selectedProject.views}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}