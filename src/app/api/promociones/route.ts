import { NextResponse } from "next/server"
import { getPublicPromotions, getFeaturedPromotions } from "@/db/queries/promotions"
import { getProvincesWithBusinesses } from "@/db/queries/businesses"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const provincia = searchParams.get("provincia") || undefined
  const featured = searchParams.get("featured") === "true"

  const [promotions, activeProvinces] = await Promise.all([
    featured ? getFeaturedPromotions(provincia) : getPublicPromotions(provincia),
    getProvincesWithBusinesses(),
  ])

  return NextResponse.json({ promotions, activeProvinces })
}
