import { RegisterForm } from "./register-form"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect("/")
  }

  return (
    <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-8">
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-semibold leading-[1.14] tracking-[0.196px] text-[#1d1d1f]">
          Crear cuenta
        </h1>
        <p className="text-[17px] text-[#7a7a7a] mt-2 tracking-[-0.374px]">
          Unete a SocioPlus y empieza a ahorrar
        </p>
      </div>
      <RegisterForm />
      <p className="text-sm text-[#7a7a7a] text-center mt-6">
        Ya tienes cuenta?{" "}
        <a href="/login" className="text-[#0066cc] hover:underline">
          Inicia sesion
        </a>
      </p>
    </div>
  )
}
