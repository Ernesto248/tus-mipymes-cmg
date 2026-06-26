"use client"

import { useState, Suspense } from "react"
import { BusinessCard } from "@/components/public/business-card"
import { PromotionCard } from "@/components/public/promotion-card"
import { ProvinceSelector } from "@/components/public/province-selector"
import { getProvinciaLabel } from "@/lib/provincias"
import Link from "next/link"

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
                <PromotionCard
                  key={promo.id}
                  title={promo.title}
                  description={promo.description}
                  type={promo.type}
                  discountValue={promo.discountValue}
                  businessName={promo.businessName}
                  businessSlug={promo.businessSlug}
                />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link
                href="/promociones"
                className="inline-flex items-center justify-center rounded-full border border-[#0066cc] text-[#0066cc] text-[15px] font-normal tracking-[-0.374px] px-[18px] py-[8px] hover:bg-[#0066cc]/5 active:scale-95 transition-all"
              >
                Ver todas las promociones
              </Link>
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
