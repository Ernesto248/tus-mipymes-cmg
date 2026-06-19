import { LoginForm } from "./login-form"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function LoginPage() {
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
          Iniciar sesion
        </h1>
        <p className="text-[17px] text-[#7a7a7a] mt-2 tracking-[-0.374px]">
          Accede a tu cuenta de MiPymes
        </p>
      </div>
      <LoginForm />
      <p className="text-sm text-[#7a7a7a] text-center mt-6">
        No tienes cuenta?{" "}
        <a href="/register" className="text-[#0066cc] hover:underline">
          Registrate
        </a>
      </p>
    </div>
  )
}
