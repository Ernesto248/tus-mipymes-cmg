"use client"

import { useState, Suspense } from "react"
import { BusinessCard } from "@/components/public/business-card"
import { ProvinceSelector } from "@/components/public/province-selector"
import { Badge } from "@/components/ui/badge"
import { getProvinciaLabel } from "@/lib/provincias"

interface NegociosData {
  businesses: any[]
  featuredPromotions: any[]
  activeProvinces: string[]
}

interface NegociosSectionProps {
  initialData: NegociosData
  initialProvincia: string
}

export function NegociosSection({
  initialData,
  initialProvincia,
}: NegociosSectionProps) {
  const [provincia, setProvincia] = useState(initialProvincia)
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  async function handleProvinciaChange(value: string) {
    setProvincia(value)
    setLoading(true)
    try {
      const res = await fetch(`/api/negocios?provincia=${value}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error("Failed to fetch negocios", e)
    } finally {
      setLoading(false)
    }
  }

  const { businesses, featuredPromotions, activeProvinces } = data

  return (
    <>
      {featuredPromotions.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 px-4 bg-[#f5f5f7]">
          <div className="max-w-[980px] mx-auto">
            <h2 className="text-[28px] sm:text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-[#1d1d1f] text-center mb-8 sm:mb-12">
              Ofertas destacadas
            </h2>
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-opacity ${loading ? "opacity-50" : ""}`}
            >
              {featuredPromotions.map((promo: any) => (
                <div
                  key={promo.id}
                  className="block bg-white rounded-[18px] border border-[#e0e0e0] p-5 sm:p-6"
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

      <section className="py-12 sm:py-16 md:py-20 px-4 bg-white">
        <div className="max-w-[980px] mx-auto">
          <h2 className="text-[28px] sm:text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-[#1d1d1f] text-center mb-2 sm:mb-3">
            Negocios en {getProvinciaLabel(provincia)}
          </h2>
          <div className="flex items-center justify-center mb-8">
            <Suspense fallback={null}>
              <ProvinceSelector
                activeProvinces={activeProvinces}
                currentProvincia={provincia}
                onChange={handleProvinciaChange}
              />
            </Suspense>
          </div>
          {loading && (
            <div className="text-center py-4">
              <p className="text-[17px] text-[#7a7a7a]">Cargando...</p>
            </div>
          )}
          {businesses.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-[17px] text-[#7a7a7a]">
                No hay negocios disponibles en {getProvinciaLabel(provincia)} todavia.
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-opacity ${loading ? "opacity-50" : ""}`}
            >
              {businesses.map((business: any) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
          {businesses.length > 0 && (
            <p className="text-[15px] sm:text-[17px] text-[#7a7a7a] text-center mt-8 tracking-[-0.374px]">
              {businesses.length} negocio{businesses.length !== 1 ? "s" : ""} disponible{businesses.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </section>
    </>
  )
}
