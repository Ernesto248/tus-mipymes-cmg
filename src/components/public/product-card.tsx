import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { productsTable } from "@/db/schema"

type Product = typeof productsTable.$inferSelect

export function ProductCard({
  product,
  discountPercentage,
}: {
  product: Product
  discountPercentage: number
}) {
  const discountedPrice = product.discountable
    ? product.price * (1 - discountPercentage / 100)
    : product.price

  return (
    <div className="flex items-center gap-4 p-4 border-b border-[#f0f0f0] last:border-0">
      {product.image ? (
        <div className="w-16 h-16 rounded-lg bg-[#f5f5f7] flex-shrink-0 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-lg bg-[#f5f5f7] flex-shrink-0 flex items-center justify-center">
          <span className="text-2xl text-[#7a7a7a]">{product.name.charAt(0)}</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px] truncate">
            {product.name}
          </h3>
          {!product.available && (
            <Badge variant="outline" className="rounded-full text-xs text-[#7a7a7a]">Agotado</Badge>
          )}
        </div>
        {product.description && (
          <p className="text-sm text-[#7a7a7a] mt-0.5">{product.description}</p>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        {discountPercentage > 0 && product.discountable ? (
          <>
            <p className="text-xs text-[#7a7a7a] line-through">{formatPrice(product.price)}</p>
            <p className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
              {formatPrice(discountedPrice)}
            </p>
            <Badge className="rounded-full bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">
              -{discountPercentage}%
            </Badge>
          </>
        ) : (
          <p className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
            {formatPrice(product.price)}
          </p>
        )}
      </div>
    </div>
  )
}
