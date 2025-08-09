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

// Notification helper for project saves
export async function notifyProjectSave({
  projectOwnerId,
  saverName,
  projectTitle,
  projectId,
}: {
  projectOwnerId: string
  saverName: string
  projectTitle: string
  projectId: string
}) {
  return createNotification({
    userId: projectOwnerId,
    type: 'PROJECT_SAVE',
    title: 'Your project was saved',
    message: `${saverName} saved your project "${projectTitle}"`,
    actionUrl: `/project/${projectId}`,
  })
}

// Notification helper for comment likes
export async function notifyCommentLike({
  commentOwnerId,
  likerName,
  projectTitle,
  projectId,
}: {
  commentOwnerId: string
  likerName: string
  projectTitle: string
  projectId: string
}) {
  return createNotification({
    userId: commentOwnerId,
    type: 'COMMENT_LIKE',
    title: 'Your comment was liked',
    message: `${likerName} liked your comment on "${projectTitle}"`,
    actionUrl: `/project/${projectId}`,
  })
}

// Notification helper for mentions in comments
export async function notifyMention({
  mentionedUserId,
  mentionerName,
  projectTitle,
  projectId,
  context = 'comment',
}: {
  mentionedUserId: string
  mentionerName: string
  projectTitle: string
  projectId: string
  context?: 'comment' | 'project'
}) {
  return createNotification({
    userId: mentionedUserId,
    type: 'MENTION',
    title: 'You were mentioned',
    message: `${mentionerName} mentioned you in a ${context} on "${projectTitle}"`,
    actionUrl: `/project/${projectId}`,
  })
}

// Milestone notifications
export async function notifyFirstLike({
  projectOwnerId,
  projectTitle,
  projectId,
}: {
  projectOwnerId: string
  projectTitle: string
  projectId: string
}) {
  return createNotification({
    userId: projectOwnerId,
    type: 'MILESTONE',
    title: '🎉 First like!',
    message: `Your project "${projectTitle}" received its first like! Keep up the great work.`,
    actionUrl: `/project/${projectId}`,
  })
}

export async function notifyProjectPopular({
  projectOwnerId,
  projectTitle,
  projectId,
  likeCount,
}: {
  projectOwnerId: string
  projectTitle: string
  projectId: string
  likeCount: number
}) {
  const milestones = [10, 25, 50, 100, 250, 500, 1000]
  if (!milestones.includes(likeCount)) return null

  return createNotification({
    userId: projectOwnerId,
    type: 'MILESTONE',
    title: '🔥 Your project is trending!',
    message: `"${projectTitle}" has reached ${likeCount} likes! Amazing work.`,
    actionUrl: `/project/${projectId}`,
  })
}

export async function notifyFollowerMilestone({
  userId,
  followerCount,
  username,
}: {
  userId: string
  followerCount: number
  username: string
}) {
  const milestones = [10, 25, 50, 100, 250, 500, 1000]
  if (!milestones.includes(followerCount)) return null

  return createNotification({
    userId,
    type: 'MILESTONE',
    title: '🌟 Follower milestone!',
    message: `You've reached ${followerCount} followers! Your amazing work is inspiring others.`,
    actionUrl: `/profile/${username}`,
  })
}