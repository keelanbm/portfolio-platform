import { Suspense } from 'react'
import { CreateProjectForm } from '@/components/create/create-project-form'
import { CreateProjectSkeleton } from '@/components/create/create-project-skeleton'

export default function CreateProjectPage() {
  return (
    <div className="w-full px-8 py-8">
      <Suspense fallback={<CreateProjectSkeleton />}>
        <CreateProjectForm />
      </Suspense>
    </div>
  )
} 