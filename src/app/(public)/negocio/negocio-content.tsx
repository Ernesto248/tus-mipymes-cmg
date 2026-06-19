"use client"

import { useState, useCallback } from "react"
import { BusinessCard } from "@/components/public/business-card"
import { CategoryFilter } from "@/components/public/category-filter"
import { ProvinceSelector } from "@/components/public/province-selector"
import { Suspense } from "react"
import { DEFAULT_PROVINCIA, getProvinciaLabel } from "@/lib/provincias"

interface NegocioInitialData {
  businesses: any[]
  activeProvinces: string[]
}

export function NegocioContent({
  initialData,
  initialProvincia,
}: {
  initialData: NegocioInitialData
  initialProvincia: string
}) {
  const [provincia, setProvincia] = useState(initialProvincia)
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)
  const [tipo, setTipo] = useState("")

  const fetchData = useCallback(
    async (newProvincia: string, newTipo: string) => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ provincia: newProvincia })
        if (newTipo) params.set("tipo", newTipo)
        const res = await fetch(`/api/negocios?${params.toString()}`)
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error("Failed to fetch", e)
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  async function handleProvinciaChange(value: string) {
    setProvincia(value)
    await fetchData(value, tipo)
  }

  async function handleTipoChange(value: string) {
    setTipo(value)
    await fetchData(provincia, value)
  }

  const { businesses, activeProvinces } = data

  return (
    <div className="py-20 px-4">
      <div className="max-w-[980px] mx-auto">
        <h1 className="text-[40px] font-semibold leading-[1.1] text-[#1d1d1f] text-center mb-3">
          Negocios
        </h1>
        <p className="text-[17px] text-[#7a7a7a] text-center mb-4">
          Descubre las mejores pymes de {getProvinciaLabel(provincia)}
        </p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Suspense fallback={null}>
            <ProvinceSelector
              activeProvinces={activeProvinces}
              currentProvincia={provincia}
              onChange={handleProvinciaChange}
            />
          </Suspense>
          <CategoryFilter onTipoChange={handleTipoChange} selectedTipo={tipo} />
        </div>
        {loading && (
          <div className="text-center py-4">
            <p className="text-[17px] text-[#7a7a7a]">Cargando...</p>
          </div>
        )}
        <div
          className={`mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${loading ? "opacity-50" : ""}`}
        >
          {businesses.length === 0 && !loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-[17px] text-[#7a7a7a]">
                No se encontraron negocios en esta categoria.
              </p>
            </div>
          ) : (
            businesses.map((business: any) => (
              <BusinessCard key={business.id} business={business} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
