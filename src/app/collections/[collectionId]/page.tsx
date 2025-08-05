import { notFound } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { CollectionDetail } from '@/components/collections/collection-detail'

interface CollectionPageProps {
  params: Promise<{ collectionId: string }>
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collectionId } = await params
  const { userId } = await auth()

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/collections/${collectionId}`, {
      headers: {
        'Content-Type': 'application/json',
        // Include user context for permission checking
        ...(userId && { 'x-user-id': userId })
      },
      cache: 'no-store' // Always fetch fresh data for collections
    })

    if (!response.ok) {
      if (response.status === 404) {
        notFound()
      }
      throw new Error('Failed to fetch collection')
    }

    const { collection } = await response.json()

    return (
      <div className="container mx-auto px-6 py-8">
        <CollectionDetail collection={collection} />
      </div>
    )
  } catch (error) {
    console.error('Error loading collection:', error)
    notFound()
  }
}