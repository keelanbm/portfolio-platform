import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Upload, Users, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Showcase Your Design Work
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              With True Ownership
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The modern portfolio platform for designers. Upload your work, build your audience, 
            and optionally mint your projects as NFTs for permanent ownership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/discover">Browse Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Showcase Your Work
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From simple portfolios to advanced Web3 features, we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Upload className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Easy Upload</CardTitle>
                <CardDescription>
                  Upload up to 10 images per project with drag-and-drop simplicity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Drag & drop interface</li>
                  <li>• Multiple image formats</li>
                  <li>• Automatic optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Social Features</CardTitle>
                <CardDescription>
                  Build your audience with likes, saves, and follows.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Like and save projects</li>
                  <li>• Follow other designers</li>
                  <li>• Activity feeds</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Web3 Optional</CardTitle>
                <CardDescription>
                  Mint your projects as NFTs for true ownership and permanence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• NFT minting</li>
                  <li>• IPFS storage</li>
                  <li>• Blockchain verification</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Start free, upgrade when you need more features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Free
                  <Badge variant="secondary">Current</Badge>
                </CardTitle>
                <CardDescription>
                  Perfect for getting started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li>• 3 slides per project</li>
                  <li>• Basic profile</li>
                  <li>• Community features</li>
                  <li>• Standard support</li>
                </ul>
                <Button variant="outline" className="w-full" disabled>
                  Current Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-purple-600">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Pro
                  <Badge variant="default">Popular</Badge>
                </CardTitle>
                <CardDescription>
                  For serious designers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">$10<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm">
                  <li>• 10 slides per project</li>
                  <li>• Advanced analytics</li>
                  <li>• Custom domain</li>
                  <li>• Priority support</li>
                  <li>• Web3 features</li>
                </ul>
                <Button className="w-full">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
