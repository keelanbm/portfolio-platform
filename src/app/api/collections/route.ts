import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

// GET /api/collections - Get user's collections
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userIdParam = searchParams.get('userId')
    const includePrivate = searchParams.get('includePrivate') === 'true'

    // If requesting another user's collections, only show public ones
    const targetUserId = userIdParam || userId
    const canViewPrivate = targetUserId === userId && includePrivate

    const collections = await prisma.collection.findMany({
      where: {
        userId: targetUserId,
        ...(canViewPrivate ? {} : { isPublic: true })
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
        collectionProjects: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
                coverImageUrl: true,
                createdAt: true,
              }
            }
          },
          orderBy: { addedAt: 'desc' },
          take: 4 // Preview first 4 projects
        },
        _count: {
          select: {
            collectionProjects: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ 
      success: true, 
      collections: collections.map(collection => ({
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isPublic: collection.isPublic,
        coverImageUrl: collection.coverImageUrl,
        projectCount: collection._count.collectionProjects,
        previewProjects: collection.collectionProjects.map(cp => cp.project),
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt,
        user: collection.user
      }))
    })
  } catch (error) {
    console.error('Error fetching collections:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/collections - Create new collection
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { name, description, isPublic = true } = await request.json()

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

    // Create collection
    const collection = await prisma.collection.create({
      data: {
        userId,
        name: name.trim(),
        description: description?.trim() || null,
        isPublic
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
        previewProjects: [],
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

    console.error('Error creating collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}