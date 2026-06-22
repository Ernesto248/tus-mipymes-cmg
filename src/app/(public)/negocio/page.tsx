import { getProvincesWithBusinesses, getActiveBusinessTypes } from "@/db/queries/businesses"
import { eq } from "drizzle-orm"
import { businessesTable } from "@/db/schema"
import { db } from "@/db"
import { NegocioContent } from "./negocio-content"
import { DEFAULT_PROVINCIA } from "@/lib/provincias"

export default async function DirectoryPage() {
  const provincia = DEFAULT_PROVINCIA

  const [businesses, activeProvinces, activeTypes] = await Promise.all([
    db().query.businessesTable.findMany({
      where: eq(businessesTable.active, true),
      orderBy: (businesses, { desc }) => [desc(businesses.updatedAt)],
    }),
    getProvincesWithBusinesses(),
    getActiveBusinessTypes(provincia),
  ])

  return (
    <NegocioContent
      initialData={{ businesses, activeProvinces, activeTypes }}
      initialProvincia={provincia}
    />
  )
}
