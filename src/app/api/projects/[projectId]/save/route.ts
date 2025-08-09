import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyProjectSave } from '@/utils/notifications'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId } = await params
    
    // Check if project exists and get project details for notification
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        title: true,
        userId: true,
        user: {
          select: {
            username: true,
            displayName: true,
          },
        },
      },
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if save already exists
    const existingSave = await prisma.save.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      }
    })

    if (existingSave) {
      // Remove save (unsave)
      await prisma.save.delete({
        where: {
          id: existingSave.id
        }
      })

      return NextResponse.json({ 
        success: true,
        saved: false,
        message: 'Project removed from saves'
      })
    } else {
      // Add save
      await prisma.save.create({
        data: {
          userId,
          projectId
        }
      })

      // Get saver info for notification
      const saver = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true, displayName: true },
      })

      // Send notification to project owner (only if they're not saving their own project)
      if (project.userId !== userId && saver) {
        await notifyProjectSave({
          projectOwnerId: project.userId,
          saverName: saver.displayName || saver.username || 'Someone',
          projectTitle: project.title,
          projectId: project.id,
        })
      }

      return NextResponse.json({ 
        success: true,
        saved: true,
        message: 'Project saved successfully'
      })
    }
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Save toggle error:', error)
    return NextResponse.json(
      { error: 'Failed to toggle save' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ saved: false })
    }

    const { projectId } = await params

    const save = await prisma.save.findUnique({
      where: {
        userId_projectId: {
          userId,
          projectId
        }
      }
    })

    return NextResponse.json({ saved: !!save })
  } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error('Check save status error:', error)
    return NextResponse.json({ saved: false })
  }
}