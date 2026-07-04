import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowRight, Wrench } from "lucide-react"
import * as Icons from "lucide-react"
import { LucideIcon } from "lucide-react"

interface Tool {
  id: string
  slug: string
  name: string
  tagline: string | null
  icon: string | null
  order_index: number
}

function getIcon(name: string | null): LucideIcon {
  if (!name) return Wrench
  const Ico = (Icons as any)[name]
  return Ico || Wrench
}

export default function Tools() {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from("devops_tools")
        .select("id, slug, name, tagline, icon, order_index")
        .order("order_index")
      if (error) {
        toast({ title: "Error", description: "Failed to load tools", variant: "destructive" })
      } else {
        setTools(data || [])
      }
      setLoading(false)
    })()
  }, [toast])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading tools...
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium mb-4 font-mono">
            <Wrench className="w-3.5 h-3.5" />
            DevOps Toolchain
          </div>
          <h1 className="text-4xl font-bold mb-3 font-mono">Tools</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            The sequential DevOps learning path. Follow the chain from Linux fundamentals all the way
            to service meshes — click any node to open the full learning guide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, idx) => {
            const Icon = getIcon(tool.icon)
            const isLast = idx === tools.length - 1
            return (
              <div key={tool.id} className="relative">
                <Link
                  to={`/tools/${tool.slug}`}
                  className="group block h-full border border-border rounded-lg p-5 bg-card hover:border-primary hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-semibold font-mono truncate">{tool.name}</h3>
                      </div>
                      {tool.tagline && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{tool.tagline}</p>
                      )}
                    </div>
                  </div>
                </Link>
                {!isLast && (
                  <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 z-10" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </AppLayout>
  )
}
