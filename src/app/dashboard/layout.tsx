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
    console.log("[Dashboard] No session. Available cookies:", (await cookies()).getAll().map((c) => c.name))
    redirect("/login")
  }

  const role = (session.user as any)?.role
  if (role !== "admin") {
    redirect("/")
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
