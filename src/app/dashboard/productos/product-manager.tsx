"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

type Business = {
  id: string
  name: string
  type: string
}

type Product = {
  id: string
  name: string
  price: number
  available: boolean
  categoryId: string | null
}

export function ProductManager({ businesses }: { businesses: Business[] }) {
  const [selectedBusiness, setSelectedBusiness] = useState<string>("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedBusiness) return
    setLoading(true)
    fetch(`/api/products?businessId=${selectedBusiness}`)
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false))
  }, [selectedBusiness])

  return (
    <div>
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 mb-6">
        <Label className="mb-2 block text-sm">Seleccionar pyme</Label>
        <Select value={selectedBusiness} onValueChange={(v) => setSelectedBusiness(v ?? "")}>
          <SelectTrigger className="rounded-full max-w-xs">
            <SelectValue placeholder="Elegir pyme..." />
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
      {loading && <p className="text-sm text-[#7a7a7a]">Cargando productos...</p>}
      {products.length > 0 && (
        <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 border-b border-[#f0f0f0] last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-[#1d1d1f]">{p.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#1d1d1f]">{formatPrice(p.price)}</span>
                <Badge
                  className={`rounded-full text-xs ${
                    p.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.available ? "Disponible" : "Agotado"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
