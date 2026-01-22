import { Progress } from "@/components/ui/progress"
import { Trophy, Target, BookOpen } from "lucide-react"

interface RoadmapProgressProps {
  completedCount: number
  totalCount: number
}

export function RoadmapProgress({ completedCount, totalCount }: RoadmapProgressProps) {
  const percentage = Math.round((completedCount / totalCount) * 100)
  
  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Your Progress</h3>
            <p className="text-sm text-muted-foreground">Keep learning to master system design</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gradient">{percentage}%</div>
          <p className="text-xs text-muted-foreground">{completedCount} of {totalCount} completed</p>
        </div>
      </div>
      
      <Progress value={percentage} className="h-3 mb-4" />
      
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-green-600 dark:text-green-400 mb-1">
            <Trophy className="w-4 h-4" />
            <span className="font-semibold">{completedCount}</span>
          </div>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="text-center border-x border-border">
          <div className="flex items-center justify-center gap-1.5 text-primary mb-1">
            <BookOpen className="w-4 h-4" />
            <span className="font-semibold">{totalCount - completedCount}</span>
          </div>
          <p className="text-xs text-muted-foreground">Remaining</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
            <span className="font-semibold">{totalCount}</span>
          </div>
          <p className="text-xs text-muted-foreground">Total Topics</p>
        </div>
      </div>
    </div>
  )
}
