import { getAllBusinessesForAdmin } from "@/db/queries/businesses"
import { getAllUsersForAdmin } from "@/db/queries/users"
import { getAllPromotionsForAdmin } from "@/db/queries/promotions"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function DashboardHome() {
  const session = await auth.api.getSession({ headers: await headers() })
  const businesses = await getAllBusinessesForAdmin()
  const users = await getAllUsersForAdmin()
  const promotions = await getAllPromotionsForAdmin()

  const activeMemberships = users.filter(
    (u) => u.membershipStatus === "active"
  ).length
  const activeBusinesses = businesses.filter((b) => b.active).length
  const activePromotions = promotions.filter((p) => p.active).length

  const stats = [
    { label: "Pymes activas", value: activeBusinesses },
    { label: "Membresias activas", value: activeMemberships },
    { label: "Promociones", value: activePromotions },
    { label: "Usuarios registrados", value: users.length },
  ]

  return (
    <div>
      <h1 className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-2">
        Bienvenido, {session?.user.name || "Admin"}
      </h1>
      <p className="text-[17px] text-[#7a7a7a] mb-8 tracking-[-0.374px]">
        Vista general del panel de administracion
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-[18px] border border-[#e0e0e0] p-6"
          >
            <p className="text-sm text-[#7a7a7a] mb-1">{stat.label}</p>
            <p className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
