import { getAllUsersForAdmin, updateUserMembership } from "@/db/queries/users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"

export default async function MembershipsPage() {
  const users = await getAllUsersForAdmin()

  return (
    <div>
      <h1 className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-2">
        Membresias
      </h1>
      <p className="text-[17px] text-[#7a7a7a] mb-8 tracking-[-0.374px]">
        Gestiona las membresias de los usuarios
      </p>
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0]">
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Usuario</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Estado</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Tipo</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Vence</th>
                <th className="text-right p-4 text-sm font-semibold text-[#1d1d1f]">Accion</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="p-4 text-sm text-[#1d1d1f]">{user.name}</td>
                  <td className="p-4 text-sm text-[#7a7a7a]">{user.email}</td>
                  <td className="p-4">
                    <Badge
                      className={`rounded-full text-xs ${
                        user.membershipStatus === "active"
                          ? "bg-green-100 text-green-700"
                          : user.membershipStatus === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.membershipStatus === "active"
                        ? "Activa"
                        : user.membershipStatus === "expired"
                        ? "Vencida"
                        : user.membershipStatus === "cancelled"
                        ? "Cancelada"
                        : "Pendiente"}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-[#1d1d1f] capitalize">
                    {user.membershipType}
                  </td>
                  <td className="p-4 text-sm text-[#7a7a7a]">
                    {user.membershipExpiresAt
                      ? new Date(user.membershipExpiresAt).toLocaleDateString("es-CO")
                      : "-"}
                  </td>
                  <td className="p-4 text-right">
                    <form
                      action={async () => {
                        "use server"
                        const newStatus =
                          user.membershipStatus === "active" ? "cancelled" : "active"
                        await updateUserMembership(user.id, {
                          membershipStatus: newStatus,
                          membershipExpiresAt:
                            newStatus === "active"
                              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                              : undefined,
                        })
                        revalidatePath("/dashboard/membresias")
                      }}
                    >
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs"
                      >
                        {user.membershipStatus === "active"
                          ? "Desactivar"
                          : "Activar (30 dias)"}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
