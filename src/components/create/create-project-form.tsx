'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageUpload } from './image-upload'
import { TagSelector } from './tag-selector'
import { ProjectPreview } from './project-preview'
import { CONSTRAINTS, DIMENSIONS } from '@/lib/constants'
import { useUser } from '@clerk/nextjs'

interface ProjectData {
  title: string
  description: string
  tags: string[]
  images: File[]
  coverImageIndex: number
}

export function CreateProjectForm() {
  const { user } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    description: '',
    tags: [],
    images: [],
    coverImageIndex: 0,
  })

  const userTier = user?.publicMetadata?.subscriptionTier || 'free'
  const constraints = CONSTRAINTS[userTier as keyof typeof CONSTRAINTS]

  const handleImageUpload = (files: File[]) => {
    setProjectData(prev => ({
      ...prev,
      images: files,
      coverImageIndex: 0,
    }))
  }

  const handleCoverImageSelect = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      coverImageIndex: index,
    }))
  }

  const handleTagChange = (tags: string[]) => {
    setProjectData(prev => ({
      ...prev,
      tags,
    }))
  }

  const handleSubmit = async () => {
    if (!user) return

    if (!canSubmit()) {
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('title', projectData.title)
      formData.append('description', projectData.description)
      formData.append('tags', JSON.stringify(projectData.tags))
      formData.append('coverImageIndex', projectData.coverImageIndex.toString())
      
      projectData.images.forEach((image) => {
        formData.append(`images`, image)
      })

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to create project')
      }

      const result = await response.json()
      router.push(`/project/${result.project.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      // TODO: Show error toast
    } finally {
      setIsSubmitting(false)
    }
  }

  const canSubmit = () => {
    return (
      projectData.images.length > 0 &&
      projectData.title.trim().length > 0 &&
      projectData.tags.length > 0
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Form */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Create New Project</h2>
          <p className="text-text-secondary">
            Share your creative work with the community
          </p>
        </div>

        {/* Image Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-text-primary">Upload Images</CardTitle>
            <p className="text-sm text-text-secondary">
              Upload up to {constraints.slidesPerProject} images for your project.
              Recommended size: {DIMENSIONS.recommendedRatio} ({DIMENSIONS.minWidth}x{DIMENSIONS.minHeight} minimum)
            </p>
          </CardHeader>
          <CardContent>
            <ImageUpload
              onUpload={handleImageUpload}
              maxFiles={constraints.slidesPerProject}
              maxFileSize={constraints.maxFileSize}
              acceptedTypes={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']}
              coverImageIndex={projectData.coverImageIndex}
              onCoverImageSelect={handleCoverImageSelect}
            />
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-text-primary">Project Details</CardTitle>
            <p className="text-sm text-text-secondary">
              Tell us about your project
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                value={projectData.title}
                onChange={(e) => setProjectData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter your project title"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={projectData.description}
                onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your project, inspiration, and process..."
                className="mt-1"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-text-primary">Add Tags</CardTitle>
            <p className="text-sm text-text-secondary">
              Help others discover your work with relevant tags
            </p>
          </CardHeader>
          <CardContent>
            <TagSelector
              selectedTags={projectData.tags}
              onChange={handleTagChange}
            />
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!canSubmit() || isSubmitting}
          size="lg"
          className="w-full"
        >
          {isSubmitting ? 'Creating Project...' : 'Create Project'}
        </Button>
      </div>

      {/* Right Column - Preview */}
      <div className="lg:sticky lg:top-8 lg:h-fit">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Preview</h3>
          <p className="text-sm text-text-secondary">How your project will appear</p>
        </div>
        
        <ProjectPreview projectData={projectData} user={user} />
      </div>
    </div>
  )
} 