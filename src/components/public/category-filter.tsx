"use client"

interface CategoryFilterProps {
  onTipoChange: (value: string) => void
  selectedTipo: string
  activeTypes?: string[]
}

const types = [
  { value: "", label: "Todas" },
  { value: "supermarket", label: "Supermercados" },
  { value: "restaurant", label: "Restaurantes" },
  { value: "pharmacy", label: "Farmacias" },
  { value: "gas_station", label: "Gasolineras" },
  { value: "store", label: "Tiendas" },
  { value: "other", label: "Otros" },
]

export function CategoryFilter({
  onTipoChange,
  selectedTipo,
  activeTypes,
}: CategoryFilterProps) {
  const filtered = activeTypes
    ? types.filter((t) => t.value === "" || activeTypes.includes(t.value))
    : types

  if (filtered.length <= 1) return null

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {filtered.map((t) => (
        <button
          key={t.value}
          onClick={() => onTipoChange(t.value)}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            selectedTipo === t.value
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
