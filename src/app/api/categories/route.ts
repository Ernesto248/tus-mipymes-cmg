import { NextResponse } from "next/server"
import { getCategoriesByBusinessId } from "@/db/queries/businesses"
import { createCategory } from "@/db/queries/categories"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get("businessId")

  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 })
  }

  const categories = await getCategoriesByBusinessId(businessId)
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const body = await request.json()

  if (!body.name || !body.businessId) {
    return NextResponse.json(
      { error: "name and businessId are required" },
      { status: 400 },
    )
  }

  const slug = body.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

  const category = await createCategory({
    name: body.name,
    slug,
    businessId: body.businessId,
    order: body.order ?? 0,
  })

  return NextResponse.json(category)
}
