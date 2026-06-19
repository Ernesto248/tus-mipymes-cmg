import { db } from "@/db"
import { promotionsTable, businessesTable } from "@/db/schema"
import { eq, and, gt, lt, or, isNull } from "drizzle-orm"

export async function getActivePromotions() {
  const now = new Date()
  return db().query.promotionsTable.findMany({
    where: and(
      eq(promotionsTable.active, true),
      or(isNull(promotionsTable.startsAt), lt(promotionsTable.startsAt, now)),
      or(isNull(promotionsTable.endsAt), gt(promotionsTable.endsAt, now))
    ),
    orderBy: (promotions, { desc }) => [desc(promotions.featured), desc(promotions.createdAt)],
  })
}

export async function getFeaturedPromotions(provincia?: string) {
  const now = new Date()
  const promoRows = await db()
    .select({
      id: promotionsTable.id,
      title: promotionsTable.title,
      description: promotionsTable.description,
      type: promotionsTable.type,
      discountValue: promotionsTable.discountValue,
      image: promotionsTable.image,
      businessId: promotionsTable.businessId,
      productId: promotionsTable.productId,
      startsAt: promotionsTable.startsAt,
      endsAt: promotionsTable.endsAt,
      active: promotionsTable.active,
      featured: promotionsTable.featured,
      createdBy: promotionsTable.createdBy,
      createdAt: promotionsTable.createdAt,
      updatedAt: promotionsTable.updatedAt,
    })
    .from(promotionsTable)
    .innerJoin(
      businessesTable,
      and(
        eq(promotionsTable.businessId, businessesTable.id),
        eq(businessesTable.active, true),
        provincia ? eq(businessesTable.provincia, provincia) : undefined,
      ),
    )
    .where(
      and(
        eq(promotionsTable.active, true),
        eq(promotionsTable.featured, true),
        or(isNull(promotionsTable.startsAt), lt(promotionsTable.startsAt, now)),
        or(isNull(promotionsTable.endsAt), gt(promotionsTable.endsAt, now)),
      ),
    )
    .orderBy(promotionsTable.createdAt)

  return promoRows
}

export async function getPromotionsByBusiness(businessId: string) {
  return db().query.promotionsTable.findMany({
    where: eq(promotionsTable.businessId, businessId),
    orderBy: (promotions, { desc }) => [desc(promotions.createdAt)],
  })
}

export async function getAllPromotionsForAdmin() {
  return db().query.promotionsTable.findMany({
    orderBy: (promotions, { desc }) => [desc(promotions.createdAt)],
  })
}

export async function createPromotion(data: {
  title: string; description?: string; type: string; discountValue?: number
  image?: string; businessId: string; productId?: string; startsAt?: Date
  endsAt?: Date; featured?: boolean; createdBy?: string
}) {
  const { nanoid } = await import("nanoid")
  return db().insert(promotionsTable).values({ id: nanoid(), ...data, type: data.type as any }).returning()
}

export async function updatePromotion(id: string, data: Record<string, any>) {
  return db().update(promotionsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(promotionsTable.id, id))
    .returning()
}

export async function togglePromotionActive(id: string, active: boolean) {
  return db().update(promotionsTable)
    .set({ active, updatedAt: new Date() })
    .where(eq(promotionsTable.id, id))
    .returning()
}
