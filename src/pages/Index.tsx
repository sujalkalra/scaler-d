import { ArrowRight, BookOpen, PenTool, Zap, TrendingUp, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/AppLayout"
import heroImage from "@/assets/hero-system-design.jpg"
import { Link } from "react-router-dom"

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
    <AppLayout>
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary-light/10 to-secondary-light/10">
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container mx-auto px-6 py-16 lg:py-24 max-w-7xl relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Column - Content */}
              <div className="space-y-8 animate-fade-in order-2 lg:order-1">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-card px-4 py-2 rounded-full border border-border shadow-soft">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-sm font-medium">Join 50,000+ engineers</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                    Master{" "}
                    <span className="text-gradient">System Design</span>{" "}
                    with Real-World Examples
                  </h1>
                  
                  <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                    Learn from Netflix, YouTube, Spotify, and 200+ other companies. 
                    Practice with interactive diagrams and AI-powered insights.
                  </p>
                </div>

                {/* CTA Buttons - Improved visibility */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="hero" size="hero" className="group shadow-large hover:shadow-glow">
                    <Link to="/articles">
                      Start Learning
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="hero" className="border-2 hover:bg-muted">
                    <Link to="/featured-articles">
                      <Star className="w-4 h-4 mr-2" />
                      Featured Articles
                    </Link>
                  </Button>
                </div>

                {/* Stats - Compact on mobile */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6 pt-6 lg:pt-8">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 bg-gradient-primary rounded-lg mx-auto mb-2 shadow-medium">
                        <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                      </div>
                      <div className="text-xl lg:text-2xl font-bold">{stat.value}</div>
                      <div className="text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Hero Image */}
              <div className="relative animate-slide-up order-1 lg:order-2">
                <div className="relative rounded-2xl overflow-hidden shadow-large border border-border/50">
                  <img 
                    src={heroImage} 
                    alt="System Design Architecture" 
                    className="w-full h-auto object-cover"
                    style={{ 
                      maxHeight: '500px',
                      objectPosition: 'center'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent"></div>
                </div>
                
                {/* Floating Badge Cards */}
                <div className="absolute -top-4 -right-4 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-large border border-border animate-bounce-in">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm">AI-Powered</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-card/95 backdrop-blur-sm rounded-xl p-4 shadow-large border border-border animate-bounce-in" style={{ animationDelay: '200ms' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                      <PenTool className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-sm">Interactive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Companies */}
        <section className="py-12 lg:py-16 border-t border-border bg-muted/30">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-10 lg:mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">Learn from Industry Leaders</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore system designs from the world's most successful tech companies
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-6">
              {featuredCompanies.map((company, index) => (
                <Card 
                  key={company} 
                  className="p-4 lg:p-6 text-center hover:shadow-medium hover:scale-105 transition-all duration-200 cursor-pointer group animate-fade-in bg-card/80 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="font-semibold text-xs lg:text-sm group-hover:text-primary transition-colors">
                    {company}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 lg:py-20 bg-gradient-to-b from-background to-muted/20">
          <div className="container mx-auto px-6 max-w-7xl">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Everything You Need to Master System Design</h2>
              <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
                From beginner-friendly tutorials to expert-level architecture deep dives
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <Card className="card-gradient p-6 lg:p-8 group hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 lg:mb-6 shadow-medium group-hover:shadow-glow transition-shadow">
                  <BookOpen className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Curated Articles</h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                  In-depth analysis of real system architectures from Netflix, YouTube, Spotify, and more tech giants.
                </p>
              </Card>

              <Card className="card-gradient p-6 lg:p-8 group hover:scale-105 transition-transform duration-300">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mb-4 lg:mb-6 shadow-medium group-hover:shadow-glow transition-shadow">
                  <PenTool className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">Interactive Practice</h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                  Design systems with our drag-and-drop interface. Practice with real components and patterns.
                </p>
              </Card>

              <Card className="card-gradient p-6 lg:p-8 group hover:scale-105 transition-transform duration-300 md:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-hero rounded-2xl flex items-center justify-center mb-4 lg:mb-6 shadow-medium group-hover:shadow-glow transition-shadow">
                  <Zap className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-lg lg:text-xl font-semibold mb-3 lg:mb-4">AI-Powered Insights</h3>
                <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                  Generate system designs and explanations for any company or use case with advanced AI.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-gradient-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-foreground/5 to-transparent"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          
          <div className="container mx-auto px-6 max-w-4xl relative z-10">
            <div className="text-center text-primary-foreground">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 lg:mb-6">Ready to Level Up Your System Design Skills?</h2>
              <p className="text-base lg:text-xl opacity-90 mb-6 lg:mb-8 max-w-2xl mx-auto">
                Join thousands of engineers who are mastering system design with our comprehensive platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="secondary" size="hero" className="shadow-large">
                  <Link to="/auth">Start Free Trial</Link>
                </Button>
                <Button asChild variant="contrast" size="hero" className="border-2 border-white/20 hover:bg-white/10">
                  <Link to="/articles">Explore Articles</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
