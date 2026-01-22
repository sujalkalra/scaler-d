import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  DesignLabState, 
  SemanticNode, 
  SemanticEdge, 
  SemanticGraph, 
  NodeType, 
  ConnectionType 
} from '../types'
import { nodeDefinitions } from '../data/nodeDefinitions'

const generateId = () => `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const createInitialState = () => ({
  graph: {
    nodes: [],
    edges: [],
  } as SemanticGraph,
  selectedNodeId: null,
  hoveredNodeId: null,
  isConnecting: false,
  connectionSource: null,
  diagramId: null,
  diagramTitle: 'Untitled Diagram',
  isDirty: false,
  lastSaved: null,
})

export const useDesignLabStore = create<DesignLabState>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      addNode: (type: NodeType, position: { x: number; y: number }) => {
        const definition = nodeDefinitions[type]
        const newNode: SemanticNode = {
          id: generateId(),
          type,
          label: definition.label,
          config: {},
          position,
          createdAt: Date.now(),
        }
        
        set(state => ({
          graph: {
            ...state.graph,
            nodes: [...state.graph.nodes, newNode],
          },
          isDirty: true,
        }))
        
        return newNode
      },

      removeNode: (id: string) => {
        set(state => ({
          graph: {
            nodes: state.graph.nodes.filter(n => n.id !== id),
            edges: state.graph.edges.filter(e => e.from !== id && e.to !== id),
          },
          selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
          isDirty: true,
        }))
      },

      updateNodePosition: (id: string, position: { x: number; y: number }) => {
        set(state => ({
          graph: {
            ...state.graph,
            nodes: state.graph.nodes.map(n => 
              n.id === id ? { ...n, position } : n
            ),
          },
          isDirty: true,
        }))
      },

      updateNodeLabel: (id: string, label: string) => {
        set(state => ({
          graph: {
            ...state.graph,
            nodes: state.graph.nodes.map(n => 
              n.id === id ? { ...n, label } : n
            ),
          },
          isDirty: true,
        }))
      },

      addEdge: (fromId: string, toId: string, type: ConnectionType = 'http') => {
        const { graph, validateConnection } = get()
        
        // Check if edge already exists
        const edgeExists = graph.edges.some(
          e => (e.from === fromId && e.to === toId) || (e.from === toId && e.to === fromId)
        )
        if (edgeExists) return null
        
        const validation = validateConnection(fromId, toId)
        
        const newEdge: SemanticEdge = {
          id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          from: fromId,
          to: toId,
          type,
          isValid: validation.valid,
          validationMessage: validation.message,
        }
        
        set(state => ({
          graph: {
            ...state.graph,
            edges: [...state.graph.edges, newEdge],
          },
          isDirty: true,
        }))
        
        return newEdge
      },

      removeEdge: (id: string) => {
        set(state => ({
          graph: {
            ...state.graph,
            edges: state.graph.edges.filter(e => e.id !== id),
          },
          isDirty: true,
        }))
      },

      selectNode: (id: string | null) => {
        set({ selectedNodeId: id })
      },

      hoverNode: (id: string | null) => {
        set({ hoveredNodeId: id })
      },

      setDiagramTitle: (title: string) => {
        set({ diagramTitle: title, isDirty: true })
      },

      markDirty: () => {
        set({ isDirty: true })
      },

      markClean: () => {
        set({ isDirty: false, lastSaved: Date.now() })
      },

      loadGraph: (graph: SemanticGraph) => {
        set({ graph, isDirty: false })
      },

      clearGraph: () => {
        set({
          ...createInitialState(),
          isDirty: true,
        })
      },

      validateConnection: (fromId: string, toId: string) => {
        const { graph } = get()
        
        const fromNode = graph.nodes.find(n => n.id === fromId)
        const toNode = graph.nodes.find(n => n.id === toId)
        
        if (!fromNode || !toNode) {
          return { valid: false, message: 'Invalid nodes' }
        }
        
        const fromDef = nodeDefinitions[fromNode.type]
        const toDef = nodeDefinitions[toNode.type]
        
        // Check if connection is explicitly forbidden
        if (fromDef.constraints.cannotConnectTo.includes(toNode.type)) {
          return {
            valid: false,
            message: `${fromDef.label} should not connect directly to ${toDef.label}. ${getConnectionAdvice(fromNode.type, toNode.type)}`,
          }
        }
        
        // Check if connection is in allowed list
        if (fromDef.constraints.canConnectTo.length > 0 && 
            !fromDef.constraints.canConnectTo.includes(toNode.type)) {
          return {
            valid: false,
            message: `${fromDef.label} typically connects to: ${fromDef.constraints.canConnectTo.map(t => nodeDefinitions[t].label).join(', ')}`,
          }
        }
        
        return { valid: true, message: 'Valid connection' }
      },
    }),
    {
      name: 'design-lab-storage',
      partialize: (state) => ({
        graph: state.graph,
        diagramTitle: state.diagramTitle,
        diagramId: state.diagramId,
      }),
    }
  )
)

// Helper function for connection advice
function getConnectionAdvice(from: NodeType, to: NodeType): string {
  const advice: Record<string, string> = {
    'client-database': 'Use an API server or API gateway as an intermediary for security.',
    'cdn-database': 'CDN should connect to API servers or object storage, not directly to databases.',
    'cdn-cache': 'CDN caches at the edge level; Redis cache is for application-level caching.',
  }
  
  return advice[`${from}-${to}`] || ''
}
