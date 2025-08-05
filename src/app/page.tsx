'use client'

import { useState } from 'react'
import { ProjectCard } from '@/components/ui/project-card'
import { HeroSection } from '@/components/homepage/hero-section'
import { CategoryFilterBar } from '@/components/homepage/category-filter-bar'
import { HOMEPAGE_PROJECTS } from '@/data/homepage-projects'
import { TrendingUp, Users, Award } from 'lucide-react'

export default function HomePage() {
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Filter projects based on selected tags
  const filteredProjects = selectedTags.length === 0 
    ? HOMEPAGE_PROJECTS 
    : HOMEPAGE_PROJECTS.filter(project => 
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

  // Mock modal handler (would open project modal in real implementation)
  const handleOpenModal = (projectId: string) => {
    console.log('Open project modal:', projectId)
  }

  return (
    <div className="w-full">
      {/* Compact Hero Section */}
      <HeroSection />

      {/* Sticky Category Filter Bar */}
      <CategoryFilterBar 
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
      />

      {/* Main Project Showcase - The Hero Content */}
      <section className="px-8 py-12 bg-background-primary min-h-screen">
        <div className="max-w-7xl mx-auto">
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
          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold mb-3 text-text-primary">No projects found</h3>
              <p className="text-text-secondary mb-6">
                Try selecting a different category to see more amazing work.
              </p>
            </div>
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
    </div>
  )
}