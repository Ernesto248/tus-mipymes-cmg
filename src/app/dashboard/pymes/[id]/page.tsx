import { getBusinessById, updateBusiness } from "@/db/queries/businesses"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { BusinessForm } from "../nueva/business-form"

export default async function EditBusinessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const business = await getBusinessById(id)
  if (!business) notFound()

  const session = await auth.api.getSession({ headers: await headers() })

  async function handleUpdate(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const type = formData.get("type") as string

    if (!name || !type) return

    await updateBusiness(id, {
      name,
      description: formData.get("description") as string || undefined,
      type,
      provincia: formData.get("provincia") as string || undefined,
      address: formData.get("address") as string || undefined,
      phone: formData.get("phone") as string || undefined,
      whatsapp: formData.get("whatsapp") as string || undefined,
      discountPercentage: parseFloat(formData.get("discountPercentage") as string) || 0,
      priorityEnabled: formData.get("priorityEnabled") === "on",
      deliveryEnabled: formData.get("deliveryEnabled") === "on",
      updatedBy: session?.user.id,
    })

    revalidatePath("/dashboard/pymes")
    revalidatePath(`/dashboard/pymes/${id}`)
    redirect("/dashboard/pymes")
  }

  return (
    <div>
      <h1 className="text-[28px] sm:text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-8">
        Editar pyme
      </h1>
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-4 sm:p-8">
        <BusinessForm
          action={handleUpdate}
          defaultValues={{
            name: business.name,
            description: business.description ?? undefined,
            type: business.type,
            provincia: business.provincia ?? undefined,
            address: business.address ?? undefined,
            phone: business.phone ?? undefined,
            whatsapp: business.whatsapp ?? undefined,
            discountPercentage: business.discountPercentage,
            priorityEnabled: business.priorityEnabled,
            deliveryEnabled: business.deliveryEnabled,
          }}
        />
      </div>
    </div>
  )
}
