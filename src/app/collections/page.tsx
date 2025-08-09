import { auth } from '@clerk/nextjs/server'
import { CollectionsGrid } from '@/components/collections/collections-grid'

export default async function CollectionsPage() {
  const { userId, redirectToSignIn } = await auth()
  
  if (!userId) {
    return redirectToSignIn()
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <CollectionsGrid userId={userId} isOwner={true} />
    </div>
  )
}