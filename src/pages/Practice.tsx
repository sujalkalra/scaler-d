import { useState, useRef } from "react"
import { Play, Save, Download, Trash2, Layers, Database, Server, Globe, Zap, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AppLayout } from "@/components/layout/AppLayout"

import { useToast } from "@/hooks/use-toast"

const designComponents = [
  { id: 1, name: "Load Balancer", icon: Layers, color: "bg-primary" },
  { id: 2, name: "Database", icon: Database, color: "bg-secondary" },
  { id: 3, name: "API Gateway", icon: Server, color: "bg-success" },
  { id: 4, name: "CDN", icon: Globe, color: "bg-warning" },
  { id: 5, name: "Cache", icon: Zap, color: "bg-destructive" },
]

const templates = [
  {
    id: 1,
    name: "Microservices Architecture",
    components: [
      { id: 1, type: 1, x: 100, y: 100 },
      { id: 2, type: 2, x: 300, y: 150 },
      { id: 3, type: 3, x: 200, y: 250 }
    ]
  },
  {
    id: 2,
    name: "E-commerce Platform",
    components: [
      { id: 1, type: 4, x: 150, y: 80 },
      { id: 2, type: 1, x: 150, y: 180 },
      { id: 3, type: 2, x: 50, y: 280 },
      { id: 4, type: 2, x: 250, y: 280 }
    ]
  }
]

const savedDesigns = [
  {
    id: 1,
    name: "E-commerce Platform",
    lastModified: "2 hours ago",
    components: 8,
    thumbnail: "thumbnail1"
  },
  {
    id: 2,
    name: "Social Media Feed",
    lastModified: "1 day ago",
    components: 12,
    thumbnail: "thumbnail2"
  },
  {
    id: 3,
    name: "Video Streaming Service",
    lastModified: "3 days ago",
    components: 15,
    thumbnail: "thumbnail3"
  }
]

interface PlacedComponent {
  id: string
  type: number
  x: number
  y: number
}

interface Edge {
  id: string
  fromId: string
  toId: string
}

