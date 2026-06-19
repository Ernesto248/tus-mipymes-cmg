import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
      <div className="h-[52px] bg-[#f5f5f7]/80 backdrop-blur-xl flex items-center justify-center px-4 border-b border-black/5">
        <div className="flex items-center max-w-[980px] w-full justify-between">
          <span className="text-[21px] font-semibold tracking-[0.231px]">
            Apoya tu comercio local
          </span>
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 rounded-sm">
                  <AvatarFallback className="text-[10px] rounded-sm bg-[#0066cc] text-white">
                    {session.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-[#1d1d1f]">{session.user.name}</span>
              </div>
            ) : (
              <Link href="/login" className="inline-flex items-center rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white h-8 px-4 text-sm">Unirme</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
