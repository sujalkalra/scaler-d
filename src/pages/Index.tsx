import { ArrowRight, BookOpen, PenTool, Zap, TrendingUp, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Layout } from "@/components/layout/Layout"
import heroImage from "@/assets/hero-system-design.jpg"

const stats = [
  { label: "Articles", value: "500+", icon: BookOpen },
  { label: "Active Users", value: "50K+", icon: Users },
  { label: "Designs Created", value: "100K+", icon: PenTool },
  { label: "Companies Covered", value: "200+", icon: TrendingUp },
]

const featuredCompanies = [
  "Netflix", "YouTube", "Spotify", "Instagram", "Uber", "Amazon", "Google", "Meta"
]

const Index = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary-light/20 to-secondary-light/20">
          <div className="container mx-auto px-6 py-20 max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8 animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-gradient-card px-4 py-2 rounded-full border border-border">
                    <Star className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">Join 50,000+ engineers</span>
                  </div>
                  
                  <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                    Master{" "}
                    <span className="text-gradient">System Design</span>{" "}
                    with Real-World Examples
                  </h1>
                  
                  <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                    Learn from Netflix, YouTube, Spotify, and 200+ other companies. 
                    Practice with interactive diagrams and AI-powered insights.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="hero" size="hero" className="group">
                    Start Learning
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="outline" size="hero">
                    Browse Articles
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-2">
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative animate-slide-up">
                <div className="relative rounded-2xl overflow-hidden shadow-large">
                  <img 
                    src={heroImage} 
                    alt="System Design Architecture" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                
                {/* Floating Cards */}
                <div className="absolute -top-4 -right-4 bg-card rounded-xl p-4 shadow-medium border border-border animate-bounce-in">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-warning" />
                    <span className="font-semibold text-sm">AI-Powered</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-card rounded-xl p-4 shadow-medium border border-border animate-bounce-in" style={{ animationDelay: '200ms' }}>
                  <div className="flex items-center gap-2">
                    <PenTool className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-sm">Interactive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Companies */}
        <section className="py-16 border-t border-border bg-gradient-card">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Learn from Industry Leaders</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore system designs from the world's most successful tech companies
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
              {featuredCompanies.map((company, index) => (
                <Card 
                  key={company} 
                  className="p-6 text-center hover:shadow-medium transition-all duration-200 cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {company}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Everything You Need to Master System Design</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From beginner-friendly tutorials to expert-level architecture deep dives
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="card-gradient p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Curated Articles</h3>
                <p className="text-muted-foreground leading-relaxed">
                  In-depth analysis of real system architectures from Netflix, YouTube, Spotify, and more tech giants.
                </p>
              </Card>

              <Card className="card-gradient p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <PenTool className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Interactive Practice</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Design systems with our drag-and-drop interface. Practice with real components and patterns.
                </p>
              </Card>

              <Card className="card-gradient p-8 text-center group">
                <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">AI-Powered Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Generate system designs and explanations for any company or use case with advanced AI.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-6">Ready to Level Up Your System Design Skills?</h2>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Join thousands of engineers who are mastering system design with our comprehensive platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="hero">
                  Start Free Trial
                </Button>
                <Button variant="outline" size="hero" className="text-white border-white hover:bg-white hover:text-primary">
                  View Pricing
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
