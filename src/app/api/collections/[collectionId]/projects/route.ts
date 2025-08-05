import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ collectionId: string }>
}

// POST /api/collections/[collectionId]/projects - Add project to collection
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { collectionId } = await params
    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Check if collection exists and user owns it
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { userId: true, name: true }
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    if (collection.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Check if project exists and user owns it
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { userId: true, title: true, coverImageUrl: true }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    if (project.userId !== userId) {
      return NextResponse.json(
        { error: 'You can only add your own projects to collections' },
        { status: 403 }
      )
    }

    // Add project to collection
    const collectionProject = await prisma.collectionProject.create({
      data: {
        collectionId,
        projectId
      }
    })

    // Update collection's project count and potentially set cover image
    const projectCount = await prisma.collectionProject.count({
      where: { collectionId }
    })

    // If this is the first project and collection has no cover image, use project's cover
    const updateData: { projectCount: number; coverImageUrl?: string } = {
      projectCount
    }

    const currentCollection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { coverImageUrl: true }
    })

    if (!currentCollection?.coverImageUrl && project.coverImageUrl) {
      updateData.coverImageUrl = project.coverImageUrl
    }

    await prisma.collection.update({
      where: { id: collectionId },
      data: updateData
    })

    return NextResponse.json({
      success: true,
      message: `"${project.title}" added to "${collection.name}"`,
      collectionProject
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Project is already in this collection' },
        { status: 409 }
      )
    }

    console.error('Error adding project to collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/collections/[collectionId]/projects - Remove project from collection
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
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    // Check if collection exists and user owns it
    const collection = await prisma.collection.findUnique({
      where: { id: collectionId },
      select: { userId: true, name: true, coverImageUrl: true }
    })

    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      )
    }

    if (collection.userId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Get project info before removal
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { title: true, coverImageUrl: true }
    })

    // Remove project from collection
    const deletedRelation = await prisma.collectionProject.delete({
      where: {
        collectionId_projectId: {
          collectionId,
          projectId
        }
      }
    })

    // Update collection's project count
    const projectCount = await prisma.collectionProject.count({
      where: { collectionId }
    })

    // If we removed the project that was used as cover image, update cover
    let newCoverImageUrl = collection.coverImageUrl
    if (collection.coverImageUrl === project?.coverImageUrl) {
      // Get the most recent project in the collection as new cover
      const latestProject = await prisma.collectionProject.findFirst({
        where: { collectionId },
        include: {
          project: {
            select: { coverImageUrl: true }
          }
        },
        orderBy: { addedAt: 'desc' }
      })
      
      newCoverImageUrl = latestProject?.project.coverImageUrl || null
    }

    await prisma.collection.update({
      where: { id: collectionId },
      data: {
        projectCount,
        coverImageUrl: newCoverImageUrl
      }
    })

    return NextResponse.json({
      success: true,
      message: project ? `"${project.title}" removed from "${collection.name}"` : 'Project removed from collection',
      deletedRelation
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Project not found in this collection' },
        { status: 404 }
      )
    }

    console.error('Error removing project from collection:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}