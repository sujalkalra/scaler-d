import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Wrench } from "lucide-react"
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

// Curriculum phases — grouped by natural DevOps progression.
// Slugs must match the seeded `devops_tools.slug` values.
const PHASES: { code: string; title: string; slugs: string[] }[] = [
  { code: "PHASE_01", title: "Systems & Foundations", slugs: ["linux", "git", "github", "bash"] },
  { code: "PHASE_02", title: "Containers & Orchestration", slugs: ["docker", "kubernetes", "helm"] },
  { code: "PHASE_03", title: "CI/CD", slugs: ["github-actions", "jenkins"] },
  { code: "PHASE_04", title: "Cloud & Infrastructure as Code", slugs: ["aws", "terraform", "ansible"] },
  { code: "PHASE_05", title: "Networking & Edge", slugs: ["nginx"] },
  { code: "PHASE_06", title: "Observability", slugs: ["prometheus", "grafana", "loki"] },
  { code: "PHASE_07", title: "Security & Quality", slugs: ["vault", "trivy", "sonarqube"] },
]

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

  const bySlug = useMemo(() => {
    const m = new Map<string, Tool>()
    tools.forEach((t) => m.set(t.slug, t))
    return m
  }, [tools])

  const orderedPhases = useMemo(() => {
    // Any tool not covered above becomes a trailing "Extended" phase so nothing is lost.
    const covered = new Set(PHASES.flatMap((p) => p.slugs))
    const extras = tools.filter((t) => !covered.has(t.slug)).map((t) => t.slug)
    const phases = PHASES.map((p) => ({
      ...p,
      items: p.slugs.map((s) => bySlug.get(s)).filter(Boolean) as Tool[],
    })).filter((p) => p.items.length > 0)
    if (extras.length > 0) {
      phases.push({
        code: `PHASE_${String(phases.length + 1).padStart(2, "0")}`,
        title: "Extended",
        slugs: extras,
        items: extras.map((s) => bySlug.get(s)!).filter(Boolean),
      })
    }
    return phases
  }, [tools, bySlug])

  const total = tools.length

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-32 text-muted-foreground font-mono">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading tools...
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-12 max-w-5xl font-mono">
        {/* Header */}
        <div className="border-l-4 border-primary pl-6 mb-16">
          <h1 className="text-primary text-3xl font-bold tracking-tighter uppercase mb-2">
            DevOps_Roadmap.sh
          </h1>
          <p className="text-muted-foreground text-sm">
            Sequential mastery from kernel to service mesh.
          </p>
        </div>

        {/* Phases */}
        <div className="relative space-y-24">
          {orderedPhases.map((phase, pIdx) => {
            const isLastPhase = pIdx === orderedPhases.length - 1
            return (
              <div key={phase.code} className="relative">
                {/* vertical rail */}
                <div
                  className={`absolute -left-4 top-0 w-px border-l border-dashed border-muted-foreground/40 ${
                    isLastPhase ? "h-24 bg-gradient-to-b from-border to-transparent" : "h-full bg-border"
                  }`}
                />
                <div className="flex items-center mb-8">
                  <div className="bg-primary text-primary-foreground px-3 py-1 font-bold text-xs mr-4">
                    {phase.code}
                  </div>
                  <h2 className="text-foreground text-lg font-medium">{phase.title}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {phase.items.map((tool) => {
                    const Icon = getIcon(tool.icon)
                    const num = `${String(tool.order_index).padStart(2, "0")}/${String(total).padStart(2, "0")}`
                    return (
                      <Link
                        key={tool.id}
                        to={`/tools/${tool.slug}`}
                        className="group relative bg-card border border-border p-5 hover:border-primary transition-colors overflow-hidden block"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-muted-foreground text-[10px] group-hover:text-primary transition-colors">
                            {num}
                          </div>
                          <Icon className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        </div>
                        <h3 className="text-foreground font-bold mb-1">{tool.name}</h3>
                        {tool.tagline && (
                          <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">
                            {tool.tagline}
                          </p>
                        )}
                        <div className="absolute bottom-0 right-0 w-8 h-8 flex items-center justify-center opacity-10 group-hover:opacity-100 transition-opacity">
                          <div className="w-2 h-2 bg-primary" />
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Stats Bar */}
        <div className="flex justify-between items-center pt-8 mt-16 border-t border-border text-[10px] uppercase tracking-widest text-muted-foreground">
          <div className="flex gap-8">
            <div>
              Nodes: <span className="text-primary">{total}</span>
            </div>
            <div>
              Phases: <span className="text-foreground">{orderedPhases.length}</span>
            </div>
          </div>
          <div className="text-primary font-bold">System_Ready</div>
        </div>
      </div>
    </AppLayout>
  )
}
