import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { DashboardLayoutClient } from "@/components/layout/dashboard-layout-client"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  const role = (session.user as any)?.role
  if (role !== "admin") {
    redirect("/")
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
