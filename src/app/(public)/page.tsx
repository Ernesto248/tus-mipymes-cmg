import { getBusinesses, getProvincesWithBusinesses } from "@/db/queries/businesses"
import { getFeaturedPromotions } from "@/db/queries/promotions"
import { NegociosSection } from "@/components/public/negocios-section"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import Link from "next/link"
import { DEFAULT_PROVINCIA } from "@/lib/provincias"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userProvincia = (session?.user as any)?.provincia || null
  const provincia = userProvincia || DEFAULT_PROVINCIA

  const [businesses, featuredPromotions, activeProvinces] = await Promise.all([
    getBusinesses(provincia),
    getFeaturedPromotions(provincia),
    getProvincesWithBusinesses(),
  ])

  return (
    <div>
      <section className="relative min-h-[70vh] flex items-center justify-center px-4 text-center overflow-hidden">
        <img
          src="https://tus-mipymes.nyc3.cdn.digitaloceanspaces.com/hero/socioplus-vertical.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0 sm:hidden"
          loading="eager"
        />
        <img
          src="https://tus-mipymes.nyc3.cdn.digitaloceanspaces.com/hero/socioplus-horizontal.jpeg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover z-0 hidden sm:block"
          loading="eager"
        />
        <div className="absolute inset-0 bg-white/75 sm:hidden z-[1]" />
        <div className="absolute inset-0 bg-white/25 hidden sm:block z-[1]" />
        <div className="relative z-[2]">
          <h1 className="text-[28px] sm:text-[34px] md:text-[40px] font-semibold leading-[1.1] tracking-[-0.374px] max-w-[90%] sm:max-w-[600px] md:max-w-[680px] mx-auto [text-shadow:0_1px_6px_rgba(255,255,255,0.9)]">
            <span className="text-[#0066cc]">Socio</span><span className="text-[#34c759]">+</span>
          </h1>
          <p className="text-[20px] sm:text-[24px] md:text-[28px] font-normal leading-[1.14] tracking-[0.196px] text-[#3a3a3a] mt-3 max-w-[90%] sm:max-w-[500px] md:max-w-[600px] mx-auto [text-shadow:0_1px_4px_rgba(255,255,255,0.9)]">
            Tu membresia de descuentos en Cuba
          </p>
          <p className="text-[16px] sm:text-[18px] md:text-[20px] font-normal leading-[1.14] tracking-[0.196px] text-[#6e6e73] max-w-[90%] sm:max-w-[500px] md:max-w-[600px] mx-auto [text-shadow:0_1px_4px_rgba(255,255,255,0.9)]">
            Mas beneficios, menos gastos
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6">
            <Link
              href="/negocio"
              className="inline-flex items-center justify-center rounded-full bg-[#0066cc] text-white text-[15px] sm:text-[17px] font-normal tracking-[-0.374px] px-[18px] sm:px-[22px] py-[10px] sm:py-[11px] hover:bg-[#0071e3] active:scale-95 transition-transform w-full sm:w-auto"
            >
              Explorar negocios
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full border border-[#0066cc] text-[#0066cc] text-[15px] sm:text-[17px] font-normal tracking-[-0.374px] px-[18px] sm:px-[22px] py-[10px] sm:py-[11px] hover:bg-[#0066cc]/5 active:scale-95 transition-all w-full sm:w-auto"
            >
              Obtener membresia
            </Link>
          </div>
        </div>
      </section>

      <NegociosSection
        initialData={{ businesses, featuredPromotions, activeProvinces }}
        initialProvincia={provincia}
      />
    </div>
  )
}
