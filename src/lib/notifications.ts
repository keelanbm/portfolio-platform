import { prisma } from '@/lib/prisma'

export interface CreateNotificationParams {
  userId: string
  type: string
  title: string
  message: string
  actionUrl?: string
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        actionUrl: params.actionUrl,
      },
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

export async function createNotifications(notifications: CreateNotificationParams[]) {
  try {
    const result = await prisma.notification.createMany({
      data: notifications,
      skipDuplicates: true,
    })
    return result
  } catch (error) {
    console.error('Error creating notifications:', error)
    return null
  }
}

// Notification template functions
export const NotificationTemplates = {
  projectLiked: (likerName: string, projectTitle: string, projectId: string) => ({
    type: 'PROJECT_LIKE',
    title: `${likerName} liked your project`,
    message: `${likerName} liked "${projectTitle}"`,
    actionUrl: `/project/${projectId}`,
  }),

  projectCommented: (commenterName: string, projectTitle: string, projectId: string) => ({
    type: 'PROJECT_COMMENT',
    title: `${commenterName} commented on your project`,
    message: `${commenterName} commented on "${projectTitle}"`,
    actionUrl: `/project/${projectId}`,
  }),

  projectSaved: (saverName: string, projectTitle: string, projectId: string) => ({
    type: 'PROJECT_SAVE',
    title: `${saverName} saved your project`,
    message: `${saverName} saved "${projectTitle}"`,
    actionUrl: `/project/${projectId}`,
  }),

  userFollowed: (followerName: string, followerUsername: string) => ({
    type: 'NEW_FOLLOWER',
    title: `${followerName} started following you`,
    message: `${followerName} is now following your work`,
    actionUrl: `/profile/${followerUsername}`,
  }),

  commentReply: (replierName: string, projectTitle: string, projectId: string) => ({
    type: 'COMMENT_REPLY',
    title: `${replierName} replied to your comment`,
    message: `${replierName} replied to your comment on "${projectTitle}"`,
    actionUrl: `/project/${projectId}`,
  }),

  commentLiked: (likerName: string, projectTitle: string, projectId: string) => ({
    type: 'COMMENT_LIKE',
    title: `${likerName} liked your comment`,
    message: `${likerName} liked your comment on "${projectTitle}"`,
    actionUrl: `/project/${projectId}`,
  }),

  // Milestone notifications
  firstProjectLike: (projectTitle: string, projectId: string) => ({
    type: 'MILESTONE',
    title: '🎉 First like!',
    message: `Your project "${projectTitle}" received its first like!`,
    actionUrl: `/project/${projectId}`,
  }),

  projectPopular: (projectTitle: string, likeCount: number, projectId: string) => ({
    type: 'MILESTONE',
    title: '🔥 Your project is trending!',
    message: `"${projectTitle}" has reached ${likeCount} likes!`,
    actionUrl: `/project/${projectId}`,
  }),

  newFollowerMilestone: (followerCount: number, username: string) => ({
    type: 'MILESTONE',
    title: '🌟 Follower milestone!',
    message: `You've reached ${followerCount} followers! Keep creating amazing work.`,
    actionUrl: `/profile/${username}`,
  }),
}

// Helper function to get user info by ID
export async function getUserInfo(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        displayName: true,
      },
    })
    return user
  } catch (error) {
    console.error('Error fetching user info:', error)
    return null
  }
}

// Helper function to get project info by ID
export async function getProjectInfo(projectId: string) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
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
    return project
  } catch (error) {
    console.error('Error fetching project info:', error)
    return null
  }
}

// Clean up old notifications (optional - for maintenance)
export async function cleanupOldNotifications(daysOld = 30) {
  try {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: {
          lt: cutoffDate,
        },
        isRead: true, // Only delete read notifications
      },
    })

    console.log(`Cleaned up ${result.count} old notifications`)
    return result
  } catch (error) {
    console.error('Error cleaning up notifications:', error)
    return null
  }
}