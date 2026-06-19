import { getAllPromotionsForAdmin, togglePromotionActive, createPromotion } from "@/db/queries/promotions"
import { getAllBusinessesForAdmin } from "@/db/queries/businesses"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function PromotionsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const [promotions, businesses] = await Promise.all([
    getAllPromotionsForAdmin(),
    getAllBusinessesForAdmin(),
  ])

  const typeLabels: Record<string, string> = {
    discount: "Descuento",
    offer: "Oferta",
    highlight: "Destacado",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
            Promociones
          </h1>
          <p className="text-[17px] text-[#7a7a7a] tracking-[-0.374px]">
            Gestiona las promociones y ofertas
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 mb-6">
        <h2 className="text-[21px] font-semibold text-[#1d1d1f] mb-4 tracking-[0.231px]">
          Nueva promocion
        </h2>
        <form
          action={async (formData: FormData) => {
            "use server"
            await createPromotion({
              title: formData.get("title") as string,
              description: formData.get("description") as string,
              type: formData.get("type") as string,
              discountValue: parseFloat(formData.get("discountValue") as string) || undefined,
              businessId: formData.get("businessId") as string,
              featured: formData.get("featured") === "on",
              startsAt: formData.get("startsAt")
                ? new Date(formData.get("startsAt") as string)
                : undefined,
              endsAt: formData.get("endsAt")
                ? new Date(formData.get("endsAt") as string)
                : undefined,
              createdBy: session?.user.id,
            })
            revalidatePath("/dashboard/promociones")
          }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Titulo *</Label>
            <Input id="title" name="title" required className="rounded-full" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select name="type" defaultValue="offer">
              <SelectTrigger className="rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">Descuento</SelectItem>
                <SelectItem value="offer">Oferta</SelectItem>
                <SelectItem value="highlight">Destacado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessId">Pyme *</Label>
            <Select name="businessId" required>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Elegir pyme" />
              </SelectTrigger>
              <SelectContent>
                {businesses.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountValue">% Descuento</Label>
            <Input
              id="discountValue"
              name="discountValue"
              type="number"
              min="0"
              max="100"
              className="rounded-full"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Descripcion</Label>
            <Input id="description" name="description" className="rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" name="featured" className="rounded" />
            <Label htmlFor="featured" className="text-sm">Destacar en inicio</Label>
          </div>
          <div className="col-span-2">
            <Button type="submit" className="rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white">
              Crear promocion
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0]">
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Titulo</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Tipo</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Pyme</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Estado</th>
                <th className="text-right p-4 text-sm font-semibold text-[#1d1d1f]">Accion</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p) => (
                <tr key={p.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="p-4">
                    <span className="text-sm font-medium text-[#1d1d1f]">{p.title}</span>
                    {p.featured && (
                      <Badge className="ml-2 rounded-full text-xs bg-[#0066cc] hover:bg-[#0066cc] text-white">
                        Destacado
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 text-sm text-[#1d1d1f]">
                    {typeLabels[p.type]}
                    {p.discountValue ? ` (${p.discountValue}%)` : ""}
                  </td>
                  <td className="p-4 text-sm text-[#7a7a7a]">
                    {p.businessId || "-"}
                  </td>
                  <td className="p-4">
                    <Badge
                      className={`rounded-full text-xs ${
                        p.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.active ? "Activa" : "Inactiva"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <form
                      action={async () => {
                        "use server"
                        await togglePromotionActive(p.id, !p.active)
                        revalidatePath("/dashboard/promociones")
                      }}
                    >
                      <Button type="submit" variant="outline" size="sm" className="rounded-full text-xs">
                        {p.active ? "Desactivar" : "Activar"}
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
