import { Suspense } from 'react'
import { UserProfile } from '@/components/profile/user-profile'
import { UserProfileSkeleton } from '@/components/profile/user-profile-skeleton'
import { notFound } from 'next/navigation'

interface ProfilePageProps {
  params: { username: string }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params

  if (!username) {
    notFound()
  }

  return (
    <div className="container py-8">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile username={username} />
      </Suspense>
    </div>
  )
} 