"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { PROVINCIAS, DEFAULT_PROVINCIA } from "@/lib/provincias"

const types = [
  { value: "supermarket", label: "Supermercado" },
  { value: "restaurant", label: "Restaurante" },
  { value: "pharmacy", label: "Farmacia" },
  { value: "gas_station", label: "Gasolinera" },
  { value: "store", label: "Tienda" },
  { value: "other", label: "Otro" },
]

interface BusinessFormProps {
  action: (formData: FormData) => Promise<void>
  defaultValues?: {
    name?: string
    description?: string
    type?: string
    provincia?: string
    address?: string
    phone?: string
    whatsapp?: string
    discountPercentage?: number
    priorityEnabled?: boolean
    deliveryEnabled?: boolean
  }
}

export function BusinessForm({ action, defaultValues }: BusinessFormProps) {
  const [type, setType] = useState(defaultValues?.type || "other")
  const [provincia, setProvincia] = useState(defaultValues?.provincia || DEFAULT_PROVINCIA)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.set("type", type)
    formData.set("provincia", provincia)
    await action(formData)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={defaultValues?.name}
            className="rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="type">Tipo *</Label>
          <Select value={type} onValueChange={(v) => setType(v ?? "other")}>
            <SelectTrigger className="rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="provincia">Provincia *</Label>
          <Select value={provincia} onValueChange={(v) => setProvincia(v ?? DEFAULT_PROVINCIA)}>
            <SelectTrigger className="rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROVINCIAS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountPercentage">% Descuento membresia basica</Label>
          <Input
            id="discountPercentage"
            name="discountPercentage"
            type="number"
            min="0"
            max="100"
            defaultValue={defaultValues?.discountPercentage || 0}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descripcion</Label>
        <Input
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          className="rounded-full"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Direccion</Label>
          <Input
            id="address"
            name="address"
            defaultValue={defaultValues?.address}
            className="rounded-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefono</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={defaultValues?.phone}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            defaultValue={defaultValues?.whatsapp}
            className="rounded-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <Checkbox
            id="priorityEnabled"
            name="priorityEnabled"
            defaultChecked={defaultValues?.priorityEnabled}
          />
          <Label htmlFor="priorityEnabled" className="text-sm">
            Fila prioritaria
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="deliveryEnabled"
            name="deliveryEnabled"
            defaultChecked={defaultValues?.deliveryEnabled}
          />
          <Label htmlFor="deliveryEnabled" className="text-sm">
            Domicilio disponible
          </Label>
        </div>
      </div>
      <Button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white"
      >
        {loading ? "Guardando..." : "Crear pyme"}
      </Button>
    </form>
  )
}
