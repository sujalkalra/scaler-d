import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Save, Download, Upload, Trash2, Layout, Share2, 
  ChevronDown, FileJson, Image as ImageIcon
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useDesignLabStore } from '../store/useDesignLabStore'
import { diagramTemplates } from '../data/templates'

interface CanvasHeaderProps {
  onSave: () => void
  onExportPNG: () => void
  onExportSVG: () => void
  onExportJSON: () => void
  onLoadTemplate: (templateId: string) => void
  onClear: () => void
  isSaving?: boolean
}

export function CanvasHeader({
  onSave,
  onExportPNG,
  onExportSVG,
  onExportJSON,
  onLoadTemplate,
  onClear,
  isSaving = false,
}: CanvasHeaderProps) {
  const { diagramTitle, setDiagramTitle, isDirty, lastSaved, graph } = useDesignLabStore()
  const [isTemplateOpen, setIsTemplateOpen] = useState(false)
  
  const nodeCount = graph.nodes.length
  const edgeCount = graph.edges.length
  const invalidEdges = graph.edges.filter(e => !e.isValid).length

  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 gap-4">
      {/* Left: Title and stats */}
      <div className="flex items-center gap-4">
        <Input
          value={diagramTitle}
          onChange={(e) => setDiagramTitle(e.target.value)}
          className="w-48 h-8 text-sm font-medium bg-transparent border-transparent hover:border-border focus:border-primary"
          placeholder="Diagram title..."
        />
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary" className="h-5">
            {nodeCount} nodes
          </Badge>
          <Badge variant="secondary" className="h-5">
            {edgeCount} connections
          </Badge>
          {invalidEdges > 0 && (
            <Badge variant="destructive" className="h-5">
              {invalidEdges} warnings
            </Badge>
          )}
          {isDirty && (
            <span className="text-amber-500">• Unsaved</span>
          )}
          {lastSaved && !isDirty && (
            <span className="text-green-500">✓ Saved</span>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Templates */}
        <Dialog open={isTemplateOpen} onOpenChange={setIsTemplateOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Layout className="w-4 h-4" />
              Templates
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Load Template</DialogTitle>
              <DialogDescription>
                Start with a pre-built architecture pattern
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {diagramTemplates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onLoadTemplate(template.id)
                    setIsTemplateOpen(false)
                  }}
                  className="p-4 border border-border rounded-lg hover:border-primary hover:bg-accent/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <Badge variant="outline" className="text-xs capitalize">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {template.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {template.graph.nodes.length} nodes • {template.graph.edges.length} connections
                  </p>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExportPNG}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Export as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportSVG}>
              <ImageIcon className="w-4 h-4 mr-2" />
              Export as SVG
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExportJSON}>
              <FileJson className="w-4 h-4 mr-2" />
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onClear}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>

        {/* Save */}
        <Button 
          size="sm" 
          onClick={onSave}
          disabled={isSaving || !isDirty}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  )
}
