'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export function FloatingCreateButton() {
  const { isSignedIn } = useUser()

  // Only show for authenticated users
  if (!isSignedIn) {
    return null
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button asChild size="lg" className="btn-primary shadow-lg hover:shadow-xl transition-all duration-200 rounded-full h-14 w-14 p-0">
        <Link href="/create" className="flex items-center justify-center">
          <Plus className="h-6 w-6" />
        </Link>
      </Button>
    </div>
  )
} 