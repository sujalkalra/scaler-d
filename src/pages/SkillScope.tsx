import { useEffect, useMemo, useState } from "react"
import { Wrench, Sparkles, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AppLayout } from "@/components/layout/AppLayout"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  description: string | null
  display_order: number
}

interface Tool {
  id: string
  category_id: string
  name: string
  tagline: string | null
  description: string
  display_order: number
}

export default function SkillScope() {
  const [categories, setCategories] = useState<Category[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const load = async () => {
      try {
        const [cats, tls] = await Promise.all([
          supabase.from("skill_scope_categories").select("*").order("display_order"),
          supabase.from("skill_scope_tools").select("*").order("display_order"),
        ])
        if (cats.error) throw cats.error
        if (tls.error) throw tls.error
        setCategories(cats.data || [])
        setTools(tls.data || [])
      } catch (e: any) {
        toast({
          title: "Error",
          description: "Failed to load Skill Scope.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [toast])

  const filteredTools = useMemo(() => {
    if (!query.trim()) return tools
    const q = query.toLowerCase()
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tagline?.toLowerCase().includes(q)
    )
  }, [tools, query])

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            DevOps toolkit
          </div>
          <h1 className="text-4xl font-bold mb-3">Skill Scope</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A curated library of the most powerful Python libraries every modern DevOps and platform
            engineer should know — grouped by what they help you do.
          </p>

          <div className="mt-6 max-w-md">
            <Input
              placeholder="Search tools (e.g. Pulumi, load testing, YAML)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading skill scope...
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((cat) => {
              const catTools = filteredTools.filter((t) => t.category_id === cat.id)
              if (catTools.length === 0) return null
              return (
                <section key={cat.id}>
                  <div className="flex items-baseline justify-between mb-4 border-b border-border pb-2">
                    <div>
                      <h2 className="text-2xl font-bold">{cat.name}</h2>
                      {cat.description && (
                        <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
                      )}
                    </div>
                    <Badge variant="outline">{catTools.length} tools</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {catTools.map((tool) => (
                      <Card
                        key={tool.id}
                        className="p-5 hover:shadow-md transition-shadow border border-border"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                            <Wrench className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="text-lg font-semibold">{tool.name}</h3>
                            </div>
                            {tool.tagline && (
                              <p className="text-xs uppercase tracking-wide text-primary font-medium mb-2">
                                {tool.tagline}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )
            })}

            {filteredTools.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                No tools match "{query}".
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
