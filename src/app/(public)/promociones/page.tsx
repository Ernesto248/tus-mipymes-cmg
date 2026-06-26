import { getPublicPromotions } from "@/db/queries/promotions"
import { getProvincesWithBusinesses } from "@/db/queries/businesses"
import { DEFAULT_PROVINCIA } from "@/lib/provincias"
import { PromocionesClient } from "./promociones-client"

export default async function PromocionesPage() {
  const [promotions, activeProvinces] = await Promise.all([
    getPublicPromotions(DEFAULT_PROVINCIA),
    getProvincesWithBusinesses(),
  ])

  return (
    <PromocionesClient
      initialPromotions={promotions}
      initialActiveProvinces={activeProvinces}
      initialProvincia={DEFAULT_PROVINCIA}
    />
  )
}
