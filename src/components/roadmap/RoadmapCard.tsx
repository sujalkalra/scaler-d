import { Link } from "react-router-dom"
import { CheckCircle2, Circle, Clock, ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { roadmapArticles } from "@/content/roadmap-articles"

interface RoadmapCardProps {
  node: {
    id: number
    title: string
    slug: string
    category: string
    difficulty: "Beginner" | "Intermediate" | "Advanced"
  }
  stepNumber: number
  isCompleted: boolean
  isCurrent: boolean
  onToggleComplete: () => void
}

export function RoadmapCard({ 
  node, 
  stepNumber, 
  isCompleted, 
  isCurrent,
  onToggleComplete 
}: RoadmapCardProps) {
  const article = roadmapArticles[node.slug]
  const readTime = article?.readTime || 10
  const excerpt = article?.excerpt || ""
  
  const difficultyConfig = {
    Beginner: { 
      color: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
      dot: "bg-green-500"
    },
    Intermediate: { 
      color: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
      dot: "bg-amber-500"
    },
    Advanced: { 
      color: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
      dot: "bg-red-500"
    },
  }

  return (
    <div className={cn(
      "group relative flex gap-4 p-4 rounded-xl border bg-card transition-all duration-300",
      "hover:shadow-lg hover:border-primary/30",
      isCompleted && "bg-green-500/5 border-green-500/20",
      isCurrent && !isCompleted && "border-primary shadow-md ring-2 ring-primary/20"
    )}>
      {/* Step indicator */}
      <div className="flex flex-col items-center gap-2">
        <button
          onClick={onToggleComplete}
          className={cn(
            "relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
            "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            isCompleted 
              ? "bg-green-500 text-white shadow-lg shadow-green-500/30" 
              : isCurrent 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-muted border-2 border-border text-muted-foreground hover:border-primary hover:text-primary"
          )}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : isCurrent ? (
            <Play className="w-4 h-4 ml-0.5" />
          ) : (
            <span className="text-sm font-bold">{stepNumber}</span>
          )}
        </button>
        
        {/* Vertical connector line */}
        <div className="flex-1 w-0.5 bg-border rounded-full min-h-[20px]" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 pb-2">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Step {stepNumber}
              </span>
              {isCurrent && !isCompleted && (
                <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  Continue here →
                </span>
              )}
            </div>
            <h3 className={cn(
              "font-semibold text-lg leading-tight transition-colors",
              "group-hover:text-primary",
              isCompleted && "text-muted-foreground line-through decoration-2"
            )}>
              {node.title}
            </h3>
          </div>
        </div>
        
        {excerpt && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-xs", difficultyConfig[node.difficulty].color)}>
              <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", difficultyConfig[node.difficulty].dot)} />
              {node.difficulty}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min
            </span>
          </div>
          
          <Button 
            variant={isCurrent && !isCompleted ? "default" : "outline"} 
            size="sm" 
            className="shrink-0 group/btn" 
            asChild
          >
            <Link to={`/roadmap/${node.slug}`} className="flex items-center gap-1.5">
              {isCompleted ? "Review" : isCurrent ? "Start" : "Learn"}
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
