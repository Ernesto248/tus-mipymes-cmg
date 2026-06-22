"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react"

const statusOptions = [
  { value: "", label: "Todos los estados" },
  { value: "active", label: "Activa" },
  { value: "pending", label: "Pendiente" },
  { value: "expired", label: "Vencida" },
  { value: "cancelled", label: "Cancelada" },
]

const typeOptions = [
  { value: "", label: "Todos los tipos" },
  { value: "basic", label: "Basica" },
  { value: "premium", label: "Premium" },
]

const statusLabelMap: Record<string, string> = {
  active: "Activa",
  pending: "Pendiente",
  expired: "Vencida",
  cancelled: "Cancelada",
}

interface UserRow {
  id: string
  name: string
  email: string
  phone: string | null
  provincia: string | null
  role: string
  membershipStatus: string
  membershipType: string
  membershipExpiresAt: string | null
  membershipStartedAt: string | null
  membershipNotes: string | null
  createdAt: string
}

interface PaginatedResult {
  users: UserRow[]
  total: number
  page: number
  totalPages: number
}

const pageSize = 20

export function MembresiasClient() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<PaginatedResult | null>(null)
  const [loading, setLoading] = useState(false)

  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [saving, setSaving] = useState(false)

  const [editForm, setEditForm] = useState({
    membershipStatus: "",
    membershipType: "",
    membershipExpiresAt: "",
    membershipStartedAt: "",
    membershipNotes: "",
    sendEmail: false,
  })

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (statusFilter) params.set("status", statusFilter)
    if (typeFilter) params.set("type", typeFilter)
    params.set("page", String(page))
    params.set("limit", String(pageSize))

    const res = await fetch(`/api/membresias?${params.toString()}`)
    const json = await res.json()
    setData(json)
    setLoading(false)
  }, [search, statusFilter, typeFilter, page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  function openEdit(user: UserRow) {
    setEditUser(user)
    setEditForm({
      membershipStatus: user.membershipStatus,
      membershipType: user.membershipType,
      membershipExpiresAt: user.membershipExpiresAt
        ? new Date(user.membershipExpiresAt).toISOString().split("T")[0]
        : "",
      membershipStartedAt: user.membershipStartedAt
        ? new Date(user.membershipStartedAt).toISOString().split("T")[0]
        : "",
      membershipNotes: user.membershipNotes || "",
      sendEmail: false,
    })
  }

  async function handleSave() {
    if (!editUser) return
    setSaving(true)

    const body: Record<string, any> = {
      membershipStatus: editForm.membershipStatus,
      membershipType: editForm.membershipType,
      membershipExpiresAt: editForm.membershipExpiresAt
        ? new Date(editForm.membershipExpiresAt).toISOString()
        : null,
      membershipStartedAt: editForm.membershipStartedAt
        ? new Date(editForm.membershipStartedAt).toISOString()
        : null,
      membershipNotes: editForm.membershipNotes || null,
      sendEmail: editForm.sendEmail,
    }

    await fetch(`/api/membresias/${editUser.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setEditUser(null)
    setSaving(false)
    fetchUsers()
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a7a7a]" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="rounded-full pl-9 h-9 text-sm"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v ?? "")
            setPage(1)
          }}
        >
          <SelectTrigger className="rounded-full h-9 text-sm sm:w-[160px]">
            <SelectValue>{statusOptions.find((s) => s.value === statusFilter)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={typeFilter}
          onValueChange={(v) => {
            setTypeFilter(v ?? "")
            setPage(1)
          }}
        >
          <SelectTrigger className="rounded-full h-9 text-sm sm:w-[140px]">
            <SelectValue>{typeOptions.find((t) => t.value === typeFilter)?.label}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <p className="text-sm text-[#7a7a7a] text-center py-4">Cargando...</p>
      )}

      {data && data.users.length > 0 && (
        <>
          <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e0e0e0]">
                    <th className="text-left p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f]">Usuario</th>
                    <th className="text-left p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f] hidden sm:table-cell">Email</th>
                    <th className="text-left p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f]">Estado</th>
                    <th className="text-left p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f] hidden sm:table-cell">Tipo</th>
                    <th className="text-left p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f] hidden md:table-cell">Vence</th>
                    <th className="text-right p-2 sm:p-4 text-sm font-semibold text-[#1d1d1f]">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((u) => (
                    <tr key={u.id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#f5f5f7]">
                      <td className="p-2 sm:p-4">
                        <p className="text-sm font-medium text-[#1d1d1f]">{u.name}</p>
                        <p className="text-xs text-[#7a7a7a] sm:hidden">{u.email}</p>
                      </td>
                      <td className="p-2 sm:p-4 text-sm text-[#7a7a7a] hidden sm:table-cell">{u.email}</td>
                      <td className="p-2 sm:p-4">
                        <Badge
                          className={`rounded-full text-xs ${
                            u.membershipStatus === "active"
                              ? "bg-green-100 text-green-700"
                              : u.membershipStatus === "expired"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {statusLabelMap[u.membershipStatus] || u.membershipStatus}
                        </Badge>
                      </td>
                      <td className="p-2 sm:p-4 text-sm text-[#1d1d1f] capitalize hidden sm:table-cell">
                        {u.membershipType}
                      </td>
                      <td className="p-2 sm:p-4 text-sm text-[#7a7a7a] hidden md:table-cell">
                        {u.membershipExpiresAt
                          ? new Date(u.membershipExpiresAt).toLocaleDateString("es-CO")
                          : "-"}
                      </td>
                      <td className="p-2 sm:p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEdit(u)}
                          className="rounded-full h-7 text-xs"
                        >
                          Gestionar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-[#7a7a7a]">
              {data.total} usuarios | Pagina {data.page} de {data.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="rounded-full h-8 text-xs"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= data.totalPages}
                onClick={() => setPage(page + 1)}
                className="rounded-full h-8 text-xs"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {data && data.users.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-[17px] text-[#7a7a7a]">No se encontraron usuarios.</p>
        </div>
      )}

      <Dialog open={!!editUser} onOpenChange={() => setEditUser(null)}>
        <DialogContent className="sm:max-w-[440px] rounded-[18px]">
          <DialogHeader>
            <DialogTitle className="text-[17px] font-semibold text-[#1d1d1f]">
              Gestionar membresia
            </DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4">
              <p className="text-sm text-[#7a7a7a]">
                {editUser.name} &middot; {editUser.email}
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-[#7a7a7a]">Estado</Label>
                  <Select
                    value={editForm.membershipStatus}
                    onValueChange={(v) =>
                      setEditForm({ ...editForm, membershipStatus: v ?? "pending" })
                    }
                  >
                    <SelectTrigger className="rounded-full h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.filter((s) => s.value).map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-[#7a7a7a]">Tipo</Label>
                  <Select
                    value={editForm.membershipType}
                    onValueChange={(v) =>
                      setEditForm({ ...editForm, membershipType: v ?? "basic" })
                    }
                  >
                    <SelectTrigger className="rounded-full h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.filter((t) => t.value).map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-[#7a7a7a]">Fecha inicio</Label>
                  <Input
                    type="date"
                    value={editForm.membershipStartedAt}
                    onChange={(e) =>
                      setEditForm({ ...editForm, membershipStartedAt: e.target.value })
                    }
                    className="rounded-full h-9 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-[#7a7a7a]">Fecha vencimiento</Label>
                  <Input
                    type="date"
                    value={editForm.membershipExpiresAt}
                    onChange={(e) =>
                      setEditForm({ ...editForm, membershipExpiresAt: e.target.value })
                    }
                    className="rounded-full h-9 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-[#7a7a7a]">Notas internas</Label>
                <Input
                  value={editForm.membershipNotes}
                  onChange={(e) =>
                    setEditForm({ ...editForm, membershipNotes: e.target.value })
                  }
                  placeholder="Ej: Pago por WhatsApp 22/06"
                  className="rounded-full h-9 text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={editForm.sendEmail}
                  onChange={(e) =>
                    setEditForm({ ...editForm, sendEmail: e.target.checked })
                  }
                  className="rounded"
                />
                <Label htmlFor="sendEmail" className="text-sm text-[#1d1d1f] cursor-pointer">
                  Enviar email de confirmacion al usuario
                </Label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white h-9 text-sm"
                >
                  {saving ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditUser(null)}
                  className="rounded-full h-9 text-sm"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
