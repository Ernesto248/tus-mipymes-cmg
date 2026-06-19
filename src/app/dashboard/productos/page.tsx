import { getAllBusinessesForAdmin } from "@/db/queries/businesses"
import { ProductManager } from "./product-manager"

export default async function ProductsPage() {
  const businesses = await getAllBusinessesForAdmin()

  return (
    <div>
      <h1 className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-8">
        Productos
      </h1>
      <ProductManager businesses={businesses} />
    </div>
  )
}
