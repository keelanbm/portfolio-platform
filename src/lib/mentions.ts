import { prisma } from '@/lib/prisma'

export interface MentionMatch {
  username: string
  startIndex: number
  endIndex: number
  fullMatch: string
}

export interface ParsedMentions {
  mentions: MentionMatch[]
  processedText: string
}

/**
 * Parse text to find @mentions
 * Supports formats like @username, @user.name, @user_name
 */
export function parseMentions(text: string): ParsedMentions {
  const mentionRegex = /@([a-zA-Z0-9._-]+)/g
  const mentions: MentionMatch[] = []
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      username: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      fullMatch: match[0],
    })
  }

  return {
    mentions,
    processedText: text,
  }
}

/**
 * Get user IDs for valid mentions
 */
export async function resolveMentions(usernames: string[]): Promise<Array<{ username: string; userId: string }>> {
  if (usernames.length === 0) return []

  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          in: usernames,
        },
      },
      select: {
        id: true,
        username: true,
      },
    })

    return users.map(user => ({
      username: user.username,
      userId: user.id,
    }))
  } catch (error) {
    console.error('Error resolving mentions:', error)
    return []
  }
}

/**
 * Convert plain text mentions to clickable links (for display)
 */
export function renderMentionsAsLinks(text: string): string {
  return text.replace(
    /@([a-zA-Z0-9._-]+)/g,
    '<a href="/profile/$1" class="text-accent-primary hover:text-accent-secondary font-medium">@$1</a>'
  )
}

/**
 * Get mention suggestions based on partial input
 */
export async function getMentionSuggestions(
  partialUsername: string,
  limit = 5,
  excludeUserIds: string[] = []
): Promise<Array<{ id: string; username: string; displayName: string | null; avatarUrl: string | null }>> {
  if (partialUsername.length < 1) return []

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              {
                username: {
                  contains: partialUsername,
                },
              },
              {
                displayName: {
                  contains: partialUsername,
                },
              },
            ],
          },
          {
            id: {
              notIn: excludeUserIds,
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
      },
      orderBy: [
        {
          username: 'asc',
        },
      ],
      take: limit,
    })

    return users
  } catch (error) {
    console.error('Error getting mention suggestions:', error)
    return []
  }
}

/**
 * Extract unique usernames from mention matches
 */
export function extractUsernames(mentions: MentionMatch[]): string[] {
  return [...new Set(mentions.map(mention => mention.username))]
}

/**
 * Validate if a username is mentionable (exists and is active)
 */
export async function validateMention(username: string): Promise<{ valid: boolean; userId?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    })

    return {
      valid: !!user,
      userId: user?.id,
    }
  } catch (error) {
    console.error('Error validating mention:', error)
    return { valid: false }
  }
}

/**
 * Process mentions in text and return both the processed text and valid mention data
 */
export async function processMentions(text: string): Promise<{
  processedText: string
  validMentions: Array<{ username: string; userId: string }>
}> {
  const parsed = parseMentions(text)
  const usernames = extractUsernames(parsed.mentions)
  const validMentions = await resolveMentions(usernames)

  return {
    processedText: parsed.processedText,
    validMentions,
  }
}

/**
 * Highlight mentions in text (for rich text editing)
 */
export function highlightMentions(text: string, className = 'bg-accent-primary/20 text-accent-primary rounded px-1'): string {
  return text.replace(
    /@([a-zA-Z0-9._-]+)/g,
    `<span class="${className}">@$1</span>`
  )
}