"use client"

import { useRouter, useSearchParams } from "next/navigation"

const types = [
  { value: "", label: "Todas" },
  { value: "supermarket", label: "Supermercados" },
  { value: "restaurant", label: "Restaurantes" },
  { value: "pharmacy", label: "Farmacias" },
  { value: "gas_station", label: "Gasolineras" },
  { value: "store", label: "Tiendas" },
  { value: "other", label: "Otros" },
]

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get("tipo") || ""

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {types.map((t) => (
        <button
          key={t.value}
          onClick={() => {
            const params = new URLSearchParams(searchParams)
            if (t.value) {
              params.set("tipo", t.value)
            } else {
              params.delete("tipo")
            }
            router.push(`/negocio?${params.toString()}`)
          }}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            current === t.value
              ? "bg-[#0066cc] text-white"
              : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e0e0e0]"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
