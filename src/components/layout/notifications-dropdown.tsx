'use client'

import { useState, useRef, useEffect } from 'react'
import { Bell, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useNotifications, type Notification } from '@/hooks/useNotifications'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { notifications, unreadCount, loading, markAsRead, error } = useNotifications()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead([notification.id])
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl
    }
    
    setIsOpen(false)
  }

  const handleMarkAllRead = () => {
    markAsRead([], true)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-background-tertiary rounded-full"
      >
        <Bell className="h-5 w-5 text-text-secondary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-accent-primary text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {isOpen && (
        <Card className="absolute top-full right-0 mt-2 w-80 z-50 bg-background-secondary border-border-primary shadow-lg max-h-96 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-text-primary">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="text-xs text-text-muted hover:text-text-primary"
                >
                  <CheckCheck className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            {loading ? (
              <div className="p-4 text-center text-text-muted">
                Loading notifications...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-text-muted">
                Unable to load notifications
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-text-muted">
                No notifications yet
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-3 border-b border-border-primary cursor-pointer hover:bg-background-tertiary transition-colors ${
                      !notification.isRead ? 'bg-accent-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-text-primary truncate">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="h-2 w-2 bg-accent-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-text-muted mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-text-muted mt-1">
                          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {notifications.length > 10 && (
                  <div className="p-3 text-center border-t border-border-primary">
                    <Link
                      href="/notifications"
                      className="text-sm text-accent-primary hover:text-accent-secondary"
                      onClick={() => setIsOpen(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}