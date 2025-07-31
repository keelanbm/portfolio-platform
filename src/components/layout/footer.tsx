import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

export function Footer() {
  return (
    <footer className="border-t bg-background w-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600" />
              <span className="text-lg font-bold text-text-primary">PortfolioHub</span>
            </Link>
            <p className="text-sm text-text-secondary">
              Showcase your design work with optional Web3 ownership features.
            </p>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/discover" className="text-text-secondary hover:text-text-primary transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-text-secondary hover:text-text-primary transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-text-secondary hover:text-text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-text-secondary hover:text-text-primary transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-text-secondary hover:text-text-primary transition-colors">
                  API
                </Link>
              </li>
              <li>
                <Link href="/web3" className="text-text-secondary hover:text-text-primary transition-colors">
                  Web3 Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-text-primary">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-text-primary transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-text-primary transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-text-secondary">
            © 2024 PortfolioHub. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 text-sm text-text-secondary">
            <Link href="/status" className="hover:text-text-primary transition-colors">
              Status
            </Link>
            <Link href="/contact" className="hover:text-text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 