export type EventType =
  | 'PUBLISH'
  | 'LIKE'
  | 'SAVE'
  | 'COMMENT'
  | 'REPLY'
  | 'FOLLOW'
  | 'TAG_FOLLOW'
  | 'SHARE'

interface LogEventPayload {
  type: EventType | string
  projectId?: string
  commentId?: string
  tag?: string
  metadata?: Record<string, unknown>
}

export async function logEvent(payload: LogEventPayload): Promise<void> {
  try {
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
  } catch {
    // Intentionally swallow errors on client analytics logging
  }
}

