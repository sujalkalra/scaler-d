import { useState } from "react"
import { Heart, MessageCircle, Share2, Bookmark, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Layout } from "@/components/layout/Layout"

const featuredArticles = [
  {
    id: 1,
    title: "How Netflix Handles 15+ Billion Hours of Content Monthly",
    excerpt: "Deep dive into Netflix's microservices architecture, CDN strategy, and real-time recommendation engine that serves 230+ million users globally.",
    author: "Sarah Chen",
    authorAvatar: "SC",
    readTime: "12 min read",
    publishedAt: "2 days ago",
    likes: 1240,
    comments: 89,
    bookmarks: 456,
    tags: ["Netflix", "Microservices", "CDN", "Streaming"],
    difficulty: "Advanced",
    company: "Netflix"
  },
  {
    id: 2,
    title: "YouTube's Video Processing Pipeline: 500 Hours Per Minute",
    excerpt: "Learn how YouTube processes, encodes, and distributes video content at massive scale using cloud infrastructure and intelligent caching.",
    author: "David Park",
    authorAvatar: "DP",
    readTime: "15 min read",
    publishedAt: "1 week ago",
    likes: 2340,
    comments: 156,
    bookmarks: 789,
    tags: ["YouTube", "Video Processing", "Encoding", "Cloud"],
    difficulty: "Expert",
    company: "Google"
  },
  {
    id: 3,
    title: "Spotify's Real-time Music Recommendation System",
    excerpt: "Explore Spotify's machine learning pipelines, collaborative filtering, and real-time data processing for personalized music discovery.",
    author: "Emily Rodriguez",
    authorAvatar: "ER",
    readTime: "10 min read",
    publishedAt: "3 days ago",
    likes: 1890,
    comments: 134,
    bookmarks: 567,
    tags: ["Spotify", "Recommendations", "ML", "Real-time"],
    difficulty: "Intermediate",
    company: "Spotify"
  },
  {
    id: 4,
    title: "Instagram's Photo Storage: Handling Billions of Images",
    excerpt: "Understanding Instagram's distributed storage architecture, image optimization, and content delivery strategies for global scale.",
    author: "Michael Zhang",
    authorAvatar: "MZ",
    readTime: "8 min read",
    publishedAt: "5 days ago",
    likes: 1567,
    comments: 98,
    bookmarks: 445,
    tags: ["Instagram", "Storage", "Images", "CDN"],
    difficulty: "Intermediate",
    company: "Meta"
  }
]

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "Expert", value: "expert" }
]

const companyFilters = ["Netflix", "YouTube", "Spotify", "Instagram", "Uber", "Amazon", "Facebook"]

export default function Articles() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null)

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "bg-success-light text-success"
      case "intermediate": return "bg-warning-light text-warning"
      case "advanced": return "bg-secondary-light text-secondary"
      case "expert": return "bg-destructive-light text-destructive"
      default: return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gradient">System Design Articles</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Learn from real-world system designs of top tech companies. Explore architecture patterns, scalability solutions, and engineering best practices.
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {featuredArticles.map((article) => (
          <Card key={article.id} className="card-article group cursor-pointer animate-fade-in">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {article.authorAvatar}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{article.author}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime}</span>
                      <span>•</span>
                      <span>{article.publishedAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Badge className={getDifficultyColor(article.difficulty)}>
                    {article.difficulty}
                  </Badge>
                </div>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Heart className="w-4 h-4 mr-1" />
                    {article.likes}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {article.comments}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-12">
        <Button variant="outline" size="lg">
          Load More Articles
        </Button>
        </div>
      </div>
    </Layout>
  )
}