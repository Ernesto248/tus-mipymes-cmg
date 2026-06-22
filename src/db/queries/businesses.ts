import { db } from "@/db"
import { businessesTable, categoriesTable } from "@/db/schema"
import { eq, and } from "drizzle-orm"

export async function getBusinesses(provincia?: string) {
  const where = provincia
    ? and(eq(businessesTable.active, true), eq(businessesTable.provincia, provincia))
    : eq(businessesTable.active, true)

  return db().query.businessesTable.findMany({
    where,
    orderBy: (businesses, { desc }) => [desc(businesses.updatedAt)],
  })
}

export async function getProvincesWithBusinesses() {
  const rows = await db()
    .selectDistinct({ provincia: businessesTable.provincia })
    .from(businessesTable)
    .where(eq(businessesTable.active, true))
  return rows.map((r) => r.provincia)
}

export async function getActiveBusinessTypes(provincia?: string) {
  const conditions = [eq(businessesTable.active, true)]
  if (provincia) conditions.push(eq(businessesTable.provincia, provincia))
  const rows = await db()
    .selectDistinct({ type: businessesTable.type })
    .from(businessesTable)
    .where(and(...conditions))
  return rows.map((r) => r.type)
}

export async function getBusinessBySlug(slug: string) {
  return db().query.businessesTable.findFirst({
    where: and(eq(businessesTable.slug, slug), eq(businessesTable.active, true)),
  })
}

export async function getCategoriesByBusinessId(businessId: string) {
  return db().query.categoriesTable.findMany({
    where: eq(categoriesTable.businessId, businessId),
    orderBy: (categories, { asc }) => [asc(categories.order), asc(categories.name)],
  })
}

export async function getAllBusinessesForAdmin() {
  return db().query.businessesTable.findMany({
    orderBy: (businesses, { desc }) => [desc(businesses.updatedAt)],
  })
}

export async function getBusinessById(id: string) {
  return db().query.businessesTable.findFirst({
    where: eq(businessesTable.id, id),
  })
}

export async function createBusiness(data: {
  name: string; slug: string; description?: string; type: string
  provincia?: string; address?: string; phone?: string; whatsapp?: string; logo?: string
  discountPercentage?: number; premiumDiscountPercentage?: number
  priorityEnabled?: boolean; deliveryEnabled?: boolean; updatedBy?: string
}) {
  const { nanoid } = await import("nanoid")
  return db().insert(businessesTable).values({
    id: nanoid(),
    ...data,
    type: data.type as any,
  }).returning()
}

export async function updateBusiness(id: string, data: Record<string, any>) {
  return db().update(businessesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(businessesTable.id, id))
    .returning()
}

export async function toggleBusinessActive(id: string, active: boolean) {
  return db()
    .update(businessesTable)
    .set({ active, updatedAt: new Date() })
    .where(eq(businessesTable.id, id))
    .returning()
}
