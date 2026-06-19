import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function PublicNav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <header>
      <nav className="h-11 bg-[#000000] text-white flex items-center justify-center px-4">
        <div className="flex items-center gap-5 max-w-[980px] w-full justify-between">
          <Link href="/" className="text-xs font-normal tracking-[-0.12px]">
            MiPymes
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/negocio" className="text-xs font-normal tracking-[-0.12px] text-white/80 hover:text-white transition-colors">
              Negocios
            </Link>
            {session ? (
              <Link href="/dashboard" className="text-xs font-normal tracking-[-0.12px] text-white/80 hover:text-white transition-colors">
                Panel
              </Link>
            ) : (
              <Link href="/login" className="text-xs font-normal tracking-[-0.12px] text-white/80 hover:text-white transition-colors">
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
