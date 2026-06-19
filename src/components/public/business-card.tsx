import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import type { businessesTable } from "@/db/schema"

type Business = typeof businessesTable.$inferSelect

export function BusinessCard({ business }: { business: Business }) {
  const typeLabel: Record<string, string> = {
    supermarket: "Supermercado",
    restaurant: "Restaurante",
    pharmacy: "Farmacia",
    gas_station: "Gasolinera",
    store: "Tienda",
    other: "Otro",
  }

  return (
    <Link
      href={`/negocio/${business.slug}`}
      className="group block bg-white rounded-[18px] border border-[#e0e0e0] p-6 hover:border-[#0066cc]/30 transition-colors"
    >
      {business.logo && (
        <div className="w-full h-32 mb-4 rounded-lg bg-[#f5f5f7] flex items-center justify-center overflow-hidden">
          <img
            src={business.logo}
            alt={business.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
          {business.name}
        </h3>
        {(business.discountPercentage ?? 0) > 0 && (
          <Badge className="rounded-full bg-[#0066cc] hover:bg-[#0066cc] text-white text-xs">
            -{business.discountPercentage}%
          </Badge>
        )}
      </div>
      <Badge variant="outline" className="rounded-full text-xs mb-2">
        {typeLabel[business.type] || business.type}
      </Badge>
      {business.address && (
        <p className="text-xs text-[#7a7a7a] mb-1 tracking-[-0.12px]">
          {business.address}
        </p>
      )}
      {(business.phone || business.whatsapp) && (
        <p className="text-xs text-[#7a7a7a] mb-3 tracking-[-0.12px]">
          {business.phone && <span>{business.phone}</span>}
          {business.phone && business.whatsapp && <span className="mx-1">·</span>}
          {business.whatsapp && <span>WhatsApp</span>}
        </p>
      )}
      {business.priorityEnabled && (
        <Badge variant="outline" className="rounded-full text-xs border-[#0066cc] text-[#0066cc]">
          Fila prioritaria
        </Badge>
      )}
      {business.deliveryEnabled && (
        <Badge variant="outline" className="rounded-full text-xs ml-1">
          Domicilio
        </Badge>
      )}
    </Link>
  )
}
