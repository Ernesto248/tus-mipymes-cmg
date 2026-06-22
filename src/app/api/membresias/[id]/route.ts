import { NextResponse } from "next/server"
import { updateUserMembership, getUserById } from "@/db/queries/users"
import { sendMembershipEmail } from "@/lib/email"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const body = await request.json()

  const user = await getUserById(id)
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  await updateUserMembership(id, {
    membershipStatus: body.membershipStatus ?? undefined,
    membershipType: body.membershipType ?? undefined,
    membershipExpiresAt: body.membershipExpiresAt ?? undefined,
    membershipStartedAt: body.membershipStartedAt ?? undefined,
    membershipNotes: body.membershipNotes ?? undefined,
  })

  if (body.sendEmail) {
    await sendMembershipEmail({
      to: user.email,
      userName: user.name,
      type: body.membershipType || user.membershipType || "basic",
      status: body.membershipStatus || user.membershipStatus || "active",
      expiresAt: body.membershipExpiresAt ?? user.membershipExpiresAt,
    })
  }

  return NextResponse.json({ ok: true })
}
