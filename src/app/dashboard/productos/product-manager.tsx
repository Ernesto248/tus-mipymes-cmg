"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { Pencil, Check, X, ChevronsUpDown, Store, Plus, Trash2 } from "lucide-react"

type Business = {
  id: string
  name: string
  type: string
}

type Product = {
  id: string
  name: string
  price: number
  storePrice: number | null
  available: boolean
  description: string | null
  categoryId: string | null
}

type Category = {
  id: string
  name: string
}

function calcDiscount(storePrice: number | null, price: number): number {
  if (!storePrice || storePrice <= price) return 0
  return Math.round(((storePrice - price) / storePrice) * 100)
}

export function ProductManager({ businesses }: { businesses: Business[] }) {
  const [selectedBusiness, setSelectedBusiness] = useState<string>("")
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    if (!selectedBusiness) return
    setLoading(true)
    const res = await fetch(`/api/products?businessId=${selectedBusiness}`)
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }, [selectedBusiness])

  const fetchCategories = useCallback(async () => {
    if (!selectedBusiness) return
    const res = await fetch(`/api/categories?businessId=${selectedBusiness}`)
    const data = await res.json()
    setCategories(data)
  }, [selectedBusiness])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  function CreateForm({ onClose }: { onClose: () => void }) {
    const [name, setName] = useState("")
    const [storePrice, setStorePrice] = useState("")
    const [memberPrice, setMemberPrice] = useState("")
    const [categoryId, setCategoryId] = useState("")
    const [saving, setSaving] = useState(false)

    const discountPct = calcDiscount(
      storePrice ? parseFloat(storePrice) : null,
      parseFloat(memberPrice) || 0,
    )

    async function handleSave() {
      if (!name || !memberPrice) return
      setSaving(true)
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(memberPrice) || 0,
          storePrice: storePrice ? parseFloat(storePrice) : null,
          businessId: selectedBusiness,
          categoryId: categoryId || undefined,
        }),
      })
      await fetchProducts()
      setSaving(false)
      onClose()
    }

    return (
      <div className="bg-[#f5f5f7] p-4 space-y-3 border-b border-[#e0e0e0]">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs text-[#7a7a7a] mb-1 block">Nombre *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-sm rounded-full"
              placeholder="Nombre del producto"
            />
          </div>
          <div>
            <Label className="text-xs text-[#7a7a7a] mb-1 block">Precio Tienda</Label>
            <Input
              type="number"
              value={storePrice}
              onChange={(e) => setStorePrice(e.target.value)}
              placeholder="Sin membresia"
              className="h-8 text-sm rounded-full"
            />
          </div>
          <div>
            <Label className="text-xs text-[#7a7a7a] mb-1 block">Precio Membresia *</Label>
            <Input
              type="number"
              value={memberPrice}
              onChange={(e) => setMemberPrice(e.target.value)}
              className="h-8 text-sm rounded-full"
            />
          </div>
          <div>
            <Label className="text-xs text-[#7a7a7a] mb-1 block">Categoria</Label>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
              <SelectTrigger className="rounded-full h-8 text-sm">
                <SelectValue placeholder="Sin categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin categoria</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {discountPct > 0 ? (
              <Badge className="rounded-full bg-green-100 text-green-700 text-xs">
                Descuento: {discountPct}%
              </Badge>
            ) : (
              <span className="text-xs text-[#7a7a7a]">Sin descuento</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving || !name || !memberPrice}
              className="rounded-full h-8 text-xs bg-[#0066cc] hover:bg-[#0071e3] text-white"
            >
              <Check className="h-3 w-3 mr-1" />
              {saving ? "Guardando..." : "Crear"}
            </Button>
            <Button size="sm" variant="outline" onClick={onClose} className="rounded-full h-8 text-xs">
              <X className="h-3 w-3 mr-1" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  function EditForm({ product, onClose }: { product: Product; onClose: () => void }) {
    const [name, setName] = useState(product.name)
    const [storePrice, setStorePrice] = useState(product.storePrice?.toString() || "")
    const [memberPrice, setMemberPrice] = useState(product.price.toString())
    const [categoryId, setCategoryId] = useState(product.categoryId || "")
    const [saving, setSaving] = useState(false)

    const discountPct = calcDiscount(
      storePrice ? parseFloat(storePrice) : null,
      parseFloat(memberPrice) || 0,
    )

    async function handleSave() {
      setSaving(true)
      await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price: parseFloat(memberPrice) || 0,
          storePrice: storePrice ? parseFloat(storePrice) : null,
          categoryId: categoryId || null,
        }),
      })
      await fetchProducts()
      setSaving(false)
      onClose()
    }

    return (
      <div className="bg-[#f5f5f7] p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs text-[#7a7a7a] mb-1 block">Nombre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-sm rounded-full"
            />
          </div>
          <div>
            <Label className="text-xs text-[#7a7a7a] mb-1 block">Precio Tienda</Label>
            <Input
              type="number"
              value={storePrice}
              onChange={(e) => setStorePrice(e.target.value)}
              placeholder="Sin membresia"
              className="h-8 text-sm rounded-full"
            />
          </div>
          <div>
            <Label className="text-xs text-[#7a7a7a] mb-1 block">Precio Membresia</Label>
            <Input
              type="number"
              value={memberPrice}
              onChange={(e) => setMemberPrice(e.target.value)}
              className="h-8 text-sm rounded-full"
            />
          </div>
          <div>
            <Label className="text-xs text-[#7a7a7a] mb-1 block">Categoria</Label>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
              <SelectTrigger className="rounded-full h-8 text-sm">
                <SelectValue placeholder="Sin categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin categoria</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {discountPct > 0 ? (
              <Badge className="rounded-full bg-green-100 text-green-700 text-xs">
                Descuento: {discountPct}%
              </Badge>
            ) : (
              <span className="text-xs text-[#7a7a7a]">Sin descuento</span>
            )}
            {discountPct > 0 && (
              <span className="text-xs text-[#7a7a7a]">
                Tienda: {formatPrice(parseFloat(storePrice) || 0)} → Membresia: {formatPrice(parseFloat(memberPrice) || 0)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full h-8 text-xs bg-[#0066cc] hover:bg-[#0071e3] text-white"
            >
              <Check className="h-3 w-3 mr-1" />
              {saving ? "Guardando..." : "Guardar"}
            </Button>
            <Button size="sm" variant="outline" onClick={onClose} className="rounded-full h-8 text-xs">
              <X className="h-3 w-3 mr-1" />
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  function DeleteConfirm({ product, onClose }: { product: Product; onClose: () => void }) {
    const [deleting, setDeleting] = useState(false)

    async function handleDelete() {
      setDeleting(true)
      await fetch(`/api/products/${product.id}`, { method: "DELETE" })
      await fetchProducts()
      setDeleting(false)
      onClose()
    }

    return (
      <div className="bg-red-50 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">
            Eliminar &ldquo;{product.name}&rdquo;?
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-full h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
          >
            {deleting ? "Eliminando..." : "Si, eliminar"}
          </Button>
          <Button size="sm" variant="outline" onClick={onClose} className="rounded-full h-8 text-xs">
            Cancelar
          </Button>
        </div>
      </div>
    )
  }

  function CategoriesSection({
    businessId,
    categories,
    onRefresh,
  }: {
    businessId: string
    categories: Category[]
    onRefresh: () => void
  }) {
    const [showCreate, setShowCreate] = useState(false)
    const [catName, setCatName] = useState("")
    const [editingCatId, setEditingCatId] = useState<string | null>(null)
    const [editName, setEditName] = useState("")
    const [deletingCatId, setDeletingCatId] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [open, setOpen] = useState(false)

    async function handleCreate() {
      if (!catName.trim()) return
      setSaving(true)
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName.trim(), businessId }),
      })
      setCatName("")
      setShowCreate(false)
      setSaving(false)
      onRefresh()
    }

    async function handleUpdate(catId: string) {
      if (!editName.trim()) return
      setSaving(true)
      await fetch(`/api/categories/${catId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      })
      setEditingCatId(null)
      setSaving(false)
      onRefresh()
    }

    async function handleDelete(catId: string) {
      setSaving(true)
      await fetch(`/api/categories/${catId}`, { method: "DELETE" })
      setDeletingCatId(null)
      setSaving(false)
      onRefresh()
    }

    return (
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 mb-6">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-sm font-semibold text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
          >
            <span>{open ? "▾" : "▸"}</span>
            Categorias ({categories.length})
          </button>
          <Button
            size="sm"
            onClick={() => setShowCreate(!showCreate)}
            className="rounded-full h-8 text-xs bg-[#0066cc] hover:bg-[#0071e3] text-white"
          >
            <Plus className="h-3 w-3 mr-1" />
            Nueva
          </Button>
        </div>

        {open && (
          <>

        {showCreate && (
          <div className="flex items-center gap-2 mb-3 bg-[#f5f5f7] p-3 rounded-lg">
            <Input
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="Nombre de la categoria"
              className="h-8 text-sm rounded-full flex-1"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleCreate}
              disabled={saving || !catName.trim()}
              className="rounded-full h-8 text-xs bg-[#0066cc] hover:bg-[#0071e3] text-white"
            >
              <Check className="h-3 w-3 mr-1" />
              Crear
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowCreate(false)
                setCatName("")
              }}
              className="rounded-full h-8 text-xs"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}

        {categories.length === 0 ? (
          <p className="text-sm text-[#7a7a7a]">Sin categorias</p>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => {
              const isEditing = editingCatId === cat.id
              const isDeleting = deletingCatId === cat.id

              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between py-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="h-8 text-sm rounded-full flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(cat.id)}
                          disabled={saving || !editName.trim()}
                          className="rounded-full h-8 text-xs bg-[#0066cc] hover:bg-[#0071e3] text-white"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCatId(null)}
                          className="rounded-full h-8 text-xs"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-sm text-[#1d1d1f]">{cat.name}</span>
                    )}
                    {!isEditing && !isDeleting && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingCatId(cat.id)
                            setEditName(cat.name)
                            setDeletingCatId(null)
                          }}
                          className="h-7 w-7 rounded-full"
                        >
                          <Pencil className="h-3.5 w-3.5 text-[#0066cc]" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setDeletingCatId(cat.id)
                            setEditingCatId(null)
                          }}
                          className="h-7 w-7 rounded-full"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {isDeleting && (
                    <div className="bg-red-50 p-2 rounded-lg flex items-center gap-2">
                      <span className="text-xs text-red-700">
                        Eliminar &ldquo;{cat.name}&rdquo;? Los productos pasaran a General.
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleDelete(cat.id)}
                        disabled={saving}
                        className="rounded-full h-7 text-[10px] bg-red-600 hover:bg-red-700 text-white"
                      >
                        Si
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeletingCatId(null)}
                        className="rounded-full h-7 text-[10px]"
                      >
                        No
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
        </>
      )}
      </div>
    )
  }

  const [selectorOpen, setSelectorOpen] = useState(false)
  const selectedLabel = businesses.find((b) => b.id === selectedBusiness)?.name

  return (
    <div>
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 mb-6">
        <Label className="mb-2 block text-sm">Seleccionar pyme</Label>
        <Popover open={selectorOpen} onOpenChange={setSelectorOpen}>
          <PopoverTrigger className="inline-flex items-center justify-between w-full max-w-sm rounded-full h-9 px-3 text-sm border border-border bg-background hover:bg-muted transition-colors">
            <span className="flex items-center gap-2">
              <Store className="h-4 w-4 text-[#7a7a7a]" />
              {selectedLabel || "Elegir pyme..."}
            </span>
            <ChevronsUpDown className="h-4 w-4 text-[#7a7a7a]" />
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar pyme..." className="h-9" />
              <CommandList>
                <CommandEmpty>No se encontraron pymes.</CommandEmpty>
                <CommandGroup>
                  {businesses.map((b) => (
                    <CommandItem
                      key={b.id}
                      value={b.name}
                      onSelect={() => {
                        setSelectedBusiness(b.id)
                        setSelectorOpen(false)
                      }}
                      className="flex items-center gap-2"
                    >
                      <Store className="h-4 w-4 text-[#7a7a7a]" />
                      <span>{b.name}</span>
                      {selectedBusiness === b.id && (
                        <Check className="h-4 w-4 ml-auto text-[#0066cc]" />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedBusiness && (
        <>
          <CategoriesSection
            businessId={selectedBusiness}
            categories={categories}
            onRefresh={fetchCategories}
          />
          <div className="mb-4">
            <Button
              onClick={() => {
                setShowCreate(!showCreate)
                setEditingId(null)
                setDeletingId(null)
              }}
              className="rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white h-8 text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              Nuevo producto
            </Button>
          </div>
        </>
      )}

      {loading && <p className="text-sm text-[#7a7a7a]">Cargando productos...</p>}

      <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
        {showCreate && <CreateForm onClose={() => setShowCreate(false)} />}
        {products.length > 0 ? (
          products.map((p) => {
            const isEditing = editingId === p.id
            const isDeleting = deletingId === p.id
            const discount = calcDiscount(p.storePrice, p.price)

            return (
              <div key={p.id}>
                <div className="flex items-center justify-between p-4 border-b border-[#f0f0f0] last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1d1d1f] truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {discount > 0 && p.storePrice ? (
                        <>
                          <span className="text-xs text-[#7a7a7a] line-through">
                            {formatPrice(p.storePrice)}
                          </span>
                          <span className="text-sm font-semibold text-[#1d1d1f]">
                            {formatPrice(p.price)}
                          </span>
                          <Badge className="rounded-full bg-green-100 text-green-700 text-[10px]">
                            -{discount}%
                          </Badge>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-[#1d1d1f]">
                          {formatPrice(p.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`rounded-full text-xs ${p.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {p.available ? "Disponible" : "Agotado"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setEditingId(isEditing ? null : p.id)
                        setDeletingId(null)
                        setShowCreate(false)
                      }}
                      className="h-8 w-8 rounded-full"
                    >
                      <Pencil className="h-4 w-4 text-[#0066cc]" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setDeletingId(isDeleting ? null : p.id)
                        setEditingId(null)
                        setShowCreate(false)
                      }}
                      className="h-8 w-8 rounded-full"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                {isEditing && <EditForm product={p} onClose={() => setEditingId(null)} />}
                {isDeleting && <DeleteConfirm product={p} onClose={() => setDeletingId(null)} />}
              </div>
            )
          })
        ) : (
          !showCreate && !loading && (
            <div className="text-center py-12">
              <p className="text-sm text-[#7a7a7a]">No hay productos. Crea el primero.</p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
