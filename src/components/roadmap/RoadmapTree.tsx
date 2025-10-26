import { useState } from "react"
import { RoadmapNode } from "./RoadmapNode"
import { roadmapData } from "./roadmapData"

export function RoadmapTree() {
  const [completedNodes, setCompletedNodes] = useState<Set<number>>(new Set())

  const toggleComplete = (id: number) => {
    setCompletedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="relative">
      {/* Progress Stats */}
      <div className="mb-8 flex justify-center gap-4 flex-wrap">
        <div className="bg-card border border-border rounded-lg px-6 py-3">
          <div className="text-sm text-muted-foreground">Progress</div>
          <div className="text-2xl font-bold text-gradient">
            {completedNodes.size} / {roadmapData.length}
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg px-6 py-3">
          <div className="text-sm text-muted-foreground">Completion</div>
          <div className="text-2xl font-bold text-gradient">
            {Math.round((completedNodes.size / roadmapData.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Roadmap Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {roadmapData.map((node) => (
          <RoadmapNode
            key={node.id}
            node={node}
            isCompleted={completedNodes.has(node.id)}
            onToggleComplete={() => toggleComplete(node.id)}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-12 flex justify-center gap-6 flex-wrap text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-primary"></div>
          <span className="text-muted-foreground">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-border bg-card"></div>
          <span className="text-muted-foreground">Not Started</span>
        </div>
      </div>
    </div>
  )
}
