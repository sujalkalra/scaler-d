import { Save, Download, Trash2, MousePointer, Minus, MoreHorizontal, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ConnectionMode } from "./types"

interface CanvasToolbarProps {
  connectionMode: ConnectionMode
  onConnectionModeChange: (mode: ConnectionMode) => void
  onSave: () => void
  onExport: () => void
  onClear: () => void
  onShare: () => void
  selectedComponents: number
}

export function CanvasToolbar({
  connectionMode,
  onConnectionModeChange,
  onSave,
  onExport,
  onClear,
  onShare,
  selectedComponents
}: CanvasToolbarProps) {
  return (
    <div className="h-16 border-b border-border bg-background/95 backdrop-blur flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold">Design Canvas</h1>
        <Badge variant="outline">Untitled Design</Badge>
        {selectedComponents > 0 && (
          <Badge variant="default">{selectedComponents} components</Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        {/* Connection Mode Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant={connectionMode !== 'none' ? 'default' : 'outline'} 
              size="sm"
              className="gap-2"
            >
              {connectionMode === 'none' ? (
                <MousePointer className="w-4 h-4" />
              ) : connectionMode === 'solid' ? (
                <Minus className="w-4 h-4" />
              ) : connectionMode === 'dashed' ? (
                <MoreHorizontal className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {connectionMode === 'none' ? 'Select' : `${connectionMode} Line`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onConnectionModeChange('none')}>
              <MousePointer className="w-4 h-4 mr-2" />
              Select Mode
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onConnectionModeChange('solid')}>
              <Minus className="w-4 h-4 mr-2" />
              Solid Line
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onConnectionModeChange('dashed')}>
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Dashed Line
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onConnectionModeChange('dotted')}>
              <ArrowRight className="w-4 h-4 mr-2" />
              Dotted Line
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" size="sm" onClick={onSave}>
          <Save className="w-4 h-4 mr-1" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="w-4 h-4 mr-1" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={onClear}>
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
        <Button variant="default" size="sm" onClick={onShare} className="bg-gradient-primary">
          Share Design
        </Button>
      </div>
    </div>
  )
}