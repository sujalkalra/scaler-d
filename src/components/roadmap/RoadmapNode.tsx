import { ExternalLink, CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface RoadmapNodeProps {
  node: {
    id: number
    title: string
    url: string
    category: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
  }
  isCompleted: boolean
  onToggleComplete: () => void
}

export function RoadmapNode({ node, isCompleted, onToggleComplete }: RoadmapNodeProps) {
  const difficultyColors = {
    Beginner: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    Intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    Advanced: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  }

  return (
    <Card 
      className={cn(
        "group hover:shadow-lg transition-all duration-300 hover:scale-105 relative overflow-hidden",
        isCompleted && "border-primary bg-primary/5"
      )}
    >
      {/* Completion indicator */}
      <button
        onClick={onToggleComplete}
        className="absolute top-3 right-3 z-10 transition-transform hover:scale-110"
        aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
      >
        {isCompleted ? (
          <CheckCircle2 className="w-6 h-6 text-primary" />
        ) : (
          <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
        )}
      </button>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2 pr-8">
          <div className="text-3xl font-bold text-primary/20">{node.id}</div>
        </div>
        <CardTitle className="text-lg leading-tight mt-2">
          {node.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {node.category}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn("text-xs", difficultyColors[node.difficulty])}
          >
            {node.difficulty}
          </Badge>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full group/btn"
          asChild
        >
          <a 
            href={node.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            Learn More
            <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
