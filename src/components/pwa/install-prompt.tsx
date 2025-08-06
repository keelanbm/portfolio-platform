'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, X, Smartphone } from 'lucide-react'
import { showToast } from '@/lib/toast'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)

    // Check if iOS device
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent))

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      // Show install prompt after user has interacted with the site
      setTimeout(() => {
        setShowPrompt(true)
      }, 30000) // Show after 30 seconds
    }

    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setShowPrompt(false)
      showToast.success('App Installed!', 'HiFi Design has been installed successfully')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        showToast.success('Installing...', 'HiFi Design is being installed')
      } else {
        showToast.info('Installation Cancelled', 'You can install the app later from your browser menu')
      }
      
      setDeferredPrompt(null)
      setShowPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
  }

  // Don't show if already installed or dismissed this session
  if (isStandalone || (typeof window !== 'undefined' && sessionStorage.getItem('pwa-prompt-dismissed') === 'true')) {
    return null
  }

  // Android/Chrome install prompt
  if (showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
        <Card className="border-accent-primary/20 bg-background-secondary/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-accent-primary/10 rounded-lg">
                <Download className="h-5 w-5 text-accent-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary mb-1">
                  Install HiFi Design
                </h3>
                <p className="text-xs text-text-secondary mb-3">
                  Get the full app experience with offline access and faster loading.
                </p>
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleInstallClick}
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Install
                  </Button>
                  <Button 
                    onClick={handleDismiss}
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // iOS install instructions
  if (isIOS && showPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
        <Card className="border-accent-primary/20 bg-background-secondary/95 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 p-2 bg-accent-primary/10 rounded-lg">
                <Smartphone className="h-5 w-5 text-accent-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary mb-1">
                  Install HiFi Design
                </h3>
                <p className="text-xs text-text-secondary mb-3">
                  Tap the Share button <span className="inline-block w-4 h-4 bg-blue-500 rounded text-white text-center leading-4">↗</span> and select &quot;Add to Home Screen&quot;
                </p>
                <Button 
                  onClick={handleDismiss}
                  variant="ghost"
                  size="sm"
                  className="w-full text-xs"
                >
                  Got it
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

// Offline notification component
export function OfflineNotification() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine)
      
      if (navigator.onLine) {
        showToast.success('Back Online', 'Your connection has been restored')
      } else {
        showToast.warning('Offline Mode', 'You\'re currently offline. Some features may be limited.')
      }
    }

    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    return () => {
      window.removeEventListener('online', updateOnlineStatus)
      window.removeEventListener('offline', updateOnlineStatus)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-orange-500 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span>You&apos;re currently offline</span>
      </div>
    </div>
  )
}