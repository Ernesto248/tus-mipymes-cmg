export function getPromotionTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    discount: "Descuento",
    offer: "Oferta",
    highlight: "Destacado",
  }
  return labels[type] || type
}

export function getPromotionBadgeLabel(type: string, discountValue?: number | null): string {
  if (type === "discount" && discountValue != null) return `-${discountValue}%`
  return getPromotionTypeLabel(type)
}
