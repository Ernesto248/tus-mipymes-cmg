"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth/client"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Store,
  Package,
  Tags,
  Users,
  LogOut,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/pymes", label: "Pymes", icon: Store },
  { href: "/dashboard/productos", label: "Productos", icon: Package },
  { href: "/dashboard/promociones", label: "Promociones", icon: Tags },
  { href: "/dashboard/membresias", label: "Membresias", icon: Users },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="w-60 min-h-screen bg-[#1d1d1f] text-white flex flex-col">
      <div className="h-11 flex items-center px-5 border-b border-white/10">
        <Link href="/dashboard" className="text-xs font-normal tracking-[-0.12px]">
          MiPymes Panel
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={async () => {
            await authClient.signOut()
            router.push("/")
            router.refresh()
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </button>
      </div>
    </aside>
  )
}
