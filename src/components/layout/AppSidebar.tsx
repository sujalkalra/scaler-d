import { useState } from "react"
import { 
  BookOpen, 
  PenTool, 
  Zap, 
  User, 
  Home,
  TrendingUp,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Articles", url: "/articles", icon: BookOpen },
  { title: "Practice", url: "/practice", icon: PenTool },
  { title: "AI Generator", url: "/ai-generator", icon: Zap },
  { title: "Trending", url: "/trending", icon: TrendingUp },
  { title: "Search", url: "/search", icon: Search },
]

const userItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
]

interface AppSidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
}

export function AppSidebar({ collapsed, onToggleCollapse }: AppSidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }

  const getNavClassName = (path: string) => cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
    isActive(path) 
      ? "bg-primary text-primary-foreground shadow-soft" 
      : "text-muted-foreground hover:text-foreground hover:bg-accent"
  )

  return (
    <div className={cn(
      "flex flex-col h-full bg-card border-r border-border transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-gradient">SysDesign</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="hover:bg-accent"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={getNavClassName(item.url)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.title}</span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Divider */}
        <div className="py-2">
          <div className="h-px bg-border" />
        </div>

        {/* User Section */}
        <div className="space-y-1">
          {userItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={getNavClassName(item.url)}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.title}</span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-card p-3 rounded-lg">
            <h4 className="font-semibold text-sm mb-1">Upgrade to Pro</h4>
            <p className="text-xs text-muted-foreground mb-3">
              Get unlimited AI generations and premium features
            </p>
            <Button variant="premium" size="sm" className="w-full">
              Upgrade Now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}