import { NextResponse } from "next/server"
import { updateProduct, deleteProduct } from "@/db/queries/products"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()

  const updates: Record<string, any> = {}
  if (body.name !== undefined) updates.name = body.name
  if (body.price !== undefined) updates.price = body.price
  if (body.storePrice !== undefined) updates.storePrice = body.storePrice || null
  if (body.available !== undefined) updates.available = body.available
  if (body.description !== undefined) updates.description = body.description
  if (body.categoryId !== undefined) updates.categoryId = body.categoryId || null

  await updateProduct(id, updates)
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  await deleteProduct(id)
  return NextResponse.json({ ok: true })
}
