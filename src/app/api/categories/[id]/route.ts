import { NextResponse } from "next/server"
import { updateCategory, deleteCategory } from "@/db/queries/categories"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()

  const updates: Record<string, any> = {}
  if (body.name !== undefined) {
    updates.name = body.name
    updates.slug = body.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
  }
  if (body.order !== undefined) updates.order = body.order

  await updateCategory(id, updates)
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  await deleteCategory(id)
  return NextResponse.json({ ok: true })
}
