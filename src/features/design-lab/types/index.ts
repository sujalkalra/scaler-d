// System Design Node Types
export type NodeType = 
  | 'client'
  | 'cdn'
  | 'load_balancer'
  | 'api_gateway'
  | 'api_server'
  | 'auth_service'
  | 'database'
  | 'cache'
  | 'message_queue'
  | 'object_storage'
  | 'search_engine'
  | 'notification_service'
  | 'analytics'
  | 'logging'

export type ConnectionType = 'http' | 'https' | 'grpc' | 'websocket' | 'async' | 'tcp'

export interface ConnectionConstraints {
  canConnectTo: NodeType[]
  cannotConnectTo: NodeType[]
  maxOutgoing?: number
  maxIncoming?: number
}

export interface NodeMetadata {
  nodeType: NodeType
  label: string
  description: string
  icon: string
  color: string
  category: 'client' | 'network' | 'compute' | 'storage' | 'messaging' | 'monitoring'
  constraints: ConnectionConstraints
  learnMore?: string
  tips?: string[]
}

// Semantic Graph State
export interface SemanticNode {
  id: string
  type: NodeType
  label: string
  config: Record<string, unknown>
  position: { x: number; y: number }
  createdAt: number
}

export interface SemanticEdge {
  id: string
  from: string
  to: string
  type: ConnectionType
  label?: string
  isValid: boolean
  validationMessage?: string
}

export interface SemanticGraph {
  nodes: SemanticNode[]
  edges: SemanticEdge[]
}

// Template Types
export interface DiagramTemplate {
  id: string
  name: string
  description: string
  category: 'basic' | 'intermediate' | 'advanced'
  thumbnail?: string
  graph: SemanticGraph
}

// Store State
export interface DesignLabState {
  // Semantic state
  graph: SemanticGraph
  
  // UI state
  selectedNodeId: string | null
  hoveredNodeId: string | null
  isConnecting: boolean
  connectionSource: string | null
  
  // Persistence
  diagramId: string | null
  diagramTitle: string
  isDirty: boolean
  lastSaved: number | null
  
  // Actions
  addNode: (type: NodeType, position: { x: number; y: number }) => SemanticNode
  removeNode: (id: string) => void
  updateNodePosition: (id: string, position: { x: number; y: number }) => void
  updateNodeLabel: (id: string, label: string) => void
  
  addEdge: (fromId: string, toId: string, type?: ConnectionType) => SemanticEdge | null
  removeEdge: (id: string) => void
  
  selectNode: (id: string | null) => void
  hoverNode: (id: string | null) => void
  
  setDiagramTitle: (title: string) => void
  markDirty: () => void
  markClean: () => void
  
  loadGraph: (graph: SemanticGraph) => void
  clearGraph: () => void
  
  // Computed
  validateConnection: (fromId: string, toId: string) => { valid: boolean; message: string }
}

// Diagram save format
export interface SavedDiagram {
  id: string
  title: string
  graph: SemanticGraph
  excalidrawData: unknown
  createdAt: string
  updatedAt: string
  userId?: string
}
