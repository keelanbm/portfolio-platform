'use client'

import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Search, FolderOpen } from 'lucide-react'
import { showToast } from '@/lib/toast'

interface Collection {
  id: string
  name: string
  description?: string
  isPublic: boolean
  projectCount: number
}

interface AddToCollectionDialogProps {
  projectId: string | null
  projectTitle?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddToCollectionDialog({ 
  projectId, 
  projectTitle, 
  open, 
  onOpenChange, 
  onSuccess 
}: AddToCollectionDialogProps) {
  const [collections, setCollections] = useState<Collection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [addingToCollection, setAddingToCollection] = useState<string | null>(null)

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const fetchCollections = useCallback(async () => {
    if (!open) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/collections?includePrivate=true')
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
  }, [open])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  const handleAddToCollection = async (collectionId: string) => {
    if (!projectId) return

    setAddingToCollection(collectionId)

    try {
      const response = await fetch(`/api/collections/${collectionId}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add project to collection')
      }

      showToast.success(data.message || 'Project added to collection')
      onSuccess?.()
      onOpenChange(false)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error adding project to collection:', error)
      showToast.error(error.message || 'Failed to add project to collection')
    } finally {
      setAddingToCollection(null)
    }
  }

  const handleClose = () => {
    setSearchQuery('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          {projectTitle && (
            <p className="text-sm text-muted-foreground">
              Add &ldquo;{projectTitle}&rdquo; to a collection
            </p>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Collections List */}
          <div className="max-h-80 overflow-y-auto space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : filteredCollections.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No collections found' : 'No collections yet'}
                </p>
                {!searchQuery && (
                  <Button 
                    variant="link" 
                    className="mt-2 p-0 h-auto"
                    onClick={() => {
                      // This would open the create collection dialog
                      // For now, we'll just suggest creating one
                      handleClose()
                      showToast.info('Create a collection first from the Collections page')
                    }}
                  >
                    Create your first collection
                  </Button>
                )}
              </div>
            ) : (
              filteredCollections.map((collection) => (
                <Card key={collection.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{collection.name}</h4>
                          <Badge variant={collection.isPublic ? "secondary" : "outline"} className="text-xs">
                            {collection.isPublic ? 'Public' : 'Private'}
                          </Badge>
                        </div>
                        {collection.description && (
                          <p className="text-xs text-muted-foreground truncate mb-1">
                            {collection.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {collection.projectCount} {collection.projectCount === 1 ? 'project' : 'projects'}
                        </p>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={() => handleAddToCollection(collection.id)}
                        disabled={addingToCollection === collection.id}
                        className="ml-3"
                      >
                        {addingToCollection === collection.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}