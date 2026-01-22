import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { nodesByCategory, categoryLabels } from '../data/nodeDefinitions'
import { nodeIcons } from './icons'
import { NodeType } from '../types'
import { useDesignLabStore } from '../store/useDesignLabStore'

interface ComponentSidebarProps {
  onAddNode: (type: NodeType) => void
}

export function ComponentSidebar({ onAddNode }: ComponentSidebarProps) {
  const { graph } = useDesignLabStore()
  
  // Count nodes by type
  const nodeCounts = graph.nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-lg">Components</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Drag or click to add
        </p>
      </div>
      
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-6">
          {Object.entries(nodesByCategory).map(([category, nodes]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {categoryLabels[category] || category}
              </h3>
              <div className="space-y-1">
                {nodes.map((node) => {
                  const Icon = nodeIcons[node.nodeType]
                  const count = nodeCounts[node.nodeType] || 0
                  
                  return (
                    <Tooltip key={node.nodeType} delayDuration={300}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-3 h-10 px-2 hover:bg-accent"
                          onClick={() => onAddNode(node.nodeType)}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('application/x-node-type', node.nodeType)
                            e.dataTransfer.effectAllowed = 'copy'
                          }}
                        >
                          <div 
                            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                            style={{ backgroundColor: node.color + '20' }}
                          >
                            <Icon 
                              className="w-4 h-4" 
                              style={{ color: node.color }}
                            />
                          </div>
                          <span className="text-sm font-medium truncate flex-1 text-left">
                            {node.label}
                          </span>
                          {count > 0 && (
                            <Badge variant="secondary" className="text-xs h-5 px-1.5">
                              {count}
                            </Badge>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="font-medium mb-1">{node.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {node.description}
                        </p>
                        {node.tips && node.tips.length > 0 && (
                          <ul className="mt-2 text-xs space-y-1">
                            {node.tips.slice(0, 2).map((tip, i) => (
                              <li key={i} className="text-muted-foreground">
                                • {tip}
                              </li>
                            ))}
                          </ul>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
