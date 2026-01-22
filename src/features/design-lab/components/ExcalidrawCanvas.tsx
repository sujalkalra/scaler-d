import { useEffect, useRef, useState, useCallback } from 'react'
import { Excalidraw, exportToBlob, exportToSvg, serializeAsJSON } from '@excalidraw/excalidraw'
import { useDesignLabStore } from '../store/useDesignLabStore'
import { nodeDefinitions } from '../data/nodeDefinitions'
import { NodeType, SemanticNode } from '../types'
import { useToast } from '@/hooks/use-toast'

interface ExcalidrawCanvasProps {
  excalidrawAPI: any
  setExcalidrawAPI: (api: any) => void
  onDrop: (e: React.DragEvent) => void
}

// Create Excalidraw element for a system design node
function createNodeElement(
  node: any,
  nodeDef: any
): any[] {
  const width = 140
  const height = 80
  
  // Create a rectangle element
  const rect: ExcalidrawElement = {
    id: node.id,
    type: 'rectangle',
    x: node.position.x,
    y: node.position.y,
    width,
    height,
    angle: 0,
    strokeColor: nodeDef.color,
    backgroundColor: nodeDef.color + '20',
    fillStyle: 'solid',
    strokeWidth: 2,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: 'a0' as any,
    roundness: { type: 3 },
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    customData: {
      nodeType: node.type,
      semanticId: node.id,
    },
  } as ExcalidrawElement

  // Create a text label
  const text: ExcalidrawElement = {
    id: `${node.id}-label`,
    type: 'text',
    x: node.position.x + width / 2,
    y: node.position.y + height / 2,
    width: width - 20,
    height: 20,
    angle: 0,
    strokeColor: nodeDef.color,
    backgroundColor: 'transparent',
    fillStyle: 'solid',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 0,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: 'a1' as any,
    roundness: null,
    seed: Math.floor(Math.random() * 100000),
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    boundElements: null,
    updated: Date.now(),
    link: null,
    locked: false,
    text: node.label,
    fontSize: 14,
    fontFamily: 1,
    textAlign: 'center',
    verticalAlign: 'middle',
    containerId: node.id,
    originalText: node.label,
    autoResize: true,
    lineHeight: 1.25,
  } as ExcalidrawElement

  return [rect, text]
}

export function ExcalidrawCanvas({ 
  excalidrawAPI, 
  setExcalidrawAPI,
  onDrop 
}: ExcalidrawCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { graph, selectNode, updateNodePosition, addEdge, markDirty } = useDesignLabStore()
  const { toast } = useToast()
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  
  // Detect theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
    
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark')
      setTheme(isDark ? 'dark' : 'light')
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    
    return () => observer.disconnect()
  }, [])

  // Handle element changes
  const handleChange = useCallback((elements: readonly ExcalidrawElement[]) => {
    // Sync positions back to store
    elements.forEach(el => {
      if (el.type === 'rectangle' && el.customData?.semanticId) {
        const node = graph.nodes.find(n => n.id === el.customData?.semanticId)
        if (node && (node.position.x !== el.x || node.position.y !== el.y)) {
          updateNodePosition(el.customData.semanticId, { x: el.x, y: el.y })
        }
      }
      
      // Detect new arrow connections
      if (el.type === 'arrow' && el.startBinding && el.endBinding) {
        const fromId = el.startBinding.elementId
        const toId = el.endBinding.elementId
        
        // Check if this creates a new edge
        const fromNode = graph.nodes.find(n => n.id === fromId)
        const toNode = graph.nodes.find(n => n.id === toId)
        
        if (fromNode && toNode) {
          const existingEdge = graph.edges.find(
            e => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
          )
          
          if (!existingEdge) {
            const newEdge = addEdge(fromId, toId)
            if (newEdge && !newEdge.isValid) {
              toast({
                title: 'Connection Warning',
                description: newEdge.validationMessage,
                variant: 'destructive',
              })
            }
          }
        }
      }
    })
  }, [graph.nodes, graph.edges, updateNodePosition, addEdge, toast])

  // Handle pointer down for selection
  const handlePointerDown = useCallback((
    activeTool: any,
    pointerDownState: any,
    event: React.PointerEvent<HTMLElement>
  ) => {
    const target = event.target as HTMLElement
    // Selection handled via onChange
  }, [])

  return (
    <div 
      ref={containerRef}
      className="flex-1 h-full relative"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        theme={theme}
        onChange={handleChange}
        UIOptions={{
          canvasActions: {
            loadScene: false,
            export: false,
            saveAsImage: false,
          },
          tools: {
            image: false,
          },
        }}
        gridModeEnabled={true}
        zenModeEnabled={false}
        viewModeEnabled={false}
      />
    </div>
  )
}

// Export utilities
export async function exportToPNG(api: ExcalidrawImperativeAPI): Promise<Blob> {
  const elements = api.getSceneElements()
  const appState = api.getAppState()
  
  return await exportToBlob({
    elements,
    appState: {
      ...appState,
      exportWithDarkMode: appState.theme === 'dark',
    },
    files: api.getFiles(),
    getDimensions: () => ({ width: 1920, height: 1080, scale: 2 }),
  })
}

export async function exportAsSVG(api: ExcalidrawImperativeAPI): Promise<SVGSVGElement> {
  const elements = api.getSceneElements()
  const appState = api.getAppState()
  
  return await exportToSvg({
    elements,
    appState: {
      ...appState,
      exportWithDarkMode: appState.theme === 'dark',
    },
    files: api.getFiles(),
  })
}

export function exportAsJSON(api: ExcalidrawImperativeAPI): string {
  const elements = api.getSceneElements()
  const appState = api.getAppState()
  const files = api.getFiles()
  
  return serializeAsJSON(elements, appState, files, 'local')
}
