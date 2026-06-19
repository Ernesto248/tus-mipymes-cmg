"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: signInError } = await authClient.signIn.email({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message || "Error al iniciar sesion")
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm text-[#1d1d1f]">
          Correo electronico
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
          className="rounded-full h-11 px-5 text-[17px] border-[#e0e0e0]"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm text-[#1d1d1f]">
          Contrasena
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Tu contrasena"
          required
          className="rounded-full h-11 px-5 text-[17px] border-[#e0e0e0]"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white h-11 text-[17px] font-normal tracking-[-0.374px] active:scale-95 transition-transform"
      >
        {loading ? "Iniciando sesion..." : "Iniciar sesion"}
      </Button>
    </form>
  )
}
