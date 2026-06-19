import { notFound } from "next/navigation"
import { getBusinessBySlug, getCategoriesByBusinessId } from "@/db/queries/businesses"
import { getAvailableProducts } from "@/db/queries/products"
import { getPromotionsByBusiness } from "@/db/queries/promotions"
import { ProductCard } from "@/components/public/product-card"
import { BenefitCard } from "@/components/memberships/benefit-card"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getUserMembershipStatus } from "@/db/queries/users"

const typeLabel: Record<string, string> = {
  supermarket: "Supermercado",
  restaurant: "Restaurante",
  pharmacy: "Farmacia",
  gas_station: "Gasolinera",
  store: "Tienda",
  other: "Otro",
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)
  if (!business) notFound()

  const products = await getAvailableProducts(business.id)
  const promotions = await getPromotionsByBusiness(business.id)
  const categories = await getCategoriesByBusinessId(business.id)

  const session = await auth.api.getSession({ headers: await headers() })
  const membership = session
    ? await getUserMembershipStatus(session.user.id)
    : null

  const productsByCategory = new Map<string, typeof products>()
  products.forEach((p: any) => {
    const catId = p.categoryId || "sin-categoria"
    if (!productsByCategory.has(catId)) {
      productsByCategory.set(catId, [])
    }
    productsByCategory.get(catId)!.push(p)
  })

  return (
    <div>
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[980px] mx-auto text-center">
          {business.logo && (
            <img
              src={business.logo}
              alt={business.name}
              className="mx-auto mb-6 max-h-20 object-contain"
              style={{ filter: "drop-shadow(rgba(0,0,0,0.22) 3px 5px 15px)" }}
            />
          )}
          <Badge className="rounded-full mb-3 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#f5f5f7] border-0">
            {typeLabel[business.type] || business.type}
          </Badge>
          <h1 className="text-[40px] font-semibold leading-[1.1] text-[#1d1d1f] mb-3">
            {business.name}
          </h1>
          <p className="text-[17px] text-[#7a7a7a] max-w-[600px] mx-auto leading-[1.47] tracking-[-0.374px]">
            {business.description}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {business.priorityEnabled && (
              <Badge className="rounded-full text-xs bg-[#0066cc] hover:bg-[#0066cc] text-white">
                Fila prioritaria
              </Badge>
            )}
            {business.deliveryEnabled && (
              <Badge className="rounded-full text-xs" variant="outline">
                Domicilio disponible
              </Badge>
            )}
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#0066cc] hover:underline"
              >
                Contactar
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[980px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
          <div className="lg:col-span-2">
            {promotions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-[21px] font-semibold text-[#1d1d1f] mb-4 tracking-[0.231px]">
                  Promociones activas
                </h2>
                <div className="space-y-3">
                  {promotions.filter((p: any) => p.active).map((promo: any) => (
                    <div key={promo.id} className="bg-[#f5f5f7] rounded-[18px] p-4 flex items-center gap-4">
                      <Badge className="rounded-full bg-[#0066cc] hover:bg-[#0066cc] text-white text-xs">
                        {promo.type === "discount" ? `-${promo.discountValue}%` : promo.type === "offer" ? "Oferta" : "Destacado"}
                      </Badge>
                      <div>
                        <h3 className="text-[17px] font-semibold text-[#1d1d1f]">{promo.title}</h3>
                        {promo.description && (
                          <p className="text-sm text-[#7a7a7a]">{promo.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h2 className="text-[21px] font-semibold text-[#1d1d1f] mb-4 tracking-[0.231px]">
              Catalogo
            </h2>
            <p className="text-xs text-[#7a7a7a] mb-6">
              Precios actualizados. Pueden variar sin previo aviso.
            </p>

            {categories.length > 0
              ? categories.map((cat) => {
                  const catProducts = productsByCategory.get(cat.id) || []
                  if (catProducts.length === 0) return null
                  return (
                    <div key={cat.id} className="mb-8">
                      <h3 className="text-sm font-semibold text-[#7a7a7a] mb-3 tracking-[-0.224px] uppercase">
                        {cat.name}
                      </h3>
                      <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
                        {catProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            discountPercentage={business.discountPercentage ?? 0}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })
              : (() => {
                  const uncategorized = productsByCategory.get("sin-categoria") || []
                  if (uncategorized.length === 0 && products.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <p className="text-[17px] text-[#7a7a7a]">
                          No hay productos disponibles en este momento.
                        </p>
                      </div>
                    )
                  }
                  return (
                    <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          discountPercentage={business.discountPercentage ?? 0}
                        />
                      ))}
                    </div>
                  )
                })()}
          </div>

          <div>
            <div className="sticky top-8">
              <BenefitCard
                businessName={business.name}
                discountPercentage={business.discountPercentage ?? 0}
                premiumDiscountPercentage={business.premiumDiscountPercentage ?? undefined}
                priorityEnabled={business.priorityEnabled ?? false}
                deliveryEnabled={business.deliveryEnabled ?? false}
                isLoggedIn={!!session}
                membershipStatus={membership?.membershipStatus}
                membershipType={membership?.membershipType ?? undefined}
              />

              {business.address && (
                <div className="mt-4 bg-white rounded-[18px] border border-[#e0e0e0] p-6">
                  <h3 className="text-sm font-semibold text-[#1d1d1f] mb-2">Ubicacion</h3>
                  <p className="text-sm text-[#7a7a7a]">{business.address}</p>
                </div>
              )}

              {business.phone && (
                <div className="mt-4 bg-white rounded-[18px] border border-[#e0e0e0] p-6">
                  <h3 className="text-sm font-semibold text-[#1d1d1f] mb-2">Contacto</h3>
                  <p className="text-sm text-[#7a7a7a]">{business.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
