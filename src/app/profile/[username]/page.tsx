import { Suspense } from 'react'
import { UserProfile } from '@/components/profile/user-profile'
import { UserProfileSkeleton } from '@/components/profile/user-profile-skeleton'
import { notFound } from 'next/navigation'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params

  if (!username) {
    notFound()
  }

  return (
    <div className="w-full px-8 py-8">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile username={username} />
      </Suspense>
    </div>
  )
} 