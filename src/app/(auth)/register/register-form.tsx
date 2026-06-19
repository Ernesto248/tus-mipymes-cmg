"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const { error: signUpError } = await authClient.signUp.email({
      name,
      email,
      password,
    })

    if (signUpError) {
      setError(signUpError.message || "Error al crear la cuenta")
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm text-[#1d1d1f]">
          Nombre
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tu nombre"
          required
          className="rounded-full h-11 px-5 text-[17px] border-[#e0e0e0]"
        />
      </div>
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
          placeholder="Minimo 8 caracteres"
          required
          minLength={8}
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
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
    </form>
  )
}
