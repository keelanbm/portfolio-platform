'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Sparkles } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background-secondary via-background-primary to-background-tertiary">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="relative px-8 py-12 lg:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Join thousands of creators
            </Badge>
          </div>

          {/* Main Heading - More Concise */}
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-5xl font-bold text-text-primary leading-tight">
              Showcase Your
              <span className="bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent"> Creative Vision</span>
            </h1>
            <p className="text-lg lg:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
              The ultimate platform for designers to share their work and discover amazing projects.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary text-lg px-8 py-6">
              <Link href="/create">
                Start Sharing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 border-2">
              <Link href="/discover">
                Explore Work
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}