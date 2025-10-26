import { AppLayout } from "@/components/layout/AppLayout"
import { RoadmapTree } from "@/components/roadmap/RoadmapTree"

export default function Roadmap() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
              System Design Roadmap
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Master system design concepts step by step. Follow this interactive roadmap
              to learn 30 essential topics from APIs to Stream Processing.
            </p>
          </div>

          {/* Roadmap Tree */}
          <RoadmapTree />
        </div>
      </div>
    </AppLayout>
  )
}
