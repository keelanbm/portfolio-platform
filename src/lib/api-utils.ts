import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Standardized API response types
export interface ApiSuccessResponse<T = unknown> {
  success: true
  data: T
}

export interface ApiErrorResponse {
  success: false
  error: string
  details?: string
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

// Standardized error handling wrapper
export async function withApiErrorHandling<T>(
  handler: () => Promise<T>
): Promise<NextResponse> {
  try {
    const result = await handler()
    return NextResponse.json({
      success: true,
      data: result
    } as ApiSuccessResponse<T>)
  } catch (error) {
    console.error('API Error:', error)
    
    // Handle specific error types
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Internal server error',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        } as ApiErrorResponse,
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: 'Unknown error occurred'
      } as ApiErrorResponse,
      { status: 500 }
    )
  }
}

// Authentication helper
export async function withAuth<T>(
  handler: (userId: string) => Promise<T>
): Promise<T> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Authentication required')
  }
  
  return handler(userId)
}

// Combined auth + error handling
export async function withAuthenticatedApiHandler<T>(
  handler: (userId: string) => Promise<T>
): Promise<NextResponse> {
  return withApiErrorHandling(async () => {
    return withAuth(handler)
  })
}

// Pagination helper
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export function parsePaginationParams(searchParams: URLSearchParams): {
  limit: number
  offset: number
  page: number
} {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // Cap at 100
  const offset = parseInt(searchParams.get('offset') || '0') || (page - 1) * limit
  
  return { limit, offset, page }
}

// Request validation helper
export function validateRequiredFields<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  const missingFields = requiredFields.filter(field => 
    data[field] === undefined || data[field] === null || data[field] === ''
  )
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }
}