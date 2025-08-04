'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  actionUrl?: string
  isRead: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationsResponse {
  success: boolean
  data: Notification[]
  unreadCount: number
}

export function useNotifications() {
  const { isSignedIn } = useUser()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch notifications
  const fetchNotifications = async (unreadOnly = false) => {
    if (!isSignedIn) return

    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (unreadOnly) params.append('unread', 'true')

      const response = await fetch(`/api/notifications?${params}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data: NotificationsResponse = await response.json()

      if (data.success) {
        setNotifications(data.data)
        setUnreadCount(data.unreadCount)
      } else {
        setError('Failed to fetch notifications')
      }
    } catch (err) {
      // Silently fail for authentication issues
      console.warn('Notifications fetch failed:', err)
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setLoading(false)
    }
  }

  // Mark notifications as read
  const markAsRead = async (notificationIds?: string[], markAllAsRead = false) => {
    if (!isSignedIn) return

    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notificationIds,
          markAllAsRead,
        }),
      })

      if (response.ok) {
        // Update local state
        if (markAllAsRead) {
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
          setUnreadCount(0)
        } else if (notificationIds) {
          setNotifications(prev =>
            prev.map(n =>
              notificationIds.includes(n.id) ? { ...n, isRead: true } : n
            )
          )
          setUnreadCount(prev => Math.max(0, prev - notificationIds.length))
        }
      }
    } catch (err) {
      console.error('Error marking notifications as read:', err)
    }
  }

  // Fetch notifications on component mount
  useEffect(() => {
    if (isSignedIn) {
      fetchNotifications()
    }
  }, [isSignedIn])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
  }
}