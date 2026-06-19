import { NextResponse } from "next/server"
import { getAvailableProducts } from "@/db/queries/products"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get("businessId")

  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 })
  }

  const products = await getAvailableProducts(businessId)
  return NextResponse.json(products)
}
