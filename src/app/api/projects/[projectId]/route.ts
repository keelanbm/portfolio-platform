import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const { userId } = await auth()

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        isPublic: true, // Only return public projects
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        slides: {
          orderBy: {
            slideOrder: 'asc',
          },
        },
        likes: userId ? {
          where: {
            userId: userId,
          },
          select: {
            id: true,
          },
        } : false,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await prisma.project.update({
      where: { id: projectId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    // Format the response to match what the modal expects
    const response = {
      id: project.id,
      title: project.title,
      description: project.description,
      coverImage: project.coverImageUrl,
      images: project.slides.map(slide => slide.imageUrl),
      tags: project.tags,
      likes: project._count.likes,
      comments: project._count.comments,
      views: project.viewCount + 1, // Include the just-incremented view
      createdAt: project.createdAt.toISOString(),
      isLiked: userId ? project.likes.length > 0 : false,
      user: {
        id: project.user.id,
        username: project.user.username,
        name: project.user.displayName || project.user.username,
        avatar: project.user.avatarUrl || '',
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}