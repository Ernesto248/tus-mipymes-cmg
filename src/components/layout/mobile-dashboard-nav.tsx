"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth/client"
import { Menu, X } from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Inicio" },
  { href: "/dashboard/pymes", label: "Pymes" },
  { href: "/dashboard/productos", label: "Productos" },
  { href: "/dashboard/promociones", label: "Promociones" },
  { href: "/dashboard/membresias", label: "Membresias" },
]

export function MobileDashboardNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border bg-background lg:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <nav className="relative z-10 w-60 h-full bg-[#1d1d1f] text-white flex flex-col animate-in slide-in-from-left duration-200">
            <div className="h-11 flex items-center justify-between px-5 border-b border-white/10">
              <Link
                href="/dashboard"
                className="text-xs font-normal tracking-[-0.12px]"
                onClick={() => setOpen(false)}
              >
                MiPymes Panel
              </Link>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm transition-colors",
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/10",
                    )}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
            <div className="p-4 border-t border-white/10">
              <button
                onClick={async () => {
                  await authClient.signOut()
                  router.push("/")
                  router.refresh()
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors"
              >
                Cerrar sesion
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
