export const PROVINCIAS = [
  { value: "pinar-del-rio", label: "Pinar del Rio" },
  { value: "artemisa", label: "Artemisa" },
  { value: "la-habana", label: "La Habana" },
  { value: "mayabeque", label: "Mayabeque" },
  { value: "matanzas", label: "Matanzas" },
  { value: "villa-clara", label: "Villa Clara" },
  { value: "cienfuegos", label: "Cienfuegos" },
  { value: "sancti-spiritus", label: "Sancti Spiritus" },
  { value: "ciego-de-avila", label: "Ciego de Avila" },
  { value: "camaguey", label: "Camaguey" },
  { value: "las-tunas", label: "Las Tunas" },
  { value: "holguin", label: "Holguin" },
  { value: "granma", label: "Granma" },
  { value: "santiago-de-cuba", label: "Santiago de Cuba" },
  { value: "guantanamo", label: "Guantanamo" },
  { value: "isla-de-la-juventud", label: "Isla de la Juventud" },
] as const

export const DEFAULT_PROVINCIA = "camaguey"

export function getProvinciaLabel(value: string): string {
  return PROVINCIAS.find((p) => p.value === value)?.label ?? value
}
