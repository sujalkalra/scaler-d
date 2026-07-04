import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Loader2, ArrowLeft, Pencil, Save, X, Wrench } from "lucide-react"
import * as Icons from "lucide-react"
import { LucideIcon } from "lucide-react"
import { MarkdownRenderer } from "@/components/roadmap/MarkdownRenderer"

interface Tool {
  id: string
  slug: string
  name: string
  tagline: string | null
  icon: string | null
  content: string
  order_index: number
}

function getIcon(name: string | null): LucideIcon {
  if (!name) return Wrench
  const Ico = (Icons as any)[name]
  return Ico || Wrench
}

export default function ToolDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { toast } = useToast()
  const { isAdmin } = useIsAdmin()
  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [draftContent, setDraftContent] = useState("")
  const [draftTagline, setDraftTagline] = useState("")

  useEffect(() => {
    if (!slug) return
    ;(async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from("devops_tools")
        .select("*")
        .eq("slug", slug)
        .maybeSingle()
      if (error || !data) {
        toast({ title: "Not found", description: "Tool not found", variant: "destructive" })
      } else {
        setTool(data as Tool)
        setDraftContent(data.content)
        setDraftTagline(data.tagline || "")
      }
      setLoading(false)
    })()
  }, [slug, toast])

  const handleSave = async () => {
    if (!tool) return
    setSaving(true)
    const { error } = await supabase
      .from("devops_tools")
      .update({ content: draftContent, tagline: draftTagline })
      .eq("id", tool.id)
    setSaving(false)
    if (error) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" })
      return
    }
    setTool({ ...tool, content: draftContent, tagline: draftTagline })
    setEditing(false)
    toast({ title: "Saved", description: "Article updated." })
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading...
        </div>
      </AppLayout>
    )
  }

  if (!tool) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
          <Button asChild variant="outline">
            <Link to="/tools">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Tools
            </Link>
          </Button>
        </div>
      </AppLayout>
    )
  }

  const Icon = getIcon(tool.icon)

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-10 max-w-4xl">
        <Button asChild variant="ghost" size="sm" className="mb-6">
          <Link to="/tools">
            <ArrowLeft className="w-4 h-4 mr-2" /> All Tools
          </Link>
        </Button>

        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono text-muted-foreground mb-1">
                Step {String(tool.order_index).padStart(2, "0")}
              </div>
              <h1 className="text-3xl font-bold font-mono">{tool.name}</h1>
              {!editing && tool.tagline && (
                <p className="text-muted-foreground mt-1">{tool.tagline}</p>
              )}
            </div>
          </div>

          {isAdmin && !editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </Button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Tagline</label>
              <Input
                value={draftTagline}
                onChange={(e) => setDraftTagline(e.target.value)}
                placeholder="Short tagline"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Content (Markdown)</label>
              <Textarea
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
                className="min-h-[500px] font-mono text-sm"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(false)
                  setDraftContent(tool.content)
                  setDraftTagline(tool.tagline || "")
                }}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          </div>
        ) : (
          <article className="prose prose-invert max-w-none">
            <MarkdownRenderer content={tool.content || "*No content yet.*"} />
          </article>
        )}
      </div>
    </AppLayout>
  )
}
