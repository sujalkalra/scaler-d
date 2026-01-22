import { AppLayout } from "@/components/layout/AppLayout"
import { RoadmapList } from "@/components/roadmap/RoadmapList"
import { BookOpen, Sparkles } from "lucide-react"

export default function Roadmap() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            30 Essential Topics
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            System Design <span className="text-gradient">Roadmap</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Master system design step by step. Follow this curated learning path 
            from fundamentals to advanced distributed systems concepts.
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>Self-paced learning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Track your progress</span>
            </div>
          </div>
        </div>

        {/* Roadmap List */}
        <RoadmapList />
      </div>
    </AppLayout>
  )
}
