import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Upload, Users, Zap, Heart, Share } from "lucide-react";

export default function Home() {
  // Sample projects for the carousel
  const sampleProjects = [
    {
      id: '1',
      title: 'Modern Web App Design',
      description: 'A sleek dashboard interface with dark mode and micro-interactions',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
      user: { name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face' },
      likes: 124,
      tags: ['UI/UX', 'Dashboard']
    },
    {
      id: '2',
      title: 'Brand Identity System',
      description: 'Complete visual identity for a sustainable fashion startup',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      user: { name: 'Marcus Rodriguez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
      likes: 89,
      tags: ['Branding', 'Logo']
    },
    {
      id: '3',
      title: 'Mobile App Interface',
      description: 'Intuitive fitness tracking app with beautiful data visualization',
      image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
      user: { name: 'Emma Thompson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
      likes: 156,
      tags: ['Mobile', 'Fitness']
    },
    {
      id: '4',
      title: 'E-commerce Website',
      description: 'Modern online store with seamless checkout experience',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
      user: { name: 'Alex Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
      likes: 203,
      tags: ['E-commerce', 'Web']
    },
    {
      id: '5',
      title: 'Illustration Series',
      description: 'Collection of hand-drawn illustrations for children\'s books',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      user: { name: 'Lily Park', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face' },
      likes: 67,
      tags: ['Illustration', 'Children']
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-text-primary">
            Showcase Your Design Work
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
              With True Ownership
            </span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            The modern portfolio platform for designers. Upload your work, build your audience, 
            and optionally mint your projects as NFTs for permanent ownership.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="btn-primary">
              <Link href="/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="btn-secondary">
              <Link href="/discover">Browse Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Auto-scrolling Projects Carousel */}
      <section className="py-20 px-8 bg-background-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
              Discover Amazing Work
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              See what designers are creating on PortfolioHub
            </p>
          </div>

          {/* Auto-scrolling container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-6">
              {/* Duplicate projects for seamless loop */}
              {[...sampleProjects, ...sampleProjects].map((project, index) => (
                <div key={`${project.id}-${index}`} className="flex-shrink-0 w-80">
                  <Card className="portfolio-card group h-full">
                    <CardContent className="p-0">
                      {/* Project Image */}
                      <div className="image-container">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        
                        {/* Quick Actions Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-9 w-9 p-0 rounded-full shadow-lg backdrop-blur-sm bg-background-overlay/90 hover:bg-background-overlay text-text-muted transition-all duration-200"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="h-9 w-9 p-0 rounded-full shadow-lg backdrop-blur-sm bg-background-overlay/90 hover:bg-background-overlay text-text-muted transition-all duration-200"
                            >
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Project Content */}
                      <div className="p-4">
                        {/* User Info */}
                        <div className="flex items-center space-x-2 mb-3">
                          <div className="h-6 w-6 rounded-full ring-2 ring-background-primary shadow-sm overflow-hidden">
                            <img src={project.user.avatar} alt={project.user.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-secondary hover:text-text-primary truncate transition-colors duration-200">
                              {project.user.name}
                            </p>
                          </div>
                        </div>

                        {/* Project Title */}
                        <h3 className="text-base font-semibold text-text-primary hover:text-accent-primary mb-2 line-clamp-1 transition-colors duration-200">
                          {project.title}
                        </h3>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {project.tags.map((tag) => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="text-xs bg-background-tertiary text-text-secondary hover:bg-background-overlay transition-colors duration-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-border-primary">
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-2 rounded-md text-text-muted hover:text-accent-pink hover:bg-accent-pink/10 transition-all duration-200"
                            >
                              <Heart className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">{project.likes}</span>
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 rounded-md text-text-muted hover:text-text-secondary hover:bg-background-tertiary transition-all duration-200"
                          >
                            <Share className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-primary">
              Everything You Need to Showcase Your Work
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              From simple portfolios to advanced Web3 features, we&apos;ve got you covered.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="portfolio-card">
              <CardHeader>
                <Upload className="h-8 w-8 text-accent-primary mb-2" />
                <CardTitle className="text-text-primary">Easy Upload</CardTitle>
                <CardDescription className="text-text-secondary">
                  Upload up to 10 images per project with drag-and-drop simplicity.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Drag & drop interface</li>
                  <li>• Multiple image formats</li>
                  <li>• Automatic optimization</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="portfolio-card">
              <CardHeader>
                <Users className="h-8 w-8 text-accent-secondary mb-2" />
                <CardTitle className="text-text-primary">Social Features</CardTitle>
                <CardDescription className="text-text-secondary">
                  Build your audience with likes, saves, and follows.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• Like and save projects</li>
                  <li>• Follow other designers</li>
                  <li>• Activity feeds</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="portfolio-card">
              <CardHeader>
                <Zap className="h-8 w-8 text-accent-success mb-2" />
                <CardTitle className="text-text-primary">Web3 Optional</CardTitle>
                <CardDescription className="text-text-secondary">
                  Mint your projects as NFTs for true ownership and permanence.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li>• NFT minting</li>
                  <li>• IPFS storage</li>
                  <li>• Blockchain verification</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}
