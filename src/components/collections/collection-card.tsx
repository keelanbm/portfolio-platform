'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Lock, Globe, Edit, Trash2, Eye } from 'lucide-react'
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

interface CollectionCardProps {
  collection: Collection
  isOwner?: boolean
  onEdit?: (collection: Collection) => void
  onDelete?: (collectionId: string) => void
}

export function CollectionCard({ collection, isOwner = false, onEdit, onDelete }: CollectionCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${collection.name}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/collections/${collection.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete collection')
      }

      showToast.success('Collection deleted successfully')
      onDelete?.(collection.id)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error deleting collection:', error)
      showToast.error(error.message || 'Failed to delete collection')
    } finally {
      setIsDeleting(false)
    }
  }

  const coverImage = collection.coverImageUrl || collection.previewProjects[0]?.coverImageUrl

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-[4/3] bg-muted">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={collection.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No projects yet</p>
            </div>
          </div>
        )}
        
        {/* Privacy indicator */}
        <div className="absolute top-2 left-2">
          <Badge variant={collection.isPublic ? "secondary" : "outline"} className="text-xs">
            {collection.isPublic ? (
              <>
                <Globe className="h-3 w-3 mr-1" />
                Public
              </>
            ) : (
              <>
                <Lock className="h-3 w-3 mr-1" />
                Private
              </>
            )}
          </Badge>
        </div>

        {/* Actions menu for owner */}
        {isOwner && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="secondary" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(collection)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Collection
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete Collection'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {/* Project count overlay */}
        {collection.projectCount > 0 && (
          <div className="absolute bottom-2 right-2">
            <Badge variant="secondary" className="text-xs">
              {collection.projectCount} {collection.projectCount === 1 ? 'project' : 'projects'}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/collections/${collection.id}`} className="block group">
            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
              {collection.name}
            </h3>
          </Link>
          
          {collection.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {collection.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>By {collection.user.displayName || collection.user.username}</span>
            <span>
              Updated {new Date(collection.updatedAt).toLocaleDateString()}
            </span>
          </div>

          {/* Preview projects */}
          {collection.previewProjects.length > 1 && (
            <div className="flex gap-1 mt-3">
              {collection.previewProjects.slice(0, 4).map((project) => (
                <div key={project.id} className="relative aspect-square flex-1 rounded overflow-hidden">
                  <Image
                    src={project.coverImageUrl}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 100px"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}