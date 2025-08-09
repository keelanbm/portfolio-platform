import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { notifyProjectLike, notifyFirstLike, notifyProjectPopular } from '@/utils/notifications'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { projectId } = await params

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { 
        id: true, 
        title: true, 
        userId: true,
        likeCount: true,
        user: {
          select: {
            username: true,
            displayName: true,
          },
        },
      }
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
          userId,
          projectId,
        },
      },
    })

    if (existingLike) {
      // Unlike the project
      await prisma.like.delete({
        where: {
          userId_projectId: {
            userId,
            projectId,
          },
        },
      })

      // Decrease like count
      await prisma.project.update({
        where: { id: projectId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      })

      return NextResponse.json({ liked: false })
    } else {
      // Like the project
      await prisma.like.create({
        data: {
          userId,
          projectId,
        },
      })

      // Increase like count and get the updated count
      const updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
        select: {
          likeCount: true,
        },
      })

      // Get liker info for notification
      const liker = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, displayName: true },
      })

      // Send notification to project owner (only if they're not liking their own project)
      if (project.userId !== userId && liker) {
        const likerName = liker.displayName || liker.username || 'Someone'
        
        // Regular like notification
        await notifyProjectLike({
          projectOwnerId: project.userId,
          likerName,
          projectTitle: project.title,
          projectId: project.id,
        })

        // Milestone notifications
        if (updatedProject.likeCount === 1) {
          // First like milestone
          await notifyFirstLike({
            projectOwnerId: project.userId,
            projectTitle: project.title,
            projectId: project.id,
          })
        } else {
          // Popular project milestones (10, 25, 50, 100, etc.)
          await notifyProjectPopular({
            projectOwnerId: project.userId,
            projectTitle: project.title,
            projectId: project.id,
            likeCount: updatedProject.likeCount,
          })
        }
      }

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { projectId } = await params

    // Check if user liked the project
    const like = await prisma.like.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId,
        },
      },
    })

    return NextResponse.json({ liked: !!like })
  } catch (error) {
    console.error('Error checking like status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 