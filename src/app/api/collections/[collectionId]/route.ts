import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ collectionId: string }>
}

// GET /api/collections/[collectionId] - Get specific collection with projects
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    const { collectionId } = await params

    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        },
        collectionProjects: {
          include: {
            project: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    displayName: true,
                    avatarUrl: true,
                  }
                },
                slides: {
                  orderBy: { slideOrder: 'asc' },
                  take: 1
                },
                _count: {
                  select: {
                    likes: true,
                    comments: true
                  }
                }
              }
            }
          },
          orderBy: { addedAt: 'desc' }
        },
        _count: {
          select: {
            collectionProjects: true
          }
        }
      }
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    // Check permissions - private collections can only be viewed by owner
    if (!collection.isPublic && collection.userId !== userId) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    const formattedCollection = {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isPublic: collection.isPublic,
      coverImageUrl: collection.coverImageUrl,
      projectCount: collection._count.collectionProjects,
      isOwner: collection.userId === userId,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt,
      user: collection.user,
      projects: collection.collectionProjects.map(cp => ({
        id: cp.project.id,
        title: cp.project.title,
        description: cp.project.description,
        coverImageUrl: cp.project.coverImageUrl,
        likeCount: cp.project._count.likes,
        commentCount: cp.project._count.comments,
        createdAt: cp.project.createdAt,
        addedAt: cp.addedAt,
        user: cp.project.user,
        slides: cp.project.slides
      }))
    }

    return NextResponse.json({ 
      success: true, 
      collection: formattedCollection
    })
  } catch (error) {
    console.error('Error fetching collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/collections/[collectionId] - Update collection
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { collectionId } = await params
    const { name, description, isPublic } = await request.json()

    // Check if collection exists and user owns it
    const existingCollection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { userId: true }
    })

    if (!existingCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    if (existingCollection.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Validate name if provided
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Collection name is required' },
          { status: 400 }
        )
      }

      if (name.length > 100) {
        return NextResponse.json(
          { error: 'Collection name must be 100 characters or less' },
          { status: 400 }
        )
      }
    }

    // Update collection
    const collection = await prisma.collection.update({
      where: { id: collectionId },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(isPublic !== undefined && { isPublic })
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          }
        },
        _count: {
          select: {
            collectionProjects: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      collection: {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isPublic: collection.isPublic,
        coverImageUrl: collection.coverImageUrl,
        projectCount: collection._count.collectionProjects,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        user: collection.user
      }
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'You already have a collection with this name' },
        { status: 409 }
      )
    }

    console.error('Error updating collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/collections/[collectionId] - Delete collection
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { collectionId } = await params

    // Check if collection exists and user owns it
    const existingCollection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { userId: true, name: true }
    })

    if (!existingCollection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    if (existingCollection.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete collection (cascade will handle CollectionProject relationships)
    await prisma.collection.delete({
      where: { id: collectionId }
    })

    return NextResponse.json({
      success: true,
      message: `Collection "${existingCollection.name}" deleted successfully`
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    console.error('Error deleting collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}