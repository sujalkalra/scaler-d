import { useState, useEffect, useMemo } from "react"
import { 
  Globe, 
  Server, 
  Database, 
  Zap, 
  Shield, 
  MessageSquare,
  Cpu,
  Layers,
  Brain
} from "lucide-react"
import { RoadmapProgress } from "./RoadmapProgress"
import { RoadmapSection } from "./RoadmapSection"
import { RoadmapCard } from "./RoadmapCard"
import { roadmapData } from "./roadmapData"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

// Category configuration with icons
const categoryConfig: Record<string, { icon: React.ReactNode; order: number }> = {
  "Communication": { icon: <MessageSquare className="w-5 h-5" />, order: 1 },
  "Infrastructure": { icon: <Server className="w-5 h-5" />, order: 2 },
  "Architecture": { icon: <Layers className="w-5 h-5" />, order: 3 },
  "Database": { icon: <Database className="w-5 h-5" />, order: 4 },
  "Performance": { icon: <Zap className="w-5 h-5" />, order: 5 },
  "Security": { icon: <Shield className="w-5 h-5" />, order: 6 },
  "Theory": { icon: <Brain className="w-5 h-5" />, order: 7 },
  "Data Structures": { icon: <Cpu className="w-5 h-5" />, order: 8 },
  "Processing": { icon: <Globe className="w-5 h-5" />, order: 9 },
}

export function RoadmapList() {
  const { user } = useAuth()
  const [completedNodes, setCompletedNodes] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  // Fetch progress from database
  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) {
        // Load from localStorage for non-authenticated users
        const saved = localStorage.getItem("roadmap-progress")
        if (saved) {
          setCompletedNodes(new Set(JSON.parse(saved)))
        }
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

  // Group nodes by category
  const groupedNodes = useMemo(() => {
    const groups: Record<string, typeof roadmapData> = {}
    
    roadmapData.forEach(node => {
      if (!groups[node.category]) {
        groups[node.category] = []
      }
      groups[node.category].push(node)
    })
    
    // Sort categories by order
    return Object.entries(groups)
      .sort(([a], [b]) => {
        const orderA = categoryConfig[a]?.order || 99
        const orderB = categoryConfig[b]?.order || 99
        return orderA - orderB
      })
  }, [])

  // Find the current (first incomplete) node
  const currentNodeId = useMemo(() => {
    for (const node of roadmapData) {
      if (!completedNodes.has(node.id)) {
        return node.id
      }
    }
    return null
  }, [completedNodes])

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
      
      // Save to localStorage for non-authenticated users
      if (!user) {
        localStorage.setItem("roadmap-progress", JSON.stringify([...newSet]))
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

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-20 rounded-xl" />
        <div className="space-y-3 pl-10">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    )
  }

  let stepCounter = 0

  return (
    <div>
      <RoadmapProgress 
        completedCount={completedNodes.size} 
        totalCount={roadmapData.length} 
      />
      
      <div className="space-y-2">
        {groupedNodes.map(([category, nodes], catIndex) => {
          const categoryCompleted = nodes.filter(n => completedNodes.has(n.id)).length
          const config = categoryConfig[category] || { icon: <Layers className="w-5 h-5" />, order: 99 }
          
          return (
            <RoadmapSection
              key={category}
              title={category}
              icon={config.icon}
              count={nodes.length}
              completedCount={categoryCompleted}
              defaultOpen={catIndex < 3}
            >
              {nodes.map((node) => {
                stepCounter++
                return (
                  <RoadmapCard
                    key={node.id}
                    node={node}
                    stepNumber={stepCounter}
                    isCompleted={completedNodes.has(node.id)}
                    isCurrent={node.id === currentNodeId}
                    onToggleComplete={() => toggleComplete(node.id)}
                  />
                )
              })}
            </RoadmapSection>
          )
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
        <h4 className="font-medium mb-4">How to use this roadmap</h4>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
            <span className="text-muted-foreground">Completed topic</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">▶</div>
            <span className="text-muted-foreground">Current topic</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted border-2 border-border flex items-center justify-center text-muted-foreground text-xs">5</div>
            <span className="text-muted-foreground">Upcoming topic</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">Click the circle to mark complete</span>
          </div>
        </div>
      </div>
    </div>
  )
}
