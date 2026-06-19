import { createBusiness } from "@/db/queries/businesses"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { BusinessForm } from "./business-form"

export default async function NewBusinessPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  async function handleCreate(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const type = formData.get("type") as string

    if (!name || !type) return

    await createBusiness({
      name,
      slug,
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
    redirect("/dashboard/pymes")
  }

  return (
    <div>
      <h1 className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-8">
        Nueva pyme
      </h1>
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-8">
        <BusinessForm action={handleCreate} />
      </div>
    </div>
  )
}
