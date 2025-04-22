
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import Navigation from "./Navigation";
import { Recycle, Menu } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-sidebar-border">
          <Recycle size={24} className="text-recyclafy-leaf-green animate-leaf-float" />
          <span className="font-bold text-xl">Reciclafy</span>
        </div>
        <Navigation />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Recycle size={24} className="text-recyclafy-leaf-green animate-leaf-float" />
            <span className="font-bold text-xl">Reciclafy</span>
          </div>
          <button onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
            <Menu size={24} />
          </button>
        </header>

        {/* Mobile navigation */}
        <div
          className={cn(
            "md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm transition-opacity",
            isMobileNavOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setIsMobileNavOpen(false)}
        >
          <div 
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out",
              isMobileNavOpen ? "translate-x-0" : "-translate-x-full"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-6 py-4 border-b border-sidebar-border">
              <Recycle size={24} className="text-recyclafy-leaf-green animate-leaf-float" />
              <span className="font-bold text-xl">Reciclafy</span>
            </div>
            <Navigation onItemClick={() => setIsMobileNavOpen(false)} />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