export default function Practice() {
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null)
  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [isDesigning, setIsDesigning] = useState(true)
  const [showTemplates, setShowTemplates] = useState(false)
  const [connectMode, setConnectMode] = useState(false)
  const [connectFrom, setConnectFrom] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const movedRef = useRef(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleStartNewDesign = () => {
    setPlacedComponents([])
    setIsDesigning(true)
    setShowTemplates(false)
    toast({ title: 'New Design Started', description: 'Canvas cleared. Drag components to start designing!' })
  }

  const handleLoadTemplate = () => {
    setShowTemplates(!showTemplates)
  }

  const handleSelectTemplate = (template: typeof templates[0]) => {
    const newComponents = template.components.map(comp => ({
      id: `${comp.type}-${Date.now()}-${Math.random()}`,
      type: comp.type,
      x: comp.x,
      y: comp.y
    }))
    setPlacedComponents(newComponents)
    setIsDesigning(true)
    setShowTemplates(false)
    toast({ title: 'Template Loaded', description: `${template.name} loaded successfully!` })
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (!canvasRef.current) return

    const data = e.dataTransfer.getData('application/x-component-type')
    const typeId = data ? parseInt(data, 10) : selectedComponent
    if (!typeId) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newComponent: PlacedComponent = {
      id: `${typeId}-${Date.now()}-${Math.random()}`,
      type: typeId,
      x: Math.max(0, x - 40),
      y: Math.max(0, y - 40)
    }

    setPlacedComponents(prev => [...prev, newComponent])
    setIsDesigning(true)
    const compName = designComponents.find(c => c.id === typeId)?.name
    toast({ title: 'Component Added', description: `${compName ?? 'Component'} added to canvas` })
  }

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const clearCanvas = () => {
    setPlacedComponents([])
    setEdges([])
    setSelectedComponent(null)
    toast({ title: 'Canvas Cleared', description: 'All components removed' })
  }

  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    if (!canvasRef.current) return
    setDraggingId(id)
    movedRef.current = false
    const rect = canvasRef.current.getBoundingClientRect()
    const comp = placedComponents.find((p) => p.id === id)
    const offsetX = e.clientX - rect.left - (comp?.x ?? 0)
    const offsetY = e.clientY - rect.top - (comp?.y ?? 0)
    dragOffsetRef.current = { x: offsetX, y: offsetY }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    let x = e.clientX - rect.left - dragOffsetRef.current.x
    let y = e.clientY - rect.top - dragOffsetRef.current.y

    const maxX = rect.width - 80
    const maxY = rect.height - 80
    x = Math.max(0, Math.min(x, maxX))
    y = Math.max(0, Math.min(y, maxY))

    movedRef.current = true
    setPlacedComponents((prev) => prev.map((pc) => (pc.id === draggingId ? { ...pc, x, y } : pc)))
  }

  const handleCanvasMouseUp = () => {
    setDraggingId(null)
  }

  const handleNodeClick = (id: string) => {
    if (!connectMode) return
    if (!connectFrom) {
      setConnectFrom(id)
      toast({ title: 'Connect mode', description: 'Select another component to create a connection' })
    } else if (connectFrom !== id) {
      const newEdge: Edge = { id: `${connectFrom}-${id}-${Date.now()}`, fromId: connectFrom, toId: id }
      setEdges((prev) => [...prev, newEdge])
      setConnectFrom(null)
      toast({ title: 'Connected', description: 'Components connected' })
    } else {
      setConnectFrom(null)
    }
  }

  return (
    <AppLayout>
      <div className="h-full flex">
      {/* Sidebar - Component Library */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold mb-2">Component Library</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop components to build your system design
          </p>
        </div>

        {/* Components */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
              System Components
            </h3>
            <div className="space-y-2">
              {designComponents.map((component) => {
                const Icon = component.icon
                return (
                  <div
                    key={component.id}
                    className={`
                      p-3 rounded-lg border-2 border-dashed border-border cursor-move
                      hover:border-primary hover:bg-primary-light transition-all duration-200
                      ${selectedComponent === component.id ? 'border-primary bg-primary-light' : ''}
                    `}
                    onClick={() => setSelectedComponent(component.id)}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/x-component-type', String(component.id))
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${component.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium text-sm">{component.name}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Saved Designs */}
        <div className="p-6 border-t border-border">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
            Saved Designs
          </h3>
          <div className="space-y-2">
            {savedDesigns.map((design) => (
              <Card key={design.id} className="p-3 cursor-pointer hover:bg-accent transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{design.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {design.components} components • {design.lastModified}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toast({ title: 'Open design', description: design.name })}>
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Design Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Design Canvas</h1>
            <Badge variant="outline">Untitled Design</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => toast({ title: 'Saved', description: 'Design saved (demo)' })}>
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast({ title: 'Exported', description: 'Exported as image (demo)' })}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button variant={connectMode ? 'default' : 'outline'} size="sm" onClick={() => setConnectMode((v) => !v)}>
              {connectMode ? 'Connecting…' : 'Connect Mode'}
            </Button>
            <Button variant="hero" size="sm" onClick={() => toast({ title: 'Share link copied', description: 'Link copied to clipboard (demo)' })}>
              Share Design
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden bg-muted/20"
          onDrop={handleCanvasDrop}
          onDragOver={handleCanvasDragOver}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        >
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          {/* Connections */}
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            {edges.map((edge) => {
              const from = placedComponents.find((c) => c.id === edge.fromId)
              const to = placedComponents.find((c) => c.id === edge.toId)
              if (!from || !to) return null
              const x1 = from.x + 40
              const y1 = from.y + 40
              const x2 = to.x + 40
              const y2 = to.y + 40
              return (
                <line
                  key={edge.id}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              )
            })}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="7" refY="3.5" orient="auto">
                <polygon points="0 0, 7 3.5, 0 7" fill="hsl(var(--primary))" />
              </marker>
            </defs>
          </svg>

          {/* Placed Components */}
          {placedComponents.map((component) => {
            const componentData = designComponents.find(c => c.id === component.type)
            if (!componentData) return null
            const Icon = componentData.icon
            
            return (
              <div
                key={component.id}
                className="absolute cursor-move"
                style={{ left: component.x, top: component.y }}
                onMouseDown={(e) => handleNodeMouseDown(e, component.id)}
                onClick={() => {
                  if (movedRef.current) return
                  handleNodeClick(component.id)
                }}
              >
                <div className={`w-20 h-20 ${componentData.color} rounded-lg flex flex-col items-center justify-center shadow-lg border-2 border-white/20 ${connectMode && connectFrom === component.id ? 'ring-2 ring-primary' : ''}`}>
                  <Icon className="w-6 h-6 text-white mb-1" />
                  <span className="text-xs text-white font-medium text-center px-1">{componentData.name}</span>
                </div>
              </div>
            )
          })}
          
          {/* Hint when empty */}
          {placedComponents.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <h3 className="text-xl font-semibold mb-2">Drag components to the canvas</h3>
                <p className="text-muted-foreground mb-6">
                  Toggle Connect Mode to link components. Drag nodes to reposition them.
                </p>
              </div>
            </div>
          )}

        </div>
        </div>
      </div>
    </AppLayout>
  )
}

function Badge({ children, variant = "default", className = "", ...props }: any) {
  const baseStyles = "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-border bg-background"
  }
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}