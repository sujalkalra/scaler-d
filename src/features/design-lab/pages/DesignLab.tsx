import { useState, useCallback } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { ComponentSidebar } from '../components/ComponentSidebar'
import { CanvasHeader } from '../components/CanvasHeader'
import { PropertiesPanel } from '../components/PropertiesPanel'
import { ExcalidrawCanvas, exportToPNG, exportAsSVG, exportAsJSON } from '../components/ExcalidrawCanvas'
import { useDesignLabStore } from '../store/useDesignLabStore'
import { nodeDefinitions } from '../data/nodeDefinitions'
import { diagramTemplates } from '../data/templates'
import { NodeType } from '../types'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'

// Helper to create Excalidraw element
function createExcalidrawRect(id: string, x: number, y: number, color: string, label: string): any[] {
  const nodeWidth = 140
  const nodeHeight = 80
  
  const rect: any = {
    id,
    type: 'rectangle',
    x,
    y,
    width: nodeWidth,
    height: nodeHeight,
    angle: 0,
    strokeColor: color,
    backgroundColor: color + '20',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: `a${Date.now()}`,
    roundness: { type: 3 },
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    customData: {
      semanticId: id,
    },
  }

  const text: any = {
    id: `${id}-label`,
    type: 'text',
    x: x + 10,
    y: y + nodeHeight / 2 - 10,
    width: nodeWidth - 20,
    height: 20,
    angle: 0,
    strokeColor: color,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: `a${Date.now() + 1}`,
    roundness: null,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    text: label,
    fontSize: 14,
    fontFamily: 1,
    textAlign: 'center',
    verticalAlign: 'middle',
    containerId: id,
    originalText: label,
    autoResize: true,
    lineHeight: 1.25,
  }

  return [rect, text]
}

