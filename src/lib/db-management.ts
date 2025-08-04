// Database management utilities for development

import { prisma } from './prisma'

export class DatabaseManager {
  // Health check - simple and clean
  static async healthCheck(): Promise<{ healthy: boolean; error?: string }> {
    try {
      await prisma.$queryRaw`SELECT 1`
      return { healthy: true }
    } catch (error) {
      return { 
        healthy: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Clean restart (development only)
  static async cleanRestart(): Promise<void> {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('Clean restart only available in development')
    }

    try {
      // Disconnect existing connections
      await prisma.$disconnect()
      
      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Reconnect
      await prisma.$connect()
      
      console.log('✅ Database connection reset successfully')
    } catch (error) {
      console.error('❌ Failed to reset database connection:', error)
      throw error
    }
  }

  // Get basic stats - simple and clean
  static async getStats(): Promise<{
    users: number
    projects: number
    comments: number
    notifications?: number
  }> {
    try {
      const users = await prisma.user.count()
      const projects = await prisma.project.count()
      const comments = await prisma.comment.count()

      const stats = { users, projects, comments } as {
        users: number
        projects: number
        comments: number
        notifications?: number
      }

      // Only get notification count if table exists
      try {
        stats.notifications = await prisma.notification.count()
      } catch {
        // Notifications table might not exist yet
      }

      return stats
    } catch (error) {
      console.error('Failed to get database stats:', error)
      // Return default stats instead of throwing
      return {
        users: 0,
        projects: 0,
        comments: 0,
      }
    }
  }
}