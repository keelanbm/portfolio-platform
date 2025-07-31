import { NextRequest, NextResponse } from 'next/server'

export async function POST(_request: NextRequest) {
  // TODO: Implement webhook verification when svix types are resolved
  // Force new deployment - build is working locally
  return NextResponse.json({ message: 'Webhook endpoint - implementation pending' })
} 