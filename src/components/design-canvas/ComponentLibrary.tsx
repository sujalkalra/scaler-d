import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DesignComponent } from "./types"

interface ComponentLibraryProps {
  components: DesignComponent[]
  selectedComponent: number | null
  onComponentSelect: (id: number) => void
  onDragStart: (e: React.DragEvent, componentId: number) => void
}

export function ComponentLibrary({ 
  components, 
  selectedComponent, 
  onComponentSelect, 
  onDragStart 
}: ComponentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const categories = [...new Set(components.map(c => c.category))]

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <h2 className="text-lg font-semibold mb-2">Component Library</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Drag components to build your system design
        </p>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {categories.map(category => {
          const categoryComponents = filteredComponents.filter(c => c.category === category)
          if (categoryComponents.length === 0) return null

          return (
            <div key={category} className="p-6 border-b border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  {category}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {categoryComponents.length}
                </Badge>
              </div>
              
              <div className="grid gap-2">
                {categoryComponents.map((component) => {
                  const Icon = component.icon
                  return (
                    <div
                      key={component.id}
                      className={`
                        p-3 rounded-lg border-2 border-dashed cursor-move group
                        transition-all duration-200 hover:scale-[1.02]
                        ${selectedComponent === component.id 
                          ? 'border-primary bg-primary-light shadow-soft' 
                          : 'border-border hover:border-primary/50 hover:bg-accent'
                        }
                      `}
                      onClick={() => onComponentSelect(component.id)}
                      draggable
                      onDragStart={(e) => onDragStart(e, component.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 ${component.color} rounded-lg flex items-center justify-center shadow-soft group-hover:shadow-medium transition-shadow`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-sm">{component.name}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}