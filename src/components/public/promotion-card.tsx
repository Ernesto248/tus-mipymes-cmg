import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { getPromotionBadgeLabel } from "@/lib/promotions"

type PromotionCardProps = {
  title: string
  description: string | null
  type: string
  discountValue: number | null
  businessName: string
  businessSlug: string
}

export function PromotionCard({
  title,
  description,
  type,
  discountValue,
  businessName,
  businessSlug,
}: PromotionCardProps) {
  return (
    <Link
      href={`/negocio/${businessSlug}`}
      className="block bg-white rounded-[18px] border border-[#e0e0e0] p-5 sm:p-6 hover:border-[#0066cc] hover:shadow-sm transition-all active:scale-[0.98]"
    >
      <Badge className="rounded-full bg-[#0066cc] hover:bg-[#0066cc] text-white text-xs mb-3">
        {getPromotionBadgeLabel(type, discountValue)}
      </Badge>
      <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-[#7a7a7a] mt-1 tracking-[-0.224px]">
          {description}
        </p>
      )}
      <p className="text-xs text-[#0066cc] mt-3 font-medium">
        {businessName}
      </p>
    </Link>
  )
}
