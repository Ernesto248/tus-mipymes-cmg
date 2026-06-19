import { db } from "@/db"
import { usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"

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
      id: true, name: true, email: true, phone: true,
      membershipStatus: true, membershipType: true,
      membershipExpiresAt: true, createdAt: true,
    },
  })
}

export async function updateUserMembership(
  userId: string,
  data: { membershipStatus: string; membershipType?: string; membershipExpiresAt?: Date }
) {
  return db().update(usersTable)
    .set({ ...data, membershipStatus: data.membershipStatus as any, updatedAt: new Date() })
    .where(eq(usersTable.id, userId))
    .returning()
}
