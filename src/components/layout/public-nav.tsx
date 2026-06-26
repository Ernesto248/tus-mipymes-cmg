import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function PublicNav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  const role = (session?.user as any)?.role

  async function handleLogout() {
    "use server"
    await auth.api.signOut({
      headers: await headers(),
    })
    redirect("/")
  }

  return (
    <header>
      <nav className="h-11 bg-white text-[#1d1d1f] flex items-center justify-center px-4 border-b border-[#e0e0e0]">
        <div className="flex items-center gap-5 max-w-[980px] w-full justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/icon.svg" alt="MiPymes" className="h-5 w-auto" />
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/negocio" className="text-xs font-normal tracking-[-0.12px] text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors">
              Negocios
            </Link>
            {session ? (
              <>
                {role === "admin" && (
                  <Link href="/dashboard" className="text-xs font-normal tracking-[-0.12px] text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors">
                    Panel
                  </Link>
                )}
                <form action={handleLogout}>
                  <button
                    type="submit"
                    className="text-xs font-normal tracking-[-0.12px] text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors cursor-pointer"
                  >
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <Link href="/login" className="text-xs font-normal tracking-[-0.12px] text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors">
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
