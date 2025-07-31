import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { ProjectDisplay } from '@/components/project/project-display'
import { ProjectDisplaySkeleton } from '@/components/project/project-display-skeleton'
import { prisma } from '@/lib/prisma'

interface ProjectPageProps {
  params: { projectId: string }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = params

  // Check if project exists
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      slides: {
        orderBy: { slideOrder: 'asc' },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  })

  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <Suspense fallback={<ProjectDisplaySkeleton />}>
          <ProjectDisplay project={project} />
        </Suspense>
      </div>
    </div>
  )
} 