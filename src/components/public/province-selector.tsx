"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PROVINCIAS, getProvinciaLabel } from "@/lib/provincias"

interface ProvinceSelectorProps {
  activeProvinces: string[]
  currentProvincia: string
  onChange: (provincia: string) => void
}

export function ProvinceSelector({
  activeProvinces,
  currentProvincia,
  onChange,
}: ProvinceSelectorProps) {
  const available = PROVINCIAS.filter(
    (p) => activeProvinces.length === 0 || activeProvinces.includes(p.value),
  )

  return (
    <Select value={currentProvincia} onValueChange={(v) => v && onChange(v)}>
      <SelectTrigger className="rounded-full max-w-[220px] h-9 text-sm bg-white border-[#e0e0e0]">
        <SelectValue>
          {getProvinciaLabel(currentProvincia)}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {available.map((p) => (
          <SelectItem key={p.value} value={p.value}>
            {p.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
