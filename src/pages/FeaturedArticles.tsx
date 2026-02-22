import { useState, useEffect } from "react"
import { Heart, MessageCircle, Share2, Bookmark, Clock, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/AppLayout"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface FeaturedArticle {
  id: string
  title: string
  excerpt: string | null
  company: string | null
  company_image: string | null
  read_time: number | null
  created_at: string
  upvotes: number | null
  views: number | null
  tags: string[] | null
  difficulty: string | null
}

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Expert", value: "expert" }
]

const companyFilters = ["Netflix", "Google", "Spotify", "Uber", "Meta", "Amazon"]

export default function FeaturedArticles() {
  const [featuredArticles, setFeaturedArticles] = useState<FeaturedArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchFeaturedArticles()
  }, [])

  const fetchFeaturedArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('is_featured', true)
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setFeaturedArticles(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load featured articles.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner": return "bg-success-light text-success"
      case "intermediate": return "bg-warning-light text-warning"
      case "advanced": return "bg-secondary-light text-secondary"
      case "expert": return "bg-destructive-light text-destructive"
      default: return "bg-muted text-muted-foreground"
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return `${Math.floor(diffInDays / 30)} months ago`
  }

  const filteredArticles = featuredArticles.filter(article => {
    const matchesDifficulty = selectedFilter === "all" || article.difficulty?.toLowerCase() === selectedFilter
    const matchesCompany = !selectedCompany || article.company === selectedCompany
    return matchesDifficulty && matchesCompany
  })

  if (loading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-muted rounded"></div>
                      <div className="h-3 w-24 bg-muted rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-6 w-3/4 bg-muted rounded"></div>
                    <div className="h-4 w-full bg-muted rounded"></div>
                    <div className="h-4 w-2/3 bg-muted rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-primary">Featured System Design Articles</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Curated deep-dives into the system architectures of world's most successful tech companies. Learn from the best engineering practices and design decisions.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Difficulty:</span>
            {filterOptions.map((option) => (
              <Badge
                key={option.value}
                variant={selectedFilter === option.value ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedFilter(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium text-muted-foreground mr-2">Company:</span>
            <Badge
              variant={selectedCompany === null ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => setSelectedCompany(null)}
            >
              All Companies
            </Badge>
            {companyFilters.map((company) => (
              <Badge
                key={company}
                variant={selectedCompany === company ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => setSelectedCompany(company)}
              >
                {company}
              </Badge>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No featured articles found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or check back later for new content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="card-article group cursor-pointer animate-fade-in">
                <div className="space-y-4">
                  {/* Header - Company Image instead of Author */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border">
                        {article.company_image ? (
                          <img 
                            src={article.company_image} 
                            alt={`${article.company} logo`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-primary text-white font-semibold text-sm">
                            {article.company?.[0] || 'C'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">
                          <Building2 className="w-3 h-3" />
                          {article.company}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{article.read_time} min read</span>
                          <span>•</span>
                          <span>{getTimeAgo(article.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {article.difficulty && (
                        <Badge className={getDifficultyColor(article.difficulty)}>
                          {article.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => toast({ title: "Liked", description: `You liked: ${article.title}` })}
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        {article.upvotes || 0}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => toast({ title: "Comments", description: "Comments feature coming soon" })}
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {/* Comments count would go here */}
                        0
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href)
                          toast({ title: "Link copied", description: "Article link copied to clipboard" })
                        }}
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => toast({ title: "Saved", description: "Article saved to bookmarks" })}
                    >
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More - could be implemented later */}
        {filteredArticles.length > 0 && (
          <div className="flex justify-center mt-12">
            <Button variant="outline" size="lg" onClick={() => toast({ title: "Loading...", description: "Fetching more articles (demo)" })}>
              Load More Featured Articles
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}