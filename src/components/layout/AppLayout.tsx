import { useState } from "react"
import { TopNavbar } from "./TopNavbar"
import { MobileNavigation } from "./MobileNavigation"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      <TopNavbar onMenuClick={() => setMobileNavOpen(true)} />
      <MobileNavigation 
        isOpen={mobileNavOpen} 
        onClose={() => setMobileNavOpen(false)} 
      />
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}