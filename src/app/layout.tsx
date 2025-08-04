import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingCreateButton } from "@/components/layout/floating-create-button";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from '@clerk/nextjs';



export const metadata: Metadata = {
  title: "PortfolioHub - Design Portfolio Platform",
  description: "Showcase your design work with optional Web3 ownership features",
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
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <FloatingCreateButton />
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
