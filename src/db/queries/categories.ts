import { db } from "@/db"
import { categoriesTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function createCategory(data: {
  name: string
  slug: string
  businessId: string
  icon?: string
  order?: number
}) {
  const { nanoid } = await import("nanoid")
  return db()
    .insert(categoriesTable)
    .values({
      id: nanoid(),
      name: data.name,
      slug: data.slug,
      businessId: data.businessId,
      icon: data.icon,
      order: data.order ?? 0,
    })
    .returning()
}

export async function updateCategory(
  id: string,
  data: { name?: string; slug?: string; order?: number },
) {
  return db()
    .update(categoriesTable)
    .set({ ...data, createdAt: new Date() })
    .where(eq(categoriesTable.id, id))
    .returning()
}

export async function deleteCategory(id: string) {
  return db()
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .returning()
}
