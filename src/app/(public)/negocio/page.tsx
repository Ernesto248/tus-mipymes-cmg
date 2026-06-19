import { BusinessCard } from "@/components/public/business-card"
import { CategoryFilter } from "@/components/public/category-filter"
import { Suspense } from "react"
import { eq, and } from "drizzle-orm"
import { businessesTable } from "@/db/schema"
import { db } from "@/db"

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>
}) {
  const { tipo } = await searchParams
  const businesses = await db().query.businessesTable.findMany({
    where: tipo
      ? and(eq(businessesTable.type, tipo as any), eq(businessesTable.active, true))
      : eq(businessesTable.active, true),
    orderBy: (businesses, { desc }) => [desc(businesses.updatedAt)],
  })

  return (
    <div className="py-20 px-4">
      <div className="max-w-[980px] mx-auto">
        <h1 className="text-[40px] font-semibold leading-[1.1] text-[#1d1d1f] text-center mb-3">
          Negocios
        </h1>
        <p className="text-[17px] text-[#7a7a7a] text-center mb-8">
          Descubre las mejores pymes de tu ciudad
        </p>
        <Suspense fallback={null}>
          <CategoryFilter />
        </Suspense>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-[17px] text-[#7a7a7a]">
                No se encontraron negocios en esta categoria.
              </p>
            </div>
          ) : (
            businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
