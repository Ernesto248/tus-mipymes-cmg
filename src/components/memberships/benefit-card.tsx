import { Badge } from "@/components/ui/badge"

interface BenefitCardProps {
  businessName: string
  discountPercentage: number
  premiumDiscountPercentage?: number
  priorityEnabled: boolean
  deliveryEnabled: boolean
  isLoggedIn: boolean
  membershipStatus?: string
  membershipType?: string
}

export function BenefitCard({
  businessName,
  discountPercentage,
  premiumDiscountPercentage,
  priorityEnabled,
  deliveryEnabled,
  isLoggedIn,
  membershipStatus,
  membershipType,
}: BenefitCardProps) {
  const isActive = membershipStatus === "active"
  const isPremium = membershipType === "premium"
  const discount = isPremium && premiumDiscountPercentage
    ? premiumDiscountPercentage
    : discountPercentage

  return (
    <div className="bg-[#f5f5f7] rounded-[18px] p-6">
      <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-4 tracking-[-0.374px]">
        Beneficios en {businessName}
      </h3>
      {isLoggedIn && isActive ? (
        <div className="space-y-2">
          {discount > 0 && (
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-green-100 text-green-700 hover:bg-green-100">
                {discount}% descuento
              </Badge>
              <span className="text-sm text-[#1d1d1f]">En productos aplicables</span>
            </div>
          )}
          {priorityEnabled && (
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-[#0066cc] hover:bg-[#0066cc] text-white">
                Prioridad
              </Badge>
              <span className="text-sm text-[#1d1d1f]">Fila preferencial</span>
            </div>
          )}
          {deliveryEnabled && isPremium && (
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-purple-100 text-purple-700 hover:bg-purple-100">
                Premium
              </Badge>
              <span className="text-sm text-[#1d1d1f]">Domicilio gratis</span>
            </div>
          )}
        </div>
      ) : isLoggedIn ? (
        <p className="text-sm text-[#7a7a7a]">
          Tu membresia no esta activa. Contactanos para activarla.
        </p>
      ) : (
        <p className="text-sm text-[#7a7a7a]">
          Inicia sesion para ver tus beneficios de membresia.
        </p>
      )}
    </div>
  )
}
