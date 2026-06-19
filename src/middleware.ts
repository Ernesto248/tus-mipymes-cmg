import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/", "/negocio", "/api/auth", "/api/upload"]
const protectedPaths = ["/dashboard"]

function isPublicPath(pathname: string) {
  return publicPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

function isProtectedPath(pathname: string) {
  return protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  )
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  if (isProtectedPath(pathname)) {
    const sessionToken =
      request.cookies.get("mipymes.session_token")?.value ||
      request.cookies.get("better-auth.session_token")?.value

    if (!sessionToken) {
      const redirectUrl = new URL("/login", request.url)
      redirectUrl.searchParams.set("from", pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
