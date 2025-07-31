import { NextResponse } from 'next/server'

export async function POST() {
  // TODO: Implement webhook verification when svix types are resolved
  // Force new deployment - build is working locally
  return NextResponse.json({ message: 'Webhook endpoint - implementation pending' })
} 