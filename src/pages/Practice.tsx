import { useState, useRef, useEffect } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { useToast } from "@/hooks/use-toast"
import { ComponentLibrary } from "@/components/design-canvas/ComponentLibrary"
import { CanvasToolbar } from "@/components/design-canvas/CanvasToolbar"
import { DesignCanvas } from "@/components/design-canvas/DesignCanvas"
import { designComponents } from "@/components/design-canvas/designComponents"
import { PlacedComponent, Edge, ConnectionMode } from "@/components/design-canvas/types"

export default function Practice() {
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null)
  const [placedComponents, setPlacedComponents] = useState<PlacedComponent[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [connectionMode, setConnectionMode] = useState<ConnectionMode>('none')
  const [connectFrom, setConnectFrom] = useState<string | null>(null)
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set())
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const movedRef = useRef(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Keyboard event handler for deletion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodes.size > 0) {
        // Delete selected nodes
        setPlacedComponents(prev => prev.filter(c => !selectedNodes.has(c.id)))
        // Delete edges connected to selected nodes
        setEdges(prev => prev.filter(edge => 
          !selectedNodes.has(edge.fromId) && !selectedNodes.has(edge.toId)
        ))
        setSelectedNodes(new Set())
        toast({ title: 'Deleted', description: `${selectedNodes.size} component(s) deleted` })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodes, toast])

  const handleDragStart = (e: React.DragEvent, componentId: number) => {
    e.dataTransfer.setData('application/x-component-type', String(componentId))
    setSelectedComponent(componentId)
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
    setSelectedNodes(new Set())
    setConnectionMode('none')
    setConnectFrom(null)
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
    if (connectionMode !== 'none') {
      if (!connectFrom) {
        setConnectFrom(id)
        toast({ title: 'Connect mode', description: 'Select another component to create a connection' })
      } else if (connectFrom !== id) {
        // Create curved connection for better visual appeal
        const fromComp = placedComponents.find(c => c.id === connectFrom)
        const toComp = placedComponents.find(c => c.id === id)
        
        if (fromComp && toComp) {
          const midX = (fromComp.x + toComp.x) / 2
          const midY = (fromComp.y + toComp.y) / 2 - 50 // Curve upward
          
          const newEdge: Edge = { 
            id: `${connectFrom}-${id}-${Date.now()}`,
            fromId: connectFrom,
            toId: id,
            type: connectionMode as 'solid' | 'dashed' | 'dotted',
            curved: Math.abs(fromComp.x - toComp.x) > 100, // Curve for longer connections
            controlPoint: { x: midX, y: midY }
          }
          setEdges((prev) => [...prev, newEdge])
        }
        
        setConnectFrom(null)
        toast({ title: 'Connected', description: `Components connected with ${connectionMode} line` })
      } else {
        setConnectFrom(null)
      }
    } else {
      // Selection mode
      if (movedRef.current) return
      setSelectedNodes(prev => {
        const newSet = new Set(prev)
        if (newSet.has(id)) {
          newSet.delete(id)
        } else {
          newSet.add(id)
        }
        return newSet
      })
    }
  }

  return (
    <AppLayout>
      <div className="h-full flex">
        <ComponentLibrary
          components={designComponents}
          selectedComponent={selectedComponent}
          onComponentSelect={setSelectedComponent}
          onDragStart={handleDragStart}
        />

        <div className="flex-1 flex flex-col">
          <CanvasToolbar
            connectionMode={connectionMode}
            onConnectionModeChange={setConnectionMode}
            onSave={() => toast({ title: 'Saved', description: 'Design saved (demo)' })}
            onExport={() => toast({ title: 'Exported', description: 'Exported as image (demo)' })}
            onClear={clearCanvas}
            onShare={() => toast({ title: 'Share link copied', description: 'Link copied to clipboard (demo)' })}
            selectedComponents={placedComponents.length}
          />

          <DesignCanvas
            placedComponents={placedComponents}
            edges={edges}
            designComponents={designComponents}
            selectedComponent={selectedComponent}
            connectionMode={connectionMode}
            connectFrom={connectFrom}
            draggingId={draggingId}
            onDrop={handleCanvasDrop}
            onDragOver={handleCanvasDragOver}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onNodeMouseDown={handleNodeMouseDown}
            onNodeClick={handleNodeClick}
            canvasRef={canvasRef}
          />
        </div>
      </div>
    </AppLayout>
  )
}