export default function DesignLab() {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()
  
  const { 
    graph, 
    diagramTitle, 
    diagramId,
    addNode, 
    loadGraph, 
    clearGraph, 
    markClean,
  } = useDesignLabStore()

  // Add node to canvas
  const handleAddNode = useCallback((type: NodeType) => {
    if (!excalidrawAPI) return
    
    // Get center of viewport
    const appState = excalidrawAPI.getAppState()
    const { scrollX, scrollY, width, height, zoom } = appState
    
    const centerX = (-scrollX + width / 2) / zoom.value
    const centerY = (-scrollY + height / 2) / zoom.value
    
    // Add some randomness to prevent overlap
    const x = centerX - 70 + (Math.random() - 0.5) * 100
    const y = centerY - 40 + (Math.random() - 0.5) * 100
    
    const newNode = addNode(type, { x, y })
    const nodeDef = nodeDefinitions[type]
    
    // Create Excalidraw element
    const elements = excalidrawAPI.getSceneElements()
    const [rect, text] = createExcalidrawRect(newNode.id, newNode.position.x, newNode.position.y, nodeDef.color, newNode.label)

    excalidrawAPI.updateScene({
      elements: [...elements, rect, text],
    })

    toast({
      title: `${nodeDef.label} Added`,
      description: nodeDef.description.slice(0, 80) + '...',
    })
  }, [excalidrawAPI, addNode, toast])

  // Handle drop from sidebar
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const nodeType = e.dataTransfer.getData('application/x-node-type') as NodeType
    if (nodeType && excalidrawAPI) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const appState = excalidrawAPI.getAppState()
      const { scrollX, scrollY, zoom } = appState
      
      const canvasX = (x - scrollX) / zoom.value
      const canvasY = (y - scrollY) / zoom.value
      
      const newNode = addNode(nodeType, { x: canvasX - 70, y: canvasY - 40 })
      const nodeDef = nodeDefinitions[nodeType]
      
      // Create Excalidraw element at drop position
      const elements = excalidrawAPI.getSceneElements()
      const [newRect, newText] = createExcalidrawRect(newNode.id, canvasX - 70, canvasY - 40, nodeDef.color, newNode.label)

      excalidrawAPI.updateScene({
        elements: [...elements, newRect, newText],
      })

      toast({
        title: `${nodeDef.label} Added`,
      })
    }
  }, [excalidrawAPI, addNode, toast])

  // Load template
  const handleLoadTemplate = useCallback((templateId: string) => {
    const template = diagramTemplates.find(t => t.id === templateId)
    if (!template || !excalidrawAPI) return
    
    // Clear and load new graph
    clearGraph()
    loadGraph(template.graph)
    
    // Create Excalidraw elements for all nodes
    const elements: any[] = []
    
    template.graph.nodes.forEach(node => {
      const nodeDef = nodeDefinitions[node.type]
      const [rect, text] = createExcalidrawRect(node.id, node.position.x, node.position.y, nodeDef.color, node.label)
      elements.push(rect, text)
    })
    
    // Add arrows for edges
    template.graph.edges.forEach(edge => {
      const fromNode = template.graph.nodes.find(n => n.id === edge.from)
      const toNode = template.graph.nodes.find(n => n.id === edge.to)
      
      if (fromNode && toNode) {
        elements.push({
          id: edge.id,
          type: 'arrow',
          x: fromNode.position.x + 140,
          y: fromNode.position.y + 40,
          width: toNode.position.x - fromNode.position.x - 140,
          height: toNode.position.y - fromNode.position.y,
          angle: 0,
          strokeColor: '#888888',
          backgroundColor: 'transparent',
          fillStyle: 'solid',
          strokeWidth: 2,
          strokeStyle: edge.isValid ? 'solid' : 'dashed',
          roughness: 0,
          opacity: 100,
          groupIds: [],
          frameId: null,
          index: `a${Date.now() + 2}`,
          roundness: { type: 2 },
          seed: Math.floor(Math.random() * 100000),
          version: 1,
          versionNonce: Math.floor(Math.random() * 100000),
          isDeleted: false,
          boundElements: null,
          updated: Date.now(),
          link: null,
          locked: false,
          points: [[0, 0], [toNode.position.x - fromNode.position.x - 140, toNode.position.y - fromNode.position.y]],
          startBinding: {
            elementId: fromNode.id,
            focus: 0,
            gap: 1,
            fixedPoint: null,
          },
          endBinding: {
            elementId: toNode.id,
            focus: 0,
            gap: 1,
            fixedPoint: null,
          },
          startArrowhead: null,
          endArrowhead: 'arrow',
          elbowed: false,
        })
      }
    })
    
    excalidrawAPI.updateScene({ elements })
    excalidrawAPI.scrollToContent(elements, { fitToViewport: true })
    
    toast({
      title: 'Template Loaded',
      description: `${template.name} with ${template.graph.nodes.length} components`,
    })
  }, [excalidrawAPI, clearGraph, loadGraph, toast])

  // Save to Supabase
  const handleSave = useCallback(async () => {
    if (!excalidrawAPI) return
    
    setIsSaving(true)
    try {
      const excalidrawData = exportAsJSON(excalidrawAPI)
      
      // Save to localStorage first (always)
      localStorage.setItem('design-lab-excalidraw', excalidrawData)
      
      // If user is logged in, also save to Supabase
      if (user) {
        // Convert to JSON-compatible format
        const diagramData = JSON.parse(JSON.stringify({
          graph,
          excalidraw: JSON.parse(excalidrawData),
        }))
        
        if (diagramId) {
          // Update existing
          const { error } = await supabase
            .from('designs')
            .update({
              title: diagramTitle,
              diagram_data: diagramData,
            })
            .eq('id', diagramId)
          
          if (error) throw error
        } else {
          // Create new
          const { error } = await supabase
            .from('designs')
            .insert({
              title: diagramTitle,
              diagram_data: diagramData,
              user_id: user.id,
            })
          
          if (error) throw error
        }
        
        toast({
          title: 'Saved to Cloud',
          description: 'Your diagram has been saved to your account',
        })
      } else {
        toast({
          title: 'Saved Locally',
          description: 'Sign in to save to cloud',
        })
      }
      
      markClean()
    } catch (error) {
      console.error('Save error:', error)
      toast({
        title: 'Save Failed',
        description: 'Could not save diagram. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }, [excalidrawAPI, user, diagramTitle, diagramId, graph, markClean, toast])

  // Export handlers
  const handleExportPNG = useCallback(async () => {
    if (!excalidrawAPI) return
    
    try {
      const blob = await exportToPNG(excalidrawAPI)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${diagramTitle}.png`
      a.click()
      URL.revokeObjectURL(url)
      
      toast({ title: 'Exported as PNG' })
    } catch (error) {
      toast({ title: 'Export failed', variant: 'destructive' })
    }
  }, [excalidrawAPI, diagramTitle, toast])

  const handleExportSVG = useCallback(async () => {
    if (!excalidrawAPI) return
    
    try {
      const svg = await exportAsSVG(excalidrawAPI)
      const svgString = new XMLSerializer().serializeToString(svg)
      const blob = new Blob([svgString], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${diagramTitle}.svg`
      a.click()
      URL.revokeObjectURL(url)
      
      toast({ title: 'Exported as SVG' })
    } catch (error) {
      toast({ title: 'Export failed', variant: 'destructive' })
    }
  }, [excalidrawAPI, diagramTitle, toast])

  const handleExportJSON = useCallback(() => {
    if (!excalidrawAPI) return
    
    try {
      const json = exportAsJSON(excalidrawAPI)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${diagramTitle}.excalidraw`
      a.click()
      URL.revokeObjectURL(url)
      
      toast({ title: 'Exported as JSON' })
    } catch (error) {
      toast({ title: 'Export failed', variant: 'destructive' })
    }
  }, [excalidrawAPI, diagramTitle, toast])

  const handleClear = useCallback(() => {
    if (!excalidrawAPI) return
    
    clearGraph()
    excalidrawAPI.resetScene()
    
    toast({ title: 'Canvas Cleared' })
  }, [excalidrawAPI, clearGraph, toast])

  return (
    <AppLayout>
      <div className="h-full flex flex-col">
        <CanvasHeader
          onSave={handleSave}
          onExportPNG={handleExportPNG}
          onExportSVG={handleExportSVG}
          onExportJSON={handleExportJSON}
          onLoadTemplate={handleLoadTemplate}
          onClear={handleClear}
          isSaving={isSaving}
        />
        
        <div className="flex-1 flex overflow-hidden">
          <ComponentSidebar onAddNode={handleAddNode} />
          
          <ExcalidrawCanvas
            excalidrawAPI={excalidrawAPI}
            setExcalidrawAPI={setExcalidrawAPI}
            onDrop={handleDrop}
          />
          
          <PropertiesPanel />
        </div>
      </div>
    </AppLayout>
  )
}
