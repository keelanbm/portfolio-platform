import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CollectionsGrid } from '@/components/collections/collections-grid'

export default async function CollectionsPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <CollectionsGrid userId={userId} isOwner={true} />
    </div>
  )
}