import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Simple test without dependencies
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      env: {
        DATABASE_URL: process.env.DATABASE_URL ? 'set' : 'missing',
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'set' : 'missing',
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: (error as Error).message
    }, { status: 500 })
  }
}