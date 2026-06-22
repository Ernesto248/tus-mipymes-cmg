import { db } from "@/db"
import { productsTable } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function getProductsByBusiness(businessId: string) {
  return db().query.productsTable.findMany({
    where: eq(productsTable.businessId, businessId),
    orderBy: (products, { asc }) => [asc(products.categoryId), asc(products.name)],
  })
}

export async function getAvailableProducts(businessId: string) {
  return db().query.productsTable.findMany({
    where: and(eq(productsTable.businessId, businessId), eq(productsTable.available, true)),
    orderBy: (products, { asc }) => [asc(products.categoryId), asc(products.name)],
  })
}

export async function createProduct(data: {
  name: string; description?: string; price: number; storePrice?: number; image?: string
  businessId: string; categoryId?: string; discountable?: boolean; updatedBy?: string
}) {
  const { nanoid } = await import("nanoid")
  return db().insert(productsTable).values({ id: nanoid(), ...data }).returning()
}

export async function updateProduct(id: string, data: Record<string, any>) {
  return db().update(productsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(productsTable.id, id))
    .returning()
}

export async function toggleProductAvailability(id: string, available: boolean) {
  return db().update(productsTable)
    .set({ available, updatedAt: new Date() })
    .where(eq(productsTable.id, id))
    .returning()
}

export async function deleteProduct(id: string) {
  return db().delete(productsTable).where(eq(productsTable.id, id)).returning()
}
