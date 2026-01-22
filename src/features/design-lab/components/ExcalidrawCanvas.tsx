import { useEffect, useRef, useState, useCallback } from 'react'
import { Excalidraw, exportToBlob, exportToSvg, serializeAsJSON } from '@excalidraw/excalidraw'
import { useDesignLabStore } from '../store/useDesignLabStore'
import { useToast } from '@/hooks/use-toast'

interface ExcalidrawCanvasProps {
  excalidrawAPI: any
  setExcalidrawAPI: (api: any) => void
  onDrop: (e: React.DragEvent) => void
}

export function ExcalidrawCanvas({ 
  excalidrawAPI, 
  setExcalidrawAPI,
  onDrop 
}: ExcalidrawCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { graph, updateNodePosition, addEdge } = useDesignLabStore()
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
  const handleChange = useCallback((elements: readonly any[]) => {
    // Sync positions back to store
    elements.forEach((el: any) => {
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

  return (
    <div 
      ref={containerRef}
      className="flex-1 relative"
      style={{ width: '100%', height: '100%', minHeight: 0 }}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div 
        className="excalidraw-wrapper"
        style={{ 
          width: '100%', 
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Excalidraw
          excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
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
    </div>
  )
}

// Export utilities
export async function exportToPNG(api: any): Promise<Blob> {
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

export async function exportAsSVG(api: any): Promise<SVGSVGElement> {
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

export function exportAsJSON(api: any): string {
  const elements = api.getSceneElements()
  const appState = api.getAppState()
  const files = api.getFiles()
  
  return serializeAsJSON(elements, appState, files, 'local')
}
