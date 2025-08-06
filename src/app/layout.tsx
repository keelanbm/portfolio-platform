import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCreateButton } from "@/components/layout/floating-create-button";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from '@clerk/nextjs';
import { ErrorBoundary } from "@/components/error-boundary";
import { InstallPrompt, OfflineNotification } from "@/components/pwa/install-prompt";



export const metadata: Metadata = {
  title: "HiFi Design - Portfolio Platform",
  description: "Showcase your design work with optional Web3 ownership features",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "HiFi Design",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className="antialiased min-h-screen bg-background-primary"
      >
        <ClerkProvider>
          <div className="flex min-h-screen flex-col">
            <ErrorBoundary>
              <OfflineNotification />
              <Header />
            </ErrorBoundary>
            <main className="flex-1">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            <ErrorBoundary>
              <Footer />
            </ErrorBoundary>
          </div>
          <ErrorBoundary>
            <FloatingCreateButton />
          </ErrorBoundary>
          <ErrorBoundary>
            <InstallPrompt />
          </ErrorBoundary>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
