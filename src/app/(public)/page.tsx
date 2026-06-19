import { getBusinesses } from "@/db/queries/businesses"
import { getFeaturedPromotions } from "@/db/queries/promotions"
import { BusinessCard } from "@/components/public/business-card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function HomePage() {
  const [businesses, featuredPromotions] = await Promise.all([
    getBusinesses(),
    getFeaturedPromotions(),
  ])

  return (
    <div>
      <section className="py-20 px-4 text-center bg-white">
        <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.374px] text-[#1d1d1f] max-w-[680px] mx-auto">
          Los mejores precios de tu ciudad, en un solo lugar
        </h1>
        <p className="text-[28px] font-light leading-[1.14] tracking-[0.196px] text-[#7a7a7a] mt-3 max-w-[600px] mx-auto">
          Descubre negocios locales, compara precios y ahorra con tu membresia
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link
            href="/negocio"
            className="inline-flex items-center justify-center rounded-full bg-[#0066cc] text-white text-[17px] font-normal tracking-[-0.374px] px-[22px] py-[11px] hover:bg-[#0071e3] active:scale-95 transition-transform"
          >
            Explorar negocios
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-[#0066cc] text-[#0066cc] text-[17px] font-normal tracking-[-0.374px] px-[22px] py-[11px] hover:bg-[#0066cc]/5 active:scale-95 transition-all"
          >
            Obtener membresia
          </Link>
        </div>
      </section>

      {featuredPromotions.length > 0 && (
        <section className="py-20 px-4 bg-[#f5f5f7]">
          <div className="max-w-[980px] mx-auto">
            <h2 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-[#1d1d1f] text-center mb-12">
              Ofertas destacadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPromotions.map((promo) => (
                <div
                  key={promo.id}
                  className="block bg-white rounded-[18px] border border-[#e0e0e0] p-6"
                >
                  <Badge className="rounded-full bg-[#0066cc] hover:bg-[#0066cc] text-white text-xs mb-3">
                    {promo.type === "discount" ? "Descuento" : promo.type === "offer" ? "Oferta" : "Destacado"}
                  </Badge>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-[#7a7a7a] mt-1 tracking-[-0.224px]">
                    {promo.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 px-4 bg-white">
        <div className="max-w-[980px] mx-auto">
          <h2 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-[#1d1d1f] text-center mb-3">
            Negocios locales
          </h2>
          <p className="text-[17px] text-[#7a7a7a] text-center mb-12">
            {businesses.length} negocio{businesses.length !== 1 ? "s" : ""} disponible{businesses.length !== 1 ? "s" : ""}
          </p>
          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[17px] text-[#7a7a7a]">
                Pronto tendremos negocios disponibles. Vuelve pronto!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
