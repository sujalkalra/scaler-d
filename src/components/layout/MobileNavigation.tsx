import { useState } from "react"
import { X, BookOpen, Palette, Zap, User, Home, Star, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

interface MobileNavigationProps {
  isOpen: boolean
  onClose: () => void
}

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Articles", href: "/articles", icon: BookOpen },
  { name: "Featured Articles", href: "/featured-articles", icon: Star },
  { name: "Practice", href: "/practice", icon: Palette },
  { name: "AI Generator", href: "/ai-generator", icon: Zap },
  { name: "Roadmap", href: "/roadmap", icon: Map },
  { name: "Profile", href: "/profile", icon: User },
]

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const location = useLocation()

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        
        <nav className="mt-6">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  )
}