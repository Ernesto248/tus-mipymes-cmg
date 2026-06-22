"use client"

import { useState } from "react"
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { MobileDashboardNav } from "@/components/layout/mobile-dashboard-nav"

export function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="flex-1 bg-[#f5f5f7] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="mb-4 lg:hidden">
          <MobileDashboardNav />
        </div>
        {children}
      </main>
    </div>
  )
}
