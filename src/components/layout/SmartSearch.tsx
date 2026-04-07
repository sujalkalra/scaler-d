import { useState, useEffect, useRef, useCallback } from "react"
import { Search, MapPin, Building2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { roadmapData } from "@/components/roadmap/roadmapData"
import { supabase } from "@/integrations/supabase/client"

interface SearchResult {
  id: string
  title: string
  type: "roadmap" | "company" | "article"
  slug?: string
  category?: string
}

const FEATURED_COMPANIES = [
  "Netflix", "YouTube", "Spotify", "Instagram", "Uber", "Amazon",
  "Google", "Meta", "Twitter", "WhatsApp", "Slack", "Discord",
  "Airbnb", "LinkedIn", "Pinterest", "Dropbox", "Stripe", "GitHub",
  "Reddit", "TikTok", "Zoom", "Figma", "Notion", "Shopify",
]

export function SmartSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [articles, setArticles] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Fetch articles once
  useEffect(() => {
    supabase
      .from("articles")
      .select("id, title, company")
      .eq("published", true)
      .then(({ data }) => {
        if (data) {
          setArticles(
            data.map((a) => ({
              id: a.id,
              title: a.title,
              type: "article" as const,
              category: a.company || undefined,
            }))
          )
        }
      })
  }, [])

  const search = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults([])
        return
      }
      const lower = q.toLowerCase()
      const matched: SearchResult[] = []

      // Roadmap topics
      roadmapData.forEach((item) => {
        if (item.title.toLowerCase().includes(lower) || item.category.toLowerCase().includes(lower)) {
          matched.push({
            id: `roadmap-${item.id}`,
            title: item.title,
            type: "roadmap",
            slug: item.slug,
            category: item.category,
          })
        }
      })

      // Companies
      FEATURED_COMPANIES.forEach((c) => {
        if (c.toLowerCase().includes(lower)) {
          matched.push({
            id: `company-${c}`,
            title: c,
            type: "company",
          })
        }
      })

      // Articles
      articles.forEach((a) => {
        if (a.title.toLowerCase().includes(lower)) {
          matched.push(a)
        }
      })

      setResults(matched.slice(0, 8))
      setSelectedIndex(-1)
    },
    [articles]
  )

  useEffect(() => {
    search(query)
  }, [query, search])

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleSelect = (result: SearchResult) => {
    setIsOpen(false)
    setQuery("")
    if (result.type === "roadmap" && result.slug) {
      navigate(`/roadmap/${result.slug}`)
    } else if (result.type === "company") {
      navigate(`/articles?company=${encodeURIComponent(result.title)}`)
    } else if (result.type === "article") {
      navigate(`/articles/${result.id}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleSelect(results[selectedIndex])
    } else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const typeConfig = {
    roadmap: { label: "Roadmap", icon: MapPin, color: "bg-primary/15 text-primary border-primary/20" },
    company: { label: "Company", icon: Building2, color: "bg-accent/60 text-accent-foreground border-accent" },
    article: { label: "Article", icon: Search, color: "bg-muted text-muted-foreground border-border" },
  }

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => query && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search topics, companies, articles..."
          className="pl-10 pr-8 focus-ring"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setIsOpen(false) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg overflow-hidden z-[60] max-h-[400px] overflow-y-auto">
          {results.map((result, index) => {
            const config = typeConfig[result.type]
            const Icon = config.icon
            return (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  index === selectedIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0 text-muted-foreground" />
                <span className="flex-1 text-sm truncate">{result.title}</span>
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${config.color}`}>
                  {config.label}
                </Badge>
                {result.category && result.type === "roadmap" && (
                  <span className="text-xs text-muted-foreground shrink-0">{result.category}</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg p-4 z-[60]">
          <p className="text-sm text-muted-foreground text-center">No results for "{query}"</p>
        </div>
      )}
    </div>
  )
}
