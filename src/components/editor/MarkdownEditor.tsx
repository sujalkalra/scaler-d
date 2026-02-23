import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownRenderer } from "@/components/roadmap/MarkdownRenderer"
import { Eye, Code, Columns, Save, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ViewMode = "edit" | "preview" | "split"

interface MarkdownEditorProps {
  initialContent: string
  onSave: (content: string) => Promise<void>
  onCancel: () => void
  saving?: boolean
}

export function MarkdownEditor({ initialContent, onSave, onCancel, saving }: MarkdownEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [viewMode, setViewMode] = useState<ViewMode>("split")

  const viewModes: { mode: ViewMode; icon: React.ReactNode; label: string }[] = [
    { mode: "edit", icon: <Code className="w-4 h-4" />, label: "Edit" },
    { mode: "split", icon: <Columns className="w-4 h-4" />, label: "Split" },
    { mode: "preview", icon: <Eye className="w-4 h-4" />, label: "Preview" },
  ]

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border border-border rounded-xl overflow-hidden bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-1 bg-muted rounded-lg p-0.5">
          {viewModes.map(({ mode, icon, label }) => (
            <Button
              key={mode}
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(mode)}
              className={cn(
                "gap-1.5 h-8 text-xs",
                viewMode === mode && "bg-background shadow-sm text-primary"
              )}
            >
              {icon} {label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={saving}>
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
          <Button size="sm" onClick={() => onSave(content)} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className={cn(
        "flex-1 overflow-hidden",
        viewMode === "split" ? "grid grid-cols-2 divide-x divide-border" : ""
      )}>
        {/* Editor Pane */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div className="h-full overflow-hidden flex flex-col">
            <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border bg-muted/30 font-mono">
              MARKDOWN
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 w-full p-4 bg-background text-foreground font-mono text-sm leading-relaxed resize-none outline-none"
              placeholder="Write your markdown content here..."
              spellCheck={false}
            />
          </div>
        )}

        {/* Preview Pane */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className="h-full overflow-hidden flex flex-col">
            <div className="px-3 py-1.5 text-xs text-muted-foreground border-b border-border bg-muted/30 font-mono">
              PREVIEW
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <MarkdownRenderer content={content} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
