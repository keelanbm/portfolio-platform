// Helper functions for creating notifications

export async function createNotification({
  userId,
  type,
  title,
  message,
  actionUrl,
}: {
  userId: string
  type: string
  title: string
  message: string
  actionUrl?: string
}) {
  try {
    const response = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        type,
        title,
        message,
        actionUrl,
      }),
    })

    if (!response.ok) {
      console.error('Failed to create notification')
      return null
    }

    return await response.json()
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

// Notification helper for comment replies
export async function notifyCommentReply({
  projectOwnerId,
  commenterName,
  projectTitle,
  projectId,
}: {
  projectOwnerId: string
  commenterName: string
  projectTitle: string
  projectId: string
}) {
  return createNotification({
    userId: projectOwnerId,
    type: 'COMMENT_REPLY',
    title: 'New comment on your project',
    message: `${commenterName} commented on "${projectTitle}"`,
    actionUrl: `/project/${projectId}`,
  })
}

// Notification helper for project likes
export async function notifyProjectLike({
  projectOwnerId,
  likerName,
  projectTitle,
  projectId,
}: {
  projectOwnerId: string
  likerName: string
  projectTitle: string
  projectId: string
}) {
  return createNotification({
    userId: projectOwnerId,
    type: 'PROJECT_LIKE',
    title: 'Your project was liked',
    message: `${likerName} liked your project "${projectTitle}"`,
    actionUrl: `/project/${projectId}`,
  })
}

// Notification helper for new followers
export async function notifyNewFollower({
  userId,
  followerName,
  followerUsername,
}: {
  userId: string
  followerName: string
  followerUsername: string
}) {
  return createNotification({
    userId,
    type: 'NEW_FOLLOWER',
    title: 'New follower',
    message: `${followerName} started following you`,
    actionUrl: `/profile/${followerUsername}`,
  })
}