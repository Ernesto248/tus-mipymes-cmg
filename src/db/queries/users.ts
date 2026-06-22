import { db } from "@/db"
import { usersTable } from "@/db/schema"
import { eq, and, ilike, or } from "drizzle-orm"

export async function getUserMembershipStatus(userId: string) {
  return db().query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
    columns: {
      id: true, name: true, email: true,
      membershipStatus: true, membershipType: true, membershipExpiresAt: true,
    },
  })
}

export async function getAllUsersForAdmin() {
  return db().query.usersTable.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    columns: {
      id: true, name: true, email: true, phone: true, provincia: true, role: true,
      membershipStatus: true, membershipType: true,
      membershipExpiresAt: true, membershipStartedAt: true,
      membershipNotes: true, createdAt: true,
    },
  })
}

export async function getUsersFiltered({
  status,
  type,
  search,
  page = 1,
  limit = 20,
}: {
  status?: string
  type?: string
  search?: string
  page?: number
  limit?: number
}) {
  const conditions = []

  if (status) {
    conditions.push(eq(usersTable.membershipStatus, status as any))
  }
  if (type) {
    conditions.push(eq(usersTable.membershipType, type))
  }
  if (search) {
    conditions.push(
      or(
        ilike(usersTable.name, `%${search}%`),
        ilike(usersTable.email, `%${search}%`),
      ),
    )
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined

  const [users, countResult] = await Promise.all([
    db()
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        phone: usersTable.phone,
        provincia: usersTable.provincia,
        role: usersTable.role,
        membershipStatus: usersTable.membershipStatus,
        membershipType: usersTable.membershipType,
        membershipExpiresAt: usersTable.membershipExpiresAt,
        membershipStartedAt: usersTable.membershipStartedAt,
        membershipNotes: usersTable.membershipNotes,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .where(where)
      .orderBy(usersTable.createdAt)
      .limit(limit)
      .offset((page - 1) * limit),
    db()
      .select()
      .from(usersTable)
      .where(where),
  ])

  return {
    users,
    total: countResult.length,
    page,
    totalPages: Math.ceil(countResult.length / limit),
  }
}

export async function updateUserMembership(
  userId: string,
  data: {
    membershipStatus?: string
    membershipType?: string
    membershipExpiresAt?: Date | null
    membershipStartedAt?: Date | null
    membershipNotes?: string | null
  },
) {
  const updates: Record<string, any> = { updatedAt: new Date() }
  if (data.membershipStatus !== undefined)
    updates.membershipStatus = data.membershipStatus as any
  if (data.membershipType !== undefined) updates.membershipType = data.membershipType
  if (data.membershipExpiresAt !== undefined)
    updates.membershipExpiresAt = data.membershipExpiresAt
  if (data.membershipStartedAt !== undefined)
    updates.membershipStartedAt = data.membershipStartedAt
  if (data.membershipNotes !== undefined)
    updates.membershipNotes = data.membershipNotes

  return db()
    .update(usersTable)
    .set(updates)
    .where(eq(usersTable.id, userId))
    .returning()
}

export async function getUserById(userId: string) {
  return db().query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
    columns: {
      id: true, name: true, email: true, phone: true, provincia: true, role: true,
      membershipStatus: true, membershipType: true,
      membershipExpiresAt: true, membershipStartedAt: true,
      membershipNotes: true, createdAt: true,
    },
  })
}
