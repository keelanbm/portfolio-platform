'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ArrowLeft, Globe, Lock, MoreHorizontal, Edit, Trash2, Heart, MessageCircle, Calendar, FolderOpen } from 'lucide-react'
import { EditCollectionDialog } from './edit-collection-dialog'
import { showToast } from '@/lib/toast'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  title: string
  description?: string
  coverImageUrl: string
  likeCount: number
  commentCount: number
  createdAt: string
  addedAt: string
  user: {
    id: string
    username: string
    displayName?: string
    avatarUrl?: string
  }
  slides: Array<{
    id: string
    imageUrl: string
    slideOrder: number
  }>
}

interface Collection {
  id: string
  name: string
  description?: string
  isPublic: boolean
  coverImageUrl?: string
  projectCount: number
  isOwner: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    username: string
    displayName?: string
    avatarUrl?: string
  }
  projects: Project[]
}

interface CollectionDetailProps {
  collection: Collection
  currentUserId?: string
}

export function CollectionDetail({ collection }: CollectionDetailProps) {
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

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
      router.push('/collections')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error deleting collection:', error)
      showToast.error(error.message || 'Failed to delete collection')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditSuccess = () => {
    // Refresh the page to get updated data
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" asChild>
        <Link href="/collections">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Link>
      </Button>

      {/* Collection Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{collection.name}</h1>
              <Badge variant={collection.isPublic ? "secondary" : "outline"}>
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
            
            {collection.description && (
              <p className="text-muted-foreground text-lg max-w-2xl">
                {collection.description}
              </p>
            )}
          </div>

          {/* Actions for owner */}
          {collection.isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingCollection(collection)}>
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
          )}
        </div>

        {/* Collection meta */}
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={collection.user.avatarUrl} />
              <AvatarFallback>
                {(collection.user.displayName || collection.user.username || 'U')[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>By {collection.user.displayName || collection.user.username}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <FolderOpen className="h-4 w-4" />
            <span>{collection.projectCount} {collection.projectCount === 1 ? 'project' : 'projects'}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Updated {new Date(collection.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {collection.projects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects in this collection</h3>
          <p className="text-muted-foreground">
            {collection.isOwner ? 'Add some projects to get started.' : 'This collection is empty.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            Projects ({collection.projectCount})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collection.projects.map((project) => (
              <Card key={project.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={project.coverImageUrl}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <Link href={`/project/${project.id}`} className="absolute inset-0" />
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <Link href={`/project/${project.id}`} className="block group">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                          {project.title}
                        </h3>
                      </Link>
                      
                      {project.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {project.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={project.user.avatarUrl} />
                          <AvatarFallback>
                            {(project.user.displayName || project.user.username || 'U')[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Link 
                          href={`/profile/${project.user.username}`}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {project.user.displayName || project.user.username}
                        </Link>
                      </div>
                      
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{project.likeCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{project.commentCount}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Added {new Date(project.addedAt).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <EditCollectionDialog
        collection={editingCollection}
        open={!!editingCollection}
        onOpenChange={(open) => !open && setEditingCollection(null)}
        onSuccess={handleEditSuccess}
      />
    </div>
  )
}