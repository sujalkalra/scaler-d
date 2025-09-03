import { useState } from "react"
import { Play, Save, Download, Trash2, Layers, Database, Server, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Layout } from "@/components/layout/Layout"
import designPadIllustration from "@/assets/design-pad-illustration.jpg"

const designComponents = [
  { id: 1, name: "Load Balancer", icon: Layers, color: "bg-primary" },
  { id: 2, name: "Database", icon: Database, color: "bg-secondary" },
  { id: 3, name: "API Gateway", icon: Server, color: "bg-success" },
  { id: 4, name: "CDN", icon: Globe, color: "bg-warning" },
  { id: 5, name: "Cache", icon: Zap, color: "bg-destructive" },
]

const savedDesigns = [
  {
    id: 1,
    name: "E-commerce Platform",
    lastModified: "2 hours ago",
    components: 8,
    thumbnail: "thumbnail1"
  },
  {
    id: 2,
    name: "Social Media Feed",
    lastModified: "1 day ago",
    components: 12,
    thumbnail: "thumbnail2"
  },
  {
    id: 3,
    name: "Video Streaming Service",
    lastModified: "3 days ago",
    components: 15,
    thumbnail: "thumbnail3"
  }
]

export default function Practice() {
  const [selectedComponent, setSelectedComponent] = useState<number | null>(null)

  return (
    <Layout>
      <div className="h-full flex">
      {/* Sidebar - Component Library */}
      <div className="w-80 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold mb-2">Component Library</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop components to build your system design
          </p>
        </div>

        {/* Components */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
              System Components
            </h3>
            <div className="space-y-2">
              {designComponents.map((component) => (
                <div
                  key={component.id}
                  className={`
                    p-3 rounded-lg border-2 border-dashed border-border cursor-move
                    hover:border-primary hover:bg-primary-light transition-all duration-200
                    ${selectedComponent === component.id ? 'border-primary bg-primary-light' : ''}
                  `}
                  onClick={() => setSelectedComponent(component.id)}
                  draggable
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${component.color} rounded-lg flex items-center justify-center`}>
                      <component.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-sm">{component.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Designs */}
        <div className="p-6 border-t border-border">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground uppercase tracking-wide">
            Saved Designs
          </h3>
          <div className="space-y-2">
            {savedDesigns.map((design) => (
              <Card key={design.id} className="p-3 cursor-pointer hover:bg-accent transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{design.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {design.components} components • {design.lastModified}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Main Design Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Design Canvas</h1>
            <Badge variant="outline">Untitled Design</Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Save className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
            <Button variant="hero" size="sm">
              Share Design
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden bg-muted/20">
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
          
          {/* Empty State */}
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <img 
                src={designPadIllustration} 
                alt="Design Pad Illustration" 
                className="w-full max-w-sm mx-auto mb-6 rounded-xl shadow-soft"
              />
              <h3 className="text-xl font-semibold mb-2">Start Building Your System Design</h3>
              <p className="text-muted-foreground mb-6">
                Drag components from the sidebar to start creating your architecture diagram. 
                Connect components with arrows and add annotations to explain your design decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="hero">
                  Start New Design
                </Button>
                <Button variant="outline">
                  Load Template
                </Button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

function Badge({ children, variant = "default", className = "", ...props }: any) {
  const baseStyles = "inline-flex items-center px-2 py-1 rounded-md text-xs font-medium"
  const variants = {
    default: "bg-primary text-primary-foreground",
    outline: "border border-border bg-background"
  }
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  )
}