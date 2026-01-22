import { ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface RoadmapSectionProps {
  title: string
  icon: ReactNode
  count: number
  completedCount: number
  defaultOpen?: boolean
  children: ReactNode
}

export function RoadmapSection({ 
  title, 
  icon, 
  count, 
  completedCount, 
  defaultOpen = true,
  children 
}: RoadmapSectionProps) {
  const allComplete = completedCount === count
  
  return (
    <Collapsible defaultOpen={defaultOpen} className="mb-6">
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          "flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors group",
          allComplete && "border-green-500/30 bg-green-500/5"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              allComplete ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-primary/10 text-primary"
            )}>
              {icon}
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {completedCount} of {count} completed
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {allComplete && (
              <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                Complete ✓
              </span>
            )}
            <ChevronDown className="w-5 h-5 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform" />
          </div>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="pt-4 pl-4 border-l-2 border-border ml-6 space-y-3">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
