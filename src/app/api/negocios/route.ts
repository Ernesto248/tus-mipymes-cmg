import { NextResponse } from "next/server"
import { getBusinesses, getProvincesWithBusinesses } from "@/db/queries/businesses"
import { getFeaturedPromotions } from "@/db/queries/promotions"
import { eq, and } from "drizzle-orm"
import { businessesTable } from "@/db/schema"
import { db } from "@/db"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const provincia = searchParams.get("provincia") || undefined
  const tipo = searchParams.get("tipo") || undefined

  const conditions = [eq(businessesTable.active, true)]
  if (provincia) conditions.push(eq(businessesTable.provincia, provincia))
  if (tipo) conditions.push(eq(businessesTable.type, tipo as any))

  const [businesses, featuredPromotions, activeProvinces] = await Promise.all([
    db().query.businessesTable.findMany({
      where: and(...conditions),
      orderBy: (b, { desc }) => [desc(b.updatedAt)],
    }),
    getFeaturedPromotions(provincia),
    getProvincesWithBusinesses(),
  ])

  return NextResponse.json({
    businesses,
    featuredPromotions,
    activeProvinces,
  })
}
