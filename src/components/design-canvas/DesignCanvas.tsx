import { useRef, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { PlacedComponent, Edge, DesignComponent } from "./types"

interface DesignCanvasProps {
  placedComponents: PlacedComponent[]
  edges: Edge[]
  designComponents: DesignComponent[]
  selectedComponent: number | null
  connectionMode: string
  connectFrom: string | null
  draggingId: string | null
  onDrop: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onNodeMouseDown: (e: React.MouseEvent, id: string) => void
  onNodeClick: (id: string) => void
  canvasRef: React.RefObject<HTMLDivElement>
}

export function DesignCanvas({
  placedComponents,
  edges,
  designComponents,
  selectedComponent,
  connectionMode,
  connectFrom,
  draggingId,
  onDrop,
  onDragOver,
  onMouseMove,
  onMouseUp,
  onNodeMouseDown,
  onNodeClick,
  canvasRef
}: DesignCanvasProps) {
  const renderConnection = (edge: Edge) => {
    const from = placedComponents.find((c) => c.id === edge.fromId)
    const to = placedComponents.find((c) => c.id === edge.toId)
    if (!from || !to) return null

    const x1 = from.x + 40
    const y1 = from.y + 40
    const x2 = to.x + 40
    const y2 = to.y + 40

    if (edge.curved && edge.controlPoint) {
      const path = `M ${x1} ${y1} Q ${edge.controlPoint.x} ${edge.controlPoint.y} ${x2} ${y2}`
      return (
        <path
          key={edge.id}
          d={path}
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          fill="none"
          strokeDasharray={edge.type === 'dashed' ? '8,4' : edge.type === 'dotted' ? '2,2' : 'none'}
          markerEnd="url(#arrowhead)"
          className="cursor-pointer hover:stroke-primary-hover"
        />
      )
    }

    return (
      <line
        key={edge.id}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeDasharray={edge.type === 'dashed' ? '8,4' : edge.type === 'dotted' ? '2,2' : 'none'}
        markerEnd="url(#arrowhead)"
        className="cursor-pointer hover:stroke-primary-hover"
      />
    )
  }

  return (
    <div 
      ref={canvasRef}
      className="flex-1 relative overflow-hidden bg-muted/10"
      onDrop={onDrop}
      onDragOver={onDragOver}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Connections SVG */}
      <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
        {edges.map(renderConnection)}
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
            className="absolute cursor-move group"
            style={{ left: component.x, top: component.y }}
            onMouseDown={(e) => onNodeMouseDown(e, component.id)}
            onClick={(e) => {
              e.stopPropagation()
              onNodeClick(component.id)
            }}
          >
            <div className={`
              w-20 h-20 ${componentData.color} rounded-lg flex flex-col items-center justify-center 
              shadow-soft border-2 border-white/20 transition-all duration-200
              group-hover:shadow-medium group-hover:scale-105
              ${connectionMode !== 'none' && connectFrom === component.id ? 'ring-2 ring-primary ring-offset-2' : ''}
              ${draggingId === component.id ? 'shadow-glow scale-105' : ''}
            `}>
              <Icon className="w-6 h-6 text-white mb-1" />
              <span className="text-xs text-white font-medium text-center px-1 leading-tight">
                {componentData.name}
              </span>
            </div>
          </div>
        )
      })}
      
      {/* Empty State */}
      {placedComponents.length === 0 && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <h3 className="text-xl font-semibold mb-2">Drag components to start designing</h3>
            <p className="text-muted-foreground mb-6">
              Use connection modes to link components. Press Delete to remove selected nodes.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline">Drag & Drop</Badge>
              <Badge variant="outline">Connect Mode</Badge>
              <Badge variant="outline">Delete Key</Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}