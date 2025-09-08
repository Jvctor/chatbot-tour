import { useState } from 'react'
import type { ReactNode } from 'react'
import SideBar from './SideBar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      <main className="md:ml-64">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  )
}
