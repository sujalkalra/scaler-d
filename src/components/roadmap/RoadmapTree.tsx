import { useState, useEffect } from "react"
import { LayoutGrid, List } from "lucide-react"
import { RoadmapNode } from "./RoadmapNode"
import { roadmapData } from "./roadmapData"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export function RoadmapTree() {
  const { user } = useAuth()
  const [completedNodes, setCompletedNodes] = useState<Set<number>>(new Set())
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)

  // Fetch progress from database
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("roadmap_progress")
        .select("node_id, completed")
        .eq("user_id", user.id)

      if (error) {
        console.error("Error fetching progress:", error)
        toast.error("Failed to load your progress")
      } else if (data) {
        const completed = new Set(
          data.filter(item => item.completed).map(item => item.node_id)
        )
        setCompletedNodes(completed)
      }
      setLoading(false)
    }

    fetchProgress()
  }, [user])

  const toggleComplete = async (id: number) => {
    const wasCompleted = completedNodes.has(id)
    
    // Optimistically update UI
    setCompletedNodes(prev => {
      const newSet = new Set(prev)
      if (wasCompleted) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })

    // Save to database if user is logged in
    if (user) {
      const { error } = await supabase
        .from("roadmap_progress")
        .upsert(
          {
            user_id: user.id,
            node_id: id,
            completed: !wasCompleted
          },
          { onConflict: "user_id,node_id" }
        )

      if (error) {
        console.error("Error saving progress:", error)
        toast.error("Failed to save progress")
        // Revert on error
        setCompletedNodes(prev => {
          const newSet = new Set(prev)
          if (wasCompleted) {
            newSet.add(id)
          } else {
            newSet.delete(id)
          }
          return newSet
        })
      }
    }
  }

  return (
    <div className="relative">
      {/* Progress Stats & View Toggle */}
      <div className="mb-8 flex justify-between items-center gap-4 flex-wrap">
        <div className="flex gap-4 flex-wrap">
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

        {/* View Mode Toggle */}
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as "grid" | "list")}>
          <ToggleGroupItem value="grid" aria-label="Grid view">
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Roadmap Layout */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading your progress...
        </div>
      ) : (
        <div className={viewMode === "grid" 
          ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
          : "flex flex-col gap-3"}>
          {roadmapData.map((node) => (
            <RoadmapNode
              key={node.id}
              node={node}
              isCompleted={completedNodes.has(node.id)}
              onToggleComplete={() => toggleComplete(node.id)}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

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
