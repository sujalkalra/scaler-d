import { Link } from "react-router-dom"
import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RoadmapNodeProps {
  node: {
    id: number
    title: string
    slug: string
    category: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
  }
  isCompleted: boolean
  onToggleComplete: () => void
  viewMode?: "grid" | "list"
}

export function RoadmapNode({ node, isCompleted, onToggleComplete, viewMode = "grid" }: RoadmapNodeProps) {
  const difficultyColors = {
    Beginner: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    Advanced: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  }

  if (viewMode === "list") {
    return (
      <div
        onDoubleClick={onToggleComplete}
        className={cn(
          "group flex items-center gap-4 p-4 rounded-lg border bg-card transition-all duration-300 hover:shadow-md cursor-pointer",
          isCompleted && "border-primary bg-primary/5"
        )}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggleComplete() }}
          className="transition-transform hover:scale-110"
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />}
        </button>

        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-sm font-bold text-primary">{node.id}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{node.title}</h3>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-xs">{node.category}</Badge>
            <Badge variant="outline" className={cn("text-xs", difficultyColors[node.difficulty])}>{node.difficulty}</Badge>
          </div>
        </div>

        <Button variant="outline" size="sm" className="flex-shrink-0 group/btn" asChild>
          <Link to={`/roadmap/${node.slug}`} className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            Learn More
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <Card 
      onDoubleClick={onToggleComplete}
      className={cn(
        "group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden cursor-pointer",
        isCompleted && "border-primary bg-primary/5 shadow-primary/10"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <button
        onClick={(e) => { e.stopPropagation(); onToggleComplete() }}
        className="absolute top-3 right-3 z-10 transition-transform hover:scale-110"
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      >
        {isCompleted ? <CheckCircle2 className="w-6 h-6 text-primary drop-shadow-sm" /> : <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />}
      </button>

      <CardHeader className="pb-3">
        <div className="text-3xl font-bold text-primary/20 group-hover:text-primary/30 transition-colors">{node.id}</div>
        <CardTitle className="text-lg leading-tight mt-2 group-hover:text-primary transition-colors">{node.title}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">{node.category}</Badge>
          <Badge variant="outline" className={cn("text-xs", difficultyColors[node.difficulty])}>{node.difficulty}</Badge>
        </div>

        <Button variant="outline" size="sm" className="w-full group/btn relative z-10" asChild>
          <Link to={`/roadmap/${node.slug}`} className="flex items-center justify-center gap-2">
            Learn More
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
