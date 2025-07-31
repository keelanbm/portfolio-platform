import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { projectId } = params

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Check if user already liked the project
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json(
        { error: 'Project already liked' },
        { status: 409 }
      )
    }

    // Create like
    const like = await prisma.like.create({
      data: {
        userId: userId,
        projectId: projectId,
      },
    })

    // Update project like count
    await prisma.project.update({
      where: { id: projectId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({
      success: true,
      like,
    })
  } catch (error) {
    console.error('Error liking project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { projectId } = params

    // Delete like
    const deletedLike = await prisma.like.delete({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectId,
        },
      },
    })

    // Update project like count
    await prisma.project.update({
      where: { id: projectId },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    })

    return NextResponse.json({
      success: true,
      deletedLike,
    })
  } catch (error) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Like not found' },
        { status: 404 }
      )
    }

    console.error('Error unliking project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 