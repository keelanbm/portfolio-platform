import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`
    
    // Test user count
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        currentTime: Array.isArray(result) ? result[0] : result,
        userCount
      }
    })
  } catch (error) {
    console.error('Database test failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 