"use client"

import { useState, Suspense } from "react"
import { PromotionCard } from "@/components/public/promotion-card"
import { ProvinceSelector } from "@/components/public/province-selector"

interface PromocionesClientProps {
  initialPromotions: any[]
  initialActiveProvinces: string[]
  initialProvincia: string
}

export function PromocionesClient({
  initialPromotions,
  initialActiveProvinces,
  initialProvincia,
}: PromocionesClientProps) {
  const [provincia, setProvincia] = useState(initialProvincia)
  const [promotions, setPromotions] = useState(initialPromotions)
  const [activeProvinces, setActiveProvinces] = useState(initialActiveProvinces)
  const [loading, setLoading] = useState(false)

  async function handleProvinciaChange(value: string) {
    setProvincia(value)
    setLoading(true)
    try {
      const res = await fetch(`/api/promociones?provincia=${value}`)
      const json = await res.json()
      setPromotions(json.promotions)
      setActiveProvinces(json.activeProvinces)
    } catch (e) {
      console.error("Failed to fetch promotions", e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="py-20 px-4 bg-[#f5f5f7]">
        <div className="max-w-[980px] mx-auto text-center">
          <h1 className="text-[40px] font-semibold leading-[1.1] text-[#1d1d1f] mb-3">
            Promociones
          </h1>
          <p className="text-[17px] text-[#7a7a7a] max-w-[600px] mx-auto leading-[1.47] tracking-[-0.374px]">
            Descubre las mejores ofertas y descuentos cerca de ti
          </p>
          <div className="flex items-center justify-center mt-6">
            <Suspense fallback={null}>
              <ProvinceSelector
                activeProvinces={activeProvinces}
                currentProvincia={provincia}
                onChange={handleProvinciaChange}
              />
            </Suspense>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-[980px] mx-auto">
          {loading && (
            <div className="text-center py-4">
              <p className="text-[17px] text-[#7a7a7a]">Cargando...</p>
            </div>
          )}
          {promotions.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-[17px] text-[#7a7a7a]">
                No hay promociones disponibles en esta provincia todavia.
              </p>
            </div>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 transition-opacity ${loading ? "opacity-50" : ""}`}
            >
              {promotions.map((promo: any) => (
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
          )}
        </div>
      </section>
    </div>
  )
}
