import { NextResponse } from "next/server"
import { getAvailableProducts, createProduct } from "@/db/queries/products"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get("businessId")

  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 })
  }

  const products = await getAvailableProducts(businessId)
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!body.name || !body.businessId || body.price == null) {
    return NextResponse.json(
      { error: "name, businessId and price are required" },
      { status: 400 },
    )
  }

  const product = await createProduct({
    name: body.name,
    price: body.price,
    storePrice: body.storePrice || undefined,
    businessId: body.businessId,
    description: body.description || undefined,
    categoryId: body.categoryId || undefined,
  })
  return NextResponse.json(product)
}
