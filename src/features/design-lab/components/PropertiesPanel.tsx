import { Info, AlertTriangle, ExternalLink, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useDesignLabStore } from '../store/useDesignLabStore'
import { nodeDefinitions } from '../data/nodeDefinitions'
import { nodeIcons } from './icons'
import { Link } from 'react-router-dom'

export function PropertiesPanel() {
  const { 
    graph, 
    selectedNodeId, 
    selectNode, 
    removeNode,
    updateNodeLabel 
  } = useDesignLabStore()

  const selectedNode = selectedNodeId 
    ? graph.nodes.find(n => n.id === selectedNodeId) 
    : null
  
  const nodeDef = selectedNode 
    ? nodeDefinitions[selectedNode.type] 
    : null

  // Get connections for selected node
  const nodeEdges = selectedNodeId 
    ? graph.edges.filter(e => e.from === selectedNodeId || e.to === selectedNodeId)
    : []

  const invalidEdges = nodeEdges.filter(e => !e.isValid)

  if (!selectedNode || !nodeDef) {
    return (
      <div className="w-72 bg-card border-l border-border p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="w-4 h-4" />
          <span className="text-sm">Select a component to see details</span>
        </div>
        
        {/* Show diagram-level warnings */}
        {graph.edges.filter(e => !e.isValid).length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3 text-destructive flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Connection Warnings
            </h3>
            <div className="space-y-2">
              {graph.edges.filter(e => !e.isValid).map(edge => {
                const fromNode = graph.nodes.find(n => n.id === edge.from)
                const toNode = graph.nodes.find(n => n.id === edge.to)
                return (
                  <div 
                    key={edge.id}
                    className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs"
                  >
                    <p className="font-medium text-destructive">
                      {fromNode?.label} → {toNode?.label}
                    </p>
                    <p className="text-muted-foreground mt-1">
                      {edge.validationMessage}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  const Icon = nodeIcons[selectedNode.type]

  return (
    <div className="w-72 bg-card border-l border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: nodeDef.color + '20' }}
            >
              <Icon className="w-5 h-5" style={{ color: nodeDef.color }} />
            </div>
            <div>
              <input
                type="text"
                value={selectedNode.label}
                onChange={(e) => updateNodeLabel(selectedNode.id, e.target.value)}
                className="font-semibold text-sm bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1 -ml-1"
              />
              <Badge variant="outline" className="text-xs mt-1">
                {nodeDef.category}
              </Badge>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => selectNode(null)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Description
            </h4>
            <p className="text-sm text-foreground/80">
              {nodeDef.description}
            </p>
          </div>

          {/* Learn More Link */}
          {nodeDef.learnMore && (
            <Link 
              to={nodeDef.learnMore}
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="w-4 h-4" />
              Learn more about {nodeDef.label}
            </Link>
          )}

          <Separator />

          {/* Connection Warnings for this node */}
          {invalidEdges.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-destructive uppercase mb-2 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Warnings
              </h4>
              <div className="space-y-2">
                {invalidEdges.map(edge => (
                  <div 
                    key={edge.id}
                    className="p-2 bg-destructive/10 border border-destructive/20 rounded text-xs"
                  >
                    {edge.validationMessage}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {nodeDef.tips && nodeDef.tips.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Best Practices
              </h4>
              <ul className="space-y-2">
                {nodeDef.tips.map((tip, i) => (
                  <li key={i} className="text-sm text-foreground/80 flex gap-2">
                    <span className="text-primary">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* Connections */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Connections ({nodeEdges.length})
            </h4>
            {nodeEdges.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No connections yet. Draw arrows to connect components.
              </p>
            ) : (
              <div className="space-y-1">
                {nodeEdges.map(edge => {
                  const isOutgoing = edge.from === selectedNode.id
                  const otherId = isOutgoing ? edge.to : edge.from
                  const otherNode = graph.nodes.find(n => n.id === otherId)
                  
                  return (
                    <div 
                      key={edge.id}
                      className={`text-xs p-2 rounded flex items-center justify-between ${
                        edge.isValid ? 'bg-muted/50' : 'bg-destructive/10'
                      }`}
                    >
                      <span>
                        {isOutgoing ? '→' : '←'} {otherNode?.label || 'Unknown'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {edge.type}
                      </Badge>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recommended Connections */}
          <div>
            <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
              Can Connect To
            </h4>
            <div className="flex flex-wrap gap-1">
              {nodeDef.constraints.canConnectTo.map(type => (
                <Badge key={type} variant="secondary" className="text-xs">
                  {nodeDefinitions[type].label}
                </Badge>
              ))}
              {nodeDef.constraints.canConnectTo.length === 0 && (
                <span className="text-xs text-muted-foreground">
                  Terminal node (no outgoing)
                </span>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Delete Button */}
      <div className="p-4 border-t border-border">
        <Button 
          variant="destructive" 
          size="sm" 
          className="w-full"
          onClick={() => {
            removeNode(selectedNode.id)
            selectNode(null)
          }}
        >
          Delete Component
        </Button>
      </div>
    </div>
  )
}
