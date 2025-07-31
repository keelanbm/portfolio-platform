import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { CONSTRAINTS } from '@/lib/constants'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const tags = JSON.parse(formData.get('tags') as string) as string[]
    const coverImageIndex = parseInt(formData.get('coverImageIndex') as string)
    const images = formData.getAll('images') as File[]

    // Validation
    if (!title || !images || images.length === 0) {
      return NextResponse.json(
        { error: 'Title and at least one image are required' },
        { status: 400 }
      )
    }

    // Get user's subscription tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true }
    })

    const userTier = user?.subscriptionTier || 'FREE'
    const constraints = CONSTRAINTS[userTier.toLowerCase() as keyof typeof CONSTRAINTS]

    // Validate file count
    if (images.length > constraints.slidesPerProject) {
      return NextResponse.json(
        { error: `Maximum ${constraints.slidesPerProject} images allowed for ${userTier} tier` },
        { status: 400 }
      )
    }

    // Validate total file size
    const totalSize = images.reduce((sum, file) => sum + file.size, 0)
    if (totalSize > constraints.maxTotalSize) {
      return NextResponse.json(
        { error: `Total file size exceeds ${constraints.maxTotalSize / (1024 * 1024)}MB limit` },
        { status: 400 }
      )
    }

    // Upload images to Supabase Storage
    const uploadedUrls: string[] = []
    const projectId = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    for (let i = 0; i < images.length; i++) {
      const file = images[i]
      const fileName = `${projectId}/slide_${i + 1}.${file.name.split('.').pop()}`
      
      const { data, error } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        )
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('project-images')
        .getPublicUrl(fileName)

      uploadedUrls.push(urlData.publicUrl)
    }

    // Create project in database
    const project = await prisma.project.create({
      data: {
        userId: userId,
        title: title,
        description: description || '',
        coverImageUrl: uploadedUrls[coverImageIndex] || uploadedUrls[0],
        tags: tags,
        slideCount: images.length,
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
      },
    })

    // Create project slides
    const slides = await Promise.all(
      uploadedUrls.map((url, index) =>
        prisma.projectSlide.create({
          data: {
            projectId: project.id,
            imageUrl: url,
            slideOrder: index + 1,
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        description: project.description,
        coverImage: project.coverImageUrl,
        images: uploadedUrls,
        tags: project.tags,
        createdAt: project.createdAt.toISOString(),
        user: {
          id: project.user.id,
          username: project.user.username,
          name: project.user.displayName || project.user.username,
          avatar: project.user.avatarUrl,
        },
      },
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 