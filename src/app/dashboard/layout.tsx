import { auth } from "@/lib/auth"
import { headers, cookies } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardLayoutClient } from "@/components/layout/dashboard-layout-client"

export const runtime = "nodejs"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    const allCookies = (await cookies()).getAll()
    console.log("[Dashboard] Session null. baseURL:", process.env.BETTER_AUTH_URL || "NOT SET")
    console.log("[Dashboard] NODE_ENV:", process.env.NODE_ENV)
    console.log("[Dashboard] DATABASE_URL:", process.env.DATABASE_URL ? "SET" : "NOT SET")
    console.log("[Dashboard] Cookies:", allCookies.map((c) => `${c.name}`))
    redirect("/login")
  }

  const role = (session.user as any)?.role
  if (role !== "admin") {
    redirect("/")
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
