'use client'

import { useState, useEffect, useCallback } from 'react'
import { CollectionCard } from './collection-card'
import { CreateCollectionDialog } from './create-collection-dialog'
import { EditCollectionDialog } from './edit-collection-dialog'
import { Button } from '@/components/ui/button'
import { Plus, FolderOpen } from 'lucide-react'
import { showToast } from '@/lib/toast'

interface Collection {
  id: string
  name: string
  description?: string
  isPublic: boolean
  coverImageUrl?: string
  projectCount: number
  previewProjects: Array<{
    id: string
    title: string
    coverImageUrl: string
  }>
  createdAt: string
  updatedAt: string
  user: {
    id: string
    username: string
    displayName?: string
    avatarUrl?: string
  }
}

interface CollectionsGridProps {
  userId?: string // If provided, shows collections for specific user
  isOwner?: boolean // If true, shows create/edit/delete actions
}

export function CollectionsGrid({ userId, isOwner = false }: CollectionsGridProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)

  const fetchCollections = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (userId) params.append('userId', userId)
      if (isOwner) params.append('includePrivate', 'true')

      const response = await fetch(`/api/collections?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch collections')
      }

      setCollections(data.collections)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error fetching collections:', error)
      showToast.error(error.message || 'Failed to load collections')
    } finally {
      setIsLoading(false)
    }
  }, [userId, isOwner])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  const handleCreateSuccess = (newCollection: Collection) => {
    setCollections(prev => [newCollection, ...prev])
  }

  const handleEditSuccess = (updatedCollection: Collection) => {
    setCollections(prev => 
      prev.map(collection => 
        collection.id === updatedCollection.id ? updatedCollection : collection
      )
    )
    setEditingCollection(null)
  }

  const handleDelete = (collectionId: string) => {
    setCollections(prev => prev.filter(collection => collection.id !== collectionId))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {isOwner && (
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Collections</h2>
              <p className="text-muted-foreground">Organize your projects into themed collections</p>
            </div>
            <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/3] bg-muted animate-pulse rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
                <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">
            {isOwner ? 'Your Collections' : 'Collections'}
          </h2>
          <p className="text-muted-foreground">
            {isOwner 
              ? 'Organize your projects into themed collections' 
              : 'Curated project collections'
            }
          </p>
        </div>
        
        {isOwner && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        )}
      </div>

      {/* Collections Grid */}
      {collections.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isOwner ? 'No collections yet' : 'No collections found'}
          </h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {isOwner 
              ? 'Create your first collection to organize your projects by theme, client, or category.'
              : 'This user hasn\'t created any public collections yet.'
            }
          </p>
          {isOwner && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Collection
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              isOwner={isOwner}
              onEdit={setEditingCollection}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCreateSuccess}
      />
      
      <EditCollectionDialog
        collection={editingCollection}
        open={!!editingCollection}
        onOpenChange={(open) => !open && setEditingCollection(null)}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}