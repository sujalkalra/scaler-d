import { ReactNode, useState } from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const allComplete = completedCount === count
  
  return (
    <div className="mb-6">
      {/* Header/Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left"
      >
        <div className={cn(
          "flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-muted/50 transition-all duration-200 group",
          allComplete && "border-green-500/30 bg-green-500/5"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg transition-colors duration-200",
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
            <ChevronRight 
              className={cn(
                "w-5 h-5 text-muted-foreground transition-transform duration-300 ease-out",
                isOpen && "rotate-90"
              )} 
            />
          </div>
        </div>
      </button>
      
      {/* Animated Content */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="pt-4 pl-4 border-l-2 border-border ml-6 space-y-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
