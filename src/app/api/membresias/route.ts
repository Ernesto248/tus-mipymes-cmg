import { NextResponse } from "next/server"
import { getUsersFiltered } from "@/db/queries/users"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const result = await getUsersFiltered({
    status: searchParams.get("status") || undefined,
    type: searchParams.get("type") || undefined,
    search: searchParams.get("search") || undefined,
    page: parseInt(searchParams.get("page") || "1"),
    limit: parseInt(searchParams.get("limit") || "20"),
  })

  return NextResponse.json(result)
}
