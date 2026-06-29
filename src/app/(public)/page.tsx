import { getBusinesses, getProvincesWithBusinesses } from "@/db/queries/businesses"
import { getFeaturedPromotions } from "@/db/queries/promotions"
import { HeroSection } from "@/components/public/hero-section"
import { NegociosSection } from "@/components/public/negocios-section"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { DEFAULT_PROVINCIA } from "@/lib/provincias"
import { Suspense } from "react"
import { unstable_rethrow } from "next/navigation"

export default async function HomePage() {
  return (
    <div>
      <HeroSection />
      <Suspense fallback={<NegociosSectionSkeleton />}>
        <HomeNegocios />
      </Suspense>
    </div>
  )
}

async function HomeNegocios() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    const userProvincia = (session?.user as any)?.provincia || null
    const provincia = userProvincia || DEFAULT_PROVINCIA

    const [businesses, featuredPromotions, activeProvinces] = await Promise.all([
      getBusinesses(provincia),
      getFeaturedPromotions(provincia),
      getProvincesWithBusinesses(),
    ])

    return (
      <NegociosSection
        initialData={{ businesses, featuredPromotions, activeProvinces }}
        initialProvincia={provincia}
      />
    )
  } catch (error) {
    unstable_rethrow(error)
    return (
      <NegociosSection
        initialData={{ businesses: [], featuredPromotions: [], activeProvinces: [] }}
        initialProvincia={DEFAULT_PROVINCIA}
      />
    )
  }
}

function NegociosSectionSkeleton() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-[980px]">
        <div className="mx-auto mb-4 h-9 w-72 max-w-full rounded-full bg-[#f5f5f7]" />
        <div className="mx-auto mb-10 h-8 w-40 rounded-full bg-[#f5f5f7]" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-48 rounded-[8px] border border-[#e0e0e0] bg-[#f5f5f7]"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
