import { getAllBusinessesForAdmin, toggleBusinessActive } from "@/db/queries/businesses"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { Plus } from "lucide-react"
import { revalidatePath } from "next/cache"

const typeLabel: Record<string, string> = {
  supermarket: "Supermercado",
  restaurant: "Restaurante",
  pharmacy: "Farmacia",
  gas_station: "Gasolinera",
  store: "Tienda",
  other: "Otro",
}

export default async function BusinessesPage() {
  const businesses = await getAllBusinessesForAdmin()

  async function handleToggle(id: string, currentActive: boolean) {
    "use server"
    await toggleBusinessActive(id, !currentActive)
    revalidatePath("/dashboard/pymes")
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
            Pymes
          </h1>
          <p className="text-[15px] sm:text-[17px] text-[#7a7a7a] tracking-[-0.374px]">
            Gestiona los negocios registrados
          </p>
        </div>
        <Link
          href="/dashboard/pymes/nueva"
          className="inline-flex items-center justify-center rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white h-9 sm:h-8 px-5 sm:px-3 text-sm font-medium transition-colors w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva pyme
        </Link>
      </div>
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0]">
                <th className="text-left p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f]">Nombre</th>
                <th className="text-left p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f] hidden sm:table-cell">Tipo</th>
                <th className="text-left p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f] hidden sm:table-cell">Desc</th>
                <th className="text-left p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f]">Estado</th>
                <th className="text-right p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f]">Accion</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => (
                <tr key={b.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="p-2 sm:p-4">
                    <div className="flex items-center gap-3">
                      {b.logo ? (
                        <img src={b.logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center flex-shrink-0">
                          <span className="text-xs text-[#7a7a7a]">{b.name.charAt(0)}</span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-[#1d1d1f]">{b.name}</span>
                    </div>
                  </td>
                  <td className="p-2 sm:p-4 hidden sm:table-cell">
                    <Badge variant="outline" className="rounded-full text-xs">
                      {typeLabel[b.type] || b.type}
                    </Badge>
                  </td>
                  <td className="p-2 sm:p-4 text-sm text-[#1d1d1f] hidden sm:table-cell">{b.discountPercentage}%</td>
                  <td className="p-2 sm:p-4">
                    <form
                      action={async () => {
                        "use server"
                        await handleToggle(b.id, b.active)
                      }}
                    >
                      <button
                        type="submit"
                        className="flex items-center gap-2"
                      >
                        <Switch
                          checked={b.active}
                          className="pointer-events-none"
                        />
                        <span className="text-xs text-[#7a7a7a] hidden sm:inline">
                          {b.active ? "Activo" : "Inactivo"}
                        </span>
                      </button>
                    </form>
                  </td>
                  <td className="p-2 sm:p-4 text-right">
                    <Link
                      href={`/dashboard/pymes/${b.id}`}
                      className="inline-flex items-center rounded-full border border-border bg-background hover:bg-muted h-7 px-2.5 text-xs font-medium transition-colors"
                    >
                      Editar
                    </Link>
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
