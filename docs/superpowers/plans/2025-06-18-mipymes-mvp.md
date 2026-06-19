# MiPymes MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the MiPymes MVP -- a directory of local businesses with daily-updated catalogs, membership benefits, and a centralized admin panel.

**Architecture:** Next.js 16 App Router with route groups (`(public)` for the storefront, `(dashboard)` for the admin panel, `(auth)` for login/register). Server Components fetch directly from Drizzle ORM + Neon Postgres. better-auth handles authentication with email/password. Apple Design System from DESIGN.md drives all UI.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS v4, shadcn/ui (base-nova), Drizzle ORM, Neon Serverless Postgres, better-auth, React Hook Form + Zod, Resend (email later), Inter font

---

## File Structure Map

```
src/
  app/
    (public)/           # Public storefront
      page.tsx          # Landing page (tiles grid)
      layout.tsx        # Public layout (nav + footer)
      negocio/          # Business directory
        page.tsx        # All businesses list
        [slug]/         # Single business
          page.tsx      # Business detail + catalog
    (auth)/             # Authentication
      page.tsx          # Login form
      layout.tsx        # Auth layout (centered)
    (dashboard)/        # Admin panel (protected)
      layout.tsx        # Dashboard layout (sidebar)
      page.tsx          # Dashboard home (stats)
      pymes/            # Business management
        page.tsx        # List businesses
        nueva/page.tsx  # Create business
        [id]/page.tsx   # Edit business
      productos/        # Product management
        page.tsx        # List products (by business)
      membresias/       # Membership management
        page.tsx        # Manage user memberships
      promociones/      # Promotions management
        page.tsx        # List/create promotions
    api/auth/[...all]/  # better-auth API route
    layout.tsx          # Root layout (font + providers)
  components/
    ui/                 # shadcn components (generated)
    layout/             # App layout components
      public-nav.tsx    # Apple-style top nav
      public-footer.tsx # Footer
      dashboard-sidebar.tsx
    public/             # Public-facing components
      business-card.tsx # Business tile card
      product-card.tsx  # Product card in catalog
      promotion-badge.tsx
      category-filter.tsx
    memberships/
      member-badge.tsx  # Active membership indicator
      benefit-card.tsx
  db/
    schema/index.ts     # Drizzle schema (DONE)
    index.ts            # DB client (DONE)
    queries/            # Data access functions
      businesses.ts
      products.ts
      promotions.ts
      memberships.ts
      users.ts
  lib/
    utils.ts            # cn, formatPrice, formatDate (DONE)
    auth/
      index.ts          # better-auth server config (DONE)
      client.ts         # better-auth client (DONE)
    validations/        # Zod schemas
      business.ts
      product.ts
drizzle.config.ts       # (DONE)
drizzle/                # Migration files
```

---

### Task 1: Middleware & Auth Protection

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Create middleware for route protection**

```typescript
// src/middleware.ts
import { betterAuthMiddleware } from "better-auth/next-js"

export const middleware = betterAuthMiddleware({
  redirect: "/",
  protectedPaths: ["/dashboard"],
  publicPaths: ["/", "/negocio", "/api/auth", "/api/upload"],
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
```

- [ ] **Step 2: Run build check**

```bash
pnpm build
```

Expected: Should compile (may have unused imports from generated layout).

---

### Task 2: Public Layout with Apple Navigation

**Files:**
- Create: `src/components/layout/public-nav.tsx`
- Create: `src/components/layout/public-footer.tsx`
- Create: `src/app/(public)/layout.tsx`

- [ ] **Step 1: Create public navigation (Apple-style global nav + sub-nav)**

```tsx
// src/components/layout/public-nav.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function PublicNav() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <header>
      <nav className="h-11 bg-[#000000] text-white flex items-center justify-center px-4">
        <div className="flex items-center gap-5 max-w-[980px] w-full justify-between">
          <Link href="/" className="text-xs font-normal tracking-[-0.12px]">
            MiPymes
          </Link>
          <div className="flex items-center gap-5">
            <Link href="/negocio" className="text-xs font-normal tracking-[-0.12px] text-white/80 hover:text-white transition-colors">
              Negocios
            </Link>
            {session ? (
              <Link href="/dashboard" className="text-xs font-normal tracking-[-0.12px] text-white/80 hover:text-white transition-colors">
                Panel
              </Link>
            ) : (
              <Link href="/login" className="text-xs font-normal tracking-[-0.12px] text-white/80 hover:text-white transition-colors">
                Ingresar
              </Link>
            )}
          </div>
        </div>
      </nav>
      <div className="h-[52px] bg-[#f5f5f7]/80 backdrop-blur-xl flex items-center justify-center px-4 border-b border-black/5">
        <div className="flex items-center max-w-[980px] w-full justify-between">
          <span className="text-[21px] font-semibold tracking-[0.231px]">
            Apoya tu comercio local
          </span>
          <div className="flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 rounded-sm">
                  <AvatarFallback className="text-[10px] rounded-sm bg-[#0066cc] text-white">
                    {session.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-[#1d1d1f]">{session.user.name}</span>
              </div>
            ) : (
              <Button asChild className="rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white h-8 px-4 text-sm">
                <Link href="/login">Unirme</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
```

```tsx
// src/components/layout/public-footer.tsx
import Link from "next/link"

export function PublicFooter() {
  return (
    <footer className="bg-[#f5f5f7] py-16 px-4">
      <div className="max-w-[980px] mx-auto">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f] mb-3">MiPymes</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/negocio" className="text-xs text-[#7a7a7a] hover:text-[#0066cc] transition-colors">
                  Descubrir negocios
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-xs text-[#7a7a7a] hover:text-[#0066cc] transition-colors">
                  Membresia
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f] mb-3">Contacto</h3>
            <p className="text-xs text-[#7a7a7a]">
              info@mipymes.co
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#1d1d1f] mb-3">Legal</h3>
            <p className="text-xs text-[#7a7a7a]">
              Los precios pueden variar sin previo aviso.
              Consulta con cada comercio para el precio final.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-[#e0e0e0]">
          <p className="text-[10px] text-[#7a7a7a]">
            &copy; {new Date().getFullYear()} MiPymes. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

```tsx
// src/app/(public)/layout.tsx
import { PublicNav } from "@/components/layout/public-nav"
import { PublicFooter } from "@/components/layout/public-footer"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicNav />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </>
  )
}
```

- [ ] **Step 2: Run build check**

```bash
pnpm build
```

Expected: Compiles successfully, may warn about unused default export on `page.tsx`.

---

### Task 3: Database Query Layer

**Files:**
- Create: `src/db/queries/businesses.ts`
- Create: `src/db/queries/products.ts`
- Create: `src/db/queries/promotions.ts`
- Create: `src/db/queries/users.ts`

- [ ] **Step 1: Create business queries**

```typescript
// src/db/queries/businesses.ts
import { db } from "@/db"
import { businessesTable, categoriesTable } from "@/db/schema"
import { eq, and, sql } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function getBusinesses() {
  return db.query.businessesTable.findMany({
    where: eq(businessesTable.active, true),
    orderBy: (businesses, { desc }) => [desc(businesses.updatedAt)],
  })
}

export async function getBusinessBySlug(slug: string) {
  return db.query.businessesTable.findFirst({
    where: and(eq(businessesTable.slug, slug), eq(businessesTable.active, true)),
    with: {
      categories: true,
    },
  })
}

export async function getAllBusinessesForAdmin() {
  return db.query.businessesTable.findMany({
    orderBy: (businesses, { desc }) => [desc(businesses.updatedAt)],
  })
}

export async function getBusinessById(id: string) {
  return db.query.businessesTable.findFirst({
    where: eq(businessesTable.id, id),
    with: {
      categories: true,
    },
  })
}

export async function createBusiness(data: {
  name: string
  slug: string
  description?: string
  type: string
  address?: string
  phone?: string
  whatsapp?: string
  logo?: string
  discountPercentage?: number
  premiumDiscountPercentage?: number
  priorityEnabled?: boolean
  deliveryEnabled?: boolean
  updatedBy?: string
}) {
  return db.insert(businessesTable).values({
    id: nanoid(),
    ...data,
    type: data.type as any,
  }).returning()
}

export async function updateBusiness(id: string, data: Record<string, any>) {
  return db.update(businessesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(businessesTable.id, id))
    .returning()
}
```

```typescript
// src/db/queries/products.ts
import { db } from "@/db"
import { productsTable } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function getProductsByBusiness(businessId: string) {
  return db.query.productsTable.findMany({
    where: eq(productsTable.businessId, businessId),
    orderBy: (products, { asc }) => [asc(products.categoryId), asc(products.name)],
    with: {
      category: true,
    },
  })
}

export async function getAvailableProducts(businessId: string) {
  return db.query.productsTable.findMany({
    where: and(
      eq(productsTable.businessId, businessId),
      eq(productsTable.available, true)
    ),
    orderBy: (products, { asc }) => [asc(products.categoryId), asc(products.name)],
    with: {
      category: true,
    },
  })
}

export async function createProduct(data: {
  name: string
  description?: string
  price: number
  image?: string
  businessId: string
  categoryId?: string
  discountable?: boolean
  updatedBy?: string
}) {
  return db.insert(productsTable).values({
    id: nanoid(),
    ...data,
  }).returning()
}

export async function updateProduct(id: string, data: Record<string, any>) {
  return db.update(productsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(productsTable.id, id))
    .returning()
}

export async function toggleProductAvailability(id: string, available: boolean) {
  return db.update(productsTable)
    .set({ available, updatedAt: new Date() })
    .where(eq(productsTable.id, id))
    .returning()
}
```

```typescript
// src/db/queries/promotions.ts
import { db } from "@/db"
import { promotionsTable } from "@/db/schema"
import { eq, and, gt, lt, or, isNull } from "drizzle-orm"
import { nanoid } from "nanoid"

export async function getActivePromotions() {
  const now = new Date()
  return db.query.promotionsTable.findMany({
    where: and(
      eq(promotionsTable.active, true),
      or(
        isNull(promotionsTable.startsAt),
        lt(promotionsTable.startsAt, now)
      ),
      or(
        isNull(promotionsTable.endsAt),
        gt(promotionsTable.endsAt, now)
      )
    ),
    orderBy: (promotions, { desc }) => [desc(promotions.featured), desc(promotions.createdAt)],
    with: {
      business: true,
      product: true,
    },
  })
}

export async function getFeaturedPromotions() {
  const now = new Date()
  return db.query.promotionsTable.findMany({
    where: and(
      eq(promotionsTable.active, true),
      eq(promotionsTable.featured, true),
      or(isNull(promotionsTable.startsAt), lt(promotionsTable.startsAt, now)),
      or(isNull(promotionsTable.endsAt), gt(promotionsTable.endsAt, now))
    ),
    orderBy: (promotions, { desc }) => [desc(promotions.createdAt)],
    with: {
      business: true,
    },
  })
}

export async function getPromotionsByBusiness(businessId: string) {
  return db.query.promotionsTable.findMany({
    where: eq(promotionsTable.businessId, businessId),
    orderBy: (promotions, { desc }) => [desc(promotions.createdAt)],
    with: {
      product: true,
    },
  })
}

export async function getAllPromotionsForAdmin() {
  return db.query.promotionsTable.findMany({
    orderBy: (promotions, { desc }) => [desc(promotions.createdAt)],
    with: {
      business: true,
      product: true,
    },
  })
}

export async function createPromotion(data: {
  title: string
  description?: string
  type: string
  discountValue?: number
  image?: string
  businessId: string
  productId?: string
  startsAt?: Date
  endsAt?: Date
  featured?: boolean
  createdBy?: string
}) {
  return db.insert(promotionsTable).values({
    id: nanoid(),
    ...data,
    type: data.type as any,
  }).returning()
}

export async function updatePromotion(id: string, data: Record<string, any>) {
  return db.update(promotionsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(promotionsTable.id, id))
    .returning()
}

export async function togglePromotionActive(id: string, active: boolean) {
  return db.update(promotionsTable)
    .set({ active, updatedAt: new Date() })
    .where(eq(promotionsTable.id, id))
    .returning()
}
```

```typescript
// src/db/queries/users.ts
import { db } from "@/db"
import { usersTable } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUserMembershipStatus(userId: string) {
  return db.query.usersTable.findFirst({
    where: eq(usersTable.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
      membershipStatus: true,
      membershipType: true,
      membershipExpiresAt: true,
    },
  })
}

export async function getAllUsersForAdmin() {
  return db.query.usersTable.findMany({
    orderBy: (users, { desc }) => [desc(users.createdAt)],
    columns: {
      id: true,
      name: true,
      email: true,
      phone: true,
      membershipStatus: true,
      membershipType: true,
      membershipExpiresAt: true,
      createdAt: true,
    },
  })
}

export async function updateUserMembership(
  userId: string,
  data: {
    membershipStatus: string
    membershipType?: string
    membershipExpiresAt?: Date
  }
) {
  return db.update(usersTable)
    .set({
      ...data,
      membershipStatus: data.membershipStatus as any,
      updatedAt: new Date(),
    })
    .where(eq(usersTable.id, userId))
    .returning()
}
```

- [ ] **Step 2: Install nanoid**

```bash
pnpm add nanoid
```

- [ ] **Step 3: Run type check**

```bash
npx tsc --noEmit
```

Expected: No type errors. Fix any that appear.

---

### Task 4: Public Landing Page (Apple-Style Tiles)

**Files:**
- Create: `src/app/(public)/page.tsx`
- Create: `src/components/public/business-card.tsx`

- [ ] **Step 1: Create business card component**

```tsx
// src/components/public/business-card.tsx
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import type { businessesTable } from "@/db/schema"

type Business = typeof businessesTable.$inferSelect

export function BusinessCard({ business }: { business: Business }) {
  const typeLabel: Record<string, string> = {
    supermarket: "Supermercado",
    restaurant: "Restaurante",
    pharmacy: "Farmacia",
    gas_station: "Gasolinera",
    store: "Tienda",
    other: "Otro",
  }

  return (
    <Link
      href={`/negocio/${business.slug}`}
      className="group block bg-white rounded-[18px] border border-[#e0e0e0] p-6 hover:border-[#0066cc]/30 transition-colors"
    >
      {business.logo && (
        <div className="w-full h-32 mb-4 rounded-lg bg-[#f5f5f7] flex items-center justify-center overflow-hidden">
          <img
            src={business.logo}
            alt={business.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
          {business.name}
        </h3>
        {business.discountPercentage > 0 && (
          <Badge className="rounded-full bg-[#0066cc] hover:bg-[#0066cc] text-white text-xs">
            -{business.discountPercentage}%
          </Badge>
        )}
      </div>
      <p className="text-sm text-[#7a7a7a] mb-3 tracking-[-0.224px]">
        {business.description || typeLabel[business.type] || "Negocio local"}
      </p>
      {business.priorityEnabled && (
        <Badge variant="outline" className="rounded-full text-xs border-[#0066cc] text-[#0066cc]">
          Fila prioritaria
        </Badge>
      )}
      {business.deliveryEnabled && (
        <Badge variant="outline" className="rounded-full text-xs ml-1">
          Domicilio
        </Badge>
      )}
    </Link>
  )
}
```

- [ ] **Step 2: Create landing page**

```tsx
// src/app/(public)/page.tsx
import { getBusinesses } from "@/db/queries/businesses"
import { getFeaturedPromotions } from "@/db/queries/promotions"
import { BusinessCard } from "@/components/public/business-card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function HomePage() {
  const [businesses, featuredPromotions] = await Promise.all([
    getBusinesses(),
    getFeaturedPromotions(),
  ])

  return (
    <div>
      {/* Hero Section - Apple-style product tile */}
      <section className="py-20 px-4 text-center bg-white">
        <h1 className="text-[40px] font-semibold leading-[1.1] tracking-[-0.374px] text-[#1d1d1f] max-w-[680px] mx-auto">
          Los mejores precios de tu ciudad, en un solo lugar
        </h1>
        <p className="text-[28px] font-light leading-[1.14] tracking-[0.196px] text-[#7a7a7a] mt-3 max-w-[600px] mx-auto">
          Descubre negocios locales, compara precios y ahorra con tu membresia
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Link
            href="/negocio"
            className="inline-flex items-center justify-center rounded-full bg-[#0066cc] text-white text-[17px] font-normal tracking-[-0.374px] px-[22px] py-[11px] hover:bg-[#0071e3] active:scale-95 transition-transform"
          >
            Explorar negocios
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-full border border-[#0066cc] text-[#0066cc] text-[17px] font-normal tracking-[-0.374px] px-[22px] py-[11px] hover:bg-[#0066cc]/5 active:scale-95 transition-all"
          >
            Obtener membresia
          </Link>
        </div>
      </section>

      {/* Featured Promotions - Parchment tile */}
      {featuredPromotions.length > 0 && (
        <section className="py-20 px-4 bg-[#f5f5f7]">
          <div className="max-w-[980px] mx-auto">
            <h2 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-[#1d1d1f] text-center mb-12">
              Ofertas destacadas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPromotions.map((promo) => (
                <Link
                  key={promo.id}
                  href={`/negocio/${promo.business?.slug}`}
                  className="block bg-white rounded-[18px] border border-[#e0e0e0] p-6 hover:border-[#0066cc]/30 transition-colors"
                >
                  <Badge className="rounded-full bg-[#0066cc] hover:bg-[#0066cc] text-white text-xs mb-3">
                    {promo.type === "discount" ? "Descuento" : promo.type === "offer" ? "Oferta" : "Destacado"}
                  </Badge>
                  <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-[#7a7a7a] mt-1 tracking-[-0.224px]">
                    {promo.description}
                  </p>
                  {promo.business && (
                    <p className="text-xs text-[#0066cc] mt-3">
                      En {promo.business.name}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Businesses Grid - White section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[980px] mx-auto">
          <h2 className="text-[34px] font-semibold leading-[1.47] tracking-[-0.374px] text-[#1d1d1f] text-center mb-3">
            Negocios locales
          </h2>
          <p className="text-[17px] text-[#7a7a7a] text-center mb-12">
            {businesses.length} negocio{businesses.length !== 1 ? "s" : ""} disponible{businesses.length !== 1 ? "s" : ""}
          </p>
          {businesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[17px] text-[#7a7a7a]">
                Pronto tendremos negocios disponibles. Vuelve pronto!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 3: Run build check**

```bash
pnpm build
```

Expected: Compiles. Fix any import errors.

---

### Task 5: Business Directory Page

**Files:**
- Create: `src/app/(public)/negocio/page.tsx`
- Create: `src/components/public/category-filter.tsx`

- [ ] **Step 1: Create category filter component**

```tsx
// src/components/public/category-filter.tsx
"use client"

import { useRouter, useSearchParams } from "next/navigation"

const types = [
  { value: "", label: "Todas" },
  { value: "supermarket", label: "Supermercados" },
  { value: "restaurant", label: "Restaurantes" },
  { value: "pharmacy", label: "Farmacias" },
  { value: "gas_station", label: "Gasolineras" },
  { value: "store", label: "Tiendas" },
  { value: "other", label: "Otros" },
]

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get("tipo") || ""

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {types.map((t) => (
        <button
          key={t.value}
          onClick={() => {
            const params = new URLSearchParams(searchParams)
            if (t.value) {
              params.set("tipo", t.value)
            } else {
              params.delete("tipo")
            }
            router.push(`/negocio?${params.toString()}`)
          }}
          className={`rounded-full px-4 py-2 text-sm transition-colors ${
            current === t.value
              ? "bg-[#0066cc] text-white"
              : "bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e0e0e0]"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create directory page**

```tsx
// src/app/(public)/negocio/page.tsx
import { getBusinesses } from "@/db/queries/businesses"
import { BusinessCard } from "@/components/public/business-card"
import { CategoryFilter } from "@/components/public/category-filter"
import { Suspense } from "react"
import { eq } from "drizzle-orm"
import { businessesTable } from "@/db/schema"
import { db } from "@/db"

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>
}) {
  const { tipo } = await searchParams
  const businesses = await db.query.businessesTable.findMany({
    where: tipo ? eq(businessesTable.type, tipo as any) : eq(businessesTable.active, true),
    orderBy: (businesses, { desc }) => [desc(businesses.updatedAt)],
  })

  return (
    <div className="py-20 px-4">
      <div className="max-w-[980px] mx-auto">
        <h1 className="text-[40px] font-semibold leading-[1.1] text-[#1d1d1f] text-center mb-3">
          Negocios
        </h1>
        <p className="text-[17px] text-[#7a7a7a] text-center mb-8">
          Descubre las mejores pymes de tu ciudad
        </p>
        <Suspense fallback={null}>
          <CategoryFilter />
        </Suspense>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-[17px] text-[#7a7a7a]">
                No se encontraron negocios en esta categoria.
              </p>
            </div>
          ) : (
            businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Build check**

```bash
pnpm build
```

---

### Task 6: Business Detail Page with Catalog

**Files:**
- Create: `src/app/(public)/negocio/[slug]/page.tsx`
- Create: `src/components/public/product-card.tsx`
- Create: `src/components/public/promotion-badge.tsx`
- Create: `src/components/memberships/benefit-card.tsx`

- [ ] **Step 1: Create product card**

```tsx
// src/components/public/product-card.tsx
import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import type { productsTable, categoriesTable } from "@/db/schema"

type Product = typeof productsTable.$inferSelect & {
  category: typeof categoriesTable.$inferSelect | null
}

export function ProductCard({
  product,
  discountPercentage,
}: {
  product: Product
  discountPercentage: number
}) {
  const discountedPrice = product.discountable
    ? product.price * (1 - discountPercentage / 100)
    : product.price

  return (
    <div className="flex items-center gap-4 p-4 border-b border-[#f0f0f0] last:border-0">
      {product.image ? (
        <div className="w-16 h-16 rounded-lg bg-[#f5f5f7] flex-shrink-0 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-lg bg-[#f5f5f7] flex-shrink-0 flex items-center justify-center">
          <span className="text-2xl text-[#7a7a7a]">
            {product.name.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px] truncate">
            {product.name}
          </h3>
          {!product.available && (
            <Badge variant="outline" className="rounded-full text-xs text-[#7a7a7a]">
              Agotado
            </Badge>
          )}
        </div>
        {product.description && (
          <p className="text-sm text-[#7a7a7a] mt-0.5">{product.description}</p>
        )}
        {product.category && (
          <span className="text-xs text-[#0066cc]">{product.category.name}</span>
        )}
      </div>
      <div className="text-right flex-shrink-0">
        {discountPercentage > 0 && product.discountable ? (
          <>
            <p className="text-xs text-[#7a7a7a] line-through">
              {formatPrice(product.price)}
            </p>
            <p className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
              {formatPrice(discountedPrice)}
            </p>
            <Badge className="rounded-full bg-green-100 text-green-700 hover:bg-green-100 text-[10px]">
              -{discountPercentage}%
            </Badge>
          </>
        ) : (
          <p className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
            {formatPrice(product.price)}
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create benefit card component**

```tsx
// src/components/memberships/benefit-card.tsx
import { Badge } from "@/components/ui/badge"

interface BenefitCardProps {
  businessName: string
  discountPercentage: number
  premiumDiscountPercentage?: number
  priorityEnabled: boolean
  deliveryEnabled: boolean
  isLoggedIn: boolean
  membershipStatus?: string
}

export function BenefitCard({
  businessName,
  discountPercentage,
  premiumDiscountPercentage,
  priorityEnabled,
  deliveryEnabled,
  isLoggedIn,
  membershipStatus,
}: BenefitCardProps) {
  const isActive = membershipStatus === "active"
  const discount = membershipStatus === "premium" && premiumDiscountPercentage
    ? premiumDiscountPercentage
    : discountPercentage

  return (
    <div className="bg-[#f5f5f7] rounded-[18px] p-6">
      <h3 className="text-[17px] font-semibold text-[#1d1d1f] mb-4 tracking-[-0.374px]">
        Beneficios en {businessName}
      </h3>
      {isLoggedIn && isActive ? (
        <div className="space-y-2">
          {discount > 0 && (
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-green-100 text-green-700 hover:bg-green-100">
                {discount}% descuento
              </Badge>
              <span className="text-sm text-[#1d1d1f]">En productos aplicables</span>
            </div>
          )}
          {priorityEnabled && (
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-[#0066cc] hover:bg-[#0066cc] text-white">
                Prioridad
              </Badge>
              <span className="text-sm text-[#1d1d1f]">Fila preferencial</span>
            </div>
          )}
          {deliveryEnabled && membershipStatus === "premium" && (
            <div className="flex items-center gap-2">
              <Badge className="rounded-full bg-purple-100 text-purple-700 hover:bg-purple-100">
                Premium
              </Badge>
              <span className="text-sm text-[#1d1d1f]">Domicilio gratis</span>
            </div>
          )}
        </div>
      ) : isLoggedIn ? (
        <p className="text-sm text-[#7a7a7a]">
          Tu membresia no esta activa. Contactanos para activarla.
        </p>
      ) : (
        <p className="text-sm text-[#7a7a7a]">
          Inicia sesion para ver tus beneficios de membresia.
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create business detail page**

```tsx
// src/app/(public)/negocio/[slug]/page.tsx
import { notFound } from "next/navigation"
import { getBusinessBySlug } from "@/db/queries/businesses"
import { getAvailableProducts } from "@/db/queries/products"
import { getPromotionsByBusiness } from "@/db/queries/promotions"
import { ProductCard } from "@/components/public/product-card"
import { BenefitCard } from "@/components/memberships/benefit-card"
import { Badge } from "@/components/ui/badge"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getUserMembershipStatus } from "@/db/queries/users"

const typeLabel: Record<string, string> = {
  supermarket: "Supermercado",
  restaurant: "Restaurante",
  pharmacy: "Farmacia",
  gas_station: "Gasolinera",
  store: "Tienda",
  other: "Otro",
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const business = await getBusinessBySlug(slug)
  if (!business) notFound()

  const [products, promotions] = await Promise.all([
    getAvailableProducts(business.id),
    getPromotionsByBusiness(business.id),
  ])

  const session = await auth.api.getSession({ headers: await headers() })
  const membership = session
    ? await getUserMembershipStatus(session.user.id)
    : null

  const categories = business.categories || []
  const productsByCategory = new Map<string, typeof products>()
  products.forEach((p) => {
    const catId = p.categoryId || "sin-categoria"
    if (!productsByCategory.has(catId)) {
      productsByCategory.set(catId, [])
    }
    productsByCategory.get(catId)!.push(p)
  })

  return (
    <div>
      {/* Business Header - Product tile style */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-[980px] mx-auto text-center">
          {business.logo && (
            <img
              src={business.logo}
              alt={business.name}
              className="mx-auto mb-6 max-h-20 object-contain"
              style={{
                filter: "drop-shadow(rgba(0,0,0,0.22) 3px 5px 15px)",
              }}
            />
          )}
          <Badge className="rounded-full mb-3 bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#f5f5f7] border-0">
            {typeLabel[business.type] || business.type}
          </Badge>
          <h1 className="text-[40px] font-semibold leading-[1.1] text-[#1d1d1f] mb-3">
            {business.name}
          </h1>
          <p className="text-[17px] text-[#7a7a7a] max-w-[600px] mx-auto leading-[1.47] tracking-[-0.374px]">
            {business.description}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {business.priorityEnabled && (
              <Badge className="rounded-full text-xs bg-[#0066cc] hover:bg-[#0066cc] text-white">
                Fila prioritaria
              </Badge>
            )}
            {business.deliveryEnabled && (
              <Badge className="rounded-full text-xs" variant="outline">
                Domicilio disponible
              </Badge>
            )}
            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#0066cc] hover:underline"
              >
                Contactar
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-[980px] mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 py-12">
          {/* Product Catalog */}
          <div className="lg:col-span-2">
            {/* Promotions */}
            {promotions.length > 0 && (
              <div className="mb-8">
                <h2 className="text-[21px] font-semibold text-[#1d1d1f] mb-4 tracking-[0.231px]">
                  Promociones activas
                </h2>
                <div className="space-y-3">
                  {promotions.filter(p => p.active).map((promo) => (
                    <div
                      key={promo.id}
                      className="bg-[#f5f5f7] rounded-[18px] p-4 flex items-center gap-4"
                    >
                      <Badge className="rounded-full bg-[#0066cc] hover:bg-[#0066cc] text-white text-xs">
                        {promo.type === "discount"
                          ? `-${promo.discountValue}%`
                          : promo.type === "offer"
                          ? "Oferta"
                          : "Destacado"}
                      </Badge>
                      <div>
                        <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
                          {promo.title}
                        </h3>
                        {promo.description && (
                          <p className="text-sm text-[#7a7a7a]">
                            {promo.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            <h2 className="text-[21px] font-semibold text-[#1d1d1f] mb-4 tracking-[0.231px]">
              Catalogo
            </h2>
            <p className="text-xs text-[#7a7a7a] mb-6">
              Precios actualizados. Pueden variar sin previo aviso.
            </p>

            {categories.length > 0
              ? categories.map((cat) => {
                  const catProducts = productsByCategory.get(cat.id) || []
                  if (catProducts.length === 0) return null
                  return (
                    <div key={cat.id} className="mb-8">
                      <h3 className="text-sm font-semibold text-[#7a7a7a] mb-3 tracking-[-0.224px] uppercase">
                        {cat.name}
                      </h3>
                      <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
                        {catProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            discountPercentage={business.discountPercentage}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })
              : (() => {
                  const uncategorized = productsByCategory.get("sin-categoria") || []
                  if (uncategorized.length === 0 && products.length === 0) {
                    return (
                      <div className="text-center py-12">
                        <p className="text-[17px] text-[#7a7a7a]">
                          No hay productos disponibles en este momento.
                        </p>
                      </div>
                    )
                  }
                  return (
                    <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
                      {products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          discountPercentage={business.discountPercentage}
                        />
                      ))}
                    </div>
                  )
                })()}
          </div>

          {/* Sidebar - Benefits */}
          <div>
            <div className="sticky top-8">
              <BenefitCard
                businessName={business.name}
                discountPercentage={business.discountPercentage}
                premiumDiscountPercentage={business.premiumDiscountPercentage || undefined}
                priorityEnabled={business.priorityEnabled}
                deliveryEnabled={business.deliveryEnabled}
                isLoggedIn={!!session}
                membershipStatus={membership?.membershipStatus}
              />

              {business.address && (
                <div className="mt-4 bg-white rounded-[18px] border border-[#e0e0e0] p-6">
                  <h3 className="text-sm font-semibold text-[#1d1d1f] mb-2">Ubicacion</h3>
                  <p className="text-sm text-[#7a7a7a]">{business.address}</p>
                </div>
              )}

              {business.phone && (
                <div className="mt-4 bg-white rounded-[18px] border border-[#e0e0e0] p-6">
                  <h3 className="text-sm font-semibold text-[#1d1d1f] mb-2">Contacto</h3>
                  <p className="text-sm text-[#7a7a7a]">{business.phone}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Build check**

```bash
pnpm build
```

---

### Task 7: Auth Pages (Login / Register)

**Files:**
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/register/page.tsx`

- [ ] **Step 1: Create auth layout**

```tsx
// src/app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
      <div className="w-full max-w-[440px] px-4">{children}</div>
    </div>
  )
}
```

- [ ] **Step 2: Create login page**

```tsx
// src/app/(auth)/login/page.tsx
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
```

```tsx
// src/app/(auth)/login/login-form.tsx
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
```

- [ ] **Step 3: Create register page**

```tsx
// src/app/(auth)/register/page.tsx
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
          Unete a MiPymes y empieza a ahorrar
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
```

```tsx
// src/app/(auth)/register/register-form.tsx
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
```

- [ ] **Step 4: Build check**

```bash
pnpm build
```

---

### Task 8: Dashboard Layout & Sidebar

**Files:**
- Create: `src/components/layout/dashboard-sidebar.tsx`
- Create: `src/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Create dashboard sidebar**

```tsx
// src/components/layout/dashboard-sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { authClient } from "@/lib/auth/client"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Store,
  Package,
  Tags,
  Users,
  LogOut,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Inicio", icon: LayoutDashboard },
  { href: "/dashboard/pymes", label: "Pymes", icon: Store },
  { href: "/dashboard/productos", label: "Productos", icon: Package },
  { href: "/dashboard/promociones", label: "Promociones", icon: Tags },
  { href: "/dashboard/membresias", label: "Membresias", icon: Users },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className="w-60 min-h-screen bg-[#1d1d1f] text-white flex flex-col">
      <div className="h-11 flex items-center px-5 border-b border-white/10">
        <Link href="/dashboard" className="text-xs font-normal tracking-[-0.12px]">
          MiPymes Panel
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm transition-colors",
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={async () => {
            await authClient.signOut()
            router.push("/")
            router.refresh()
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-sm text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesion
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create dashboard layout**

```tsx
// src/app/(dashboard)/layout.tsx
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <main className="flex-1 bg-[#f5f5f7] p-8">{children}</main>
    </div>
  )
}
```

- [ ] **Step 3: Build check**

```bash
pnpm build
```

---

### Task 9: Dashboard Home (Stats)

**Files:**
- Create: `src/app/(dashboard)/page.tsx`

- [ ] **Step 1: Create dashboard home page**

```tsx
// src/app/(dashboard)/page.tsx
import { getAllBusinessesForAdmin } from "@/db/queries/businesses"
import { getAllUsersForAdmin } from "@/db/queries/users"
import { getAllPromotionsForAdmin } from "@/db/queries/promotions"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function DashboardHome() {
  const session = await auth.api.getSession({ headers: await headers() })
  const [businesses, users, promotions] = await Promise.all([
    getAllBusinessesForAdmin(),
    getAllUsersForAdmin(),
    getAllPromotionsForAdmin(),
  ])

  const activeMemberships = users.filter(
    (u) => u.membershipStatus === "active"
  ).length
  const activeBusinesses = businesses.filter((b) => b.active).length
  const activePromotions = promotions.filter((p) => p.active).length

  const stats = [
    { label: "Pymes activas", value: activeBusinesses },
    { label: "Membresias activas", value: activeMemberships },
    { label: "Promociones", value: activePromotions },
    { label: "Usuarios registrados", value: users.length },
  ]

  return (
    <div>
      <h1 className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-2">
        Bienvenido, {session?.user.name || "Admin"}
      </h1>
      <p className="text-[17px] text-[#7a7a7a] mb-8 tracking-[-0.374px]">
        Vista general del panel de administracion
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-[18px] border border-[#e0e0e0] p-6"
          >
            <p className="text-sm text-[#7a7a7a] mb-1">{stat.label}</p>
            <p className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

### Task 10: Dashboard - Business Management

**Files:**
- Create: `src/app/(dashboard)/pymes/page.tsx`
- Create: `src/app/(dashboard)/pymes/nueva/page.tsx`

- [ ] **Step 1: Create businesses list page**

```tsx
// src/app/(dashboard)/pymes/page.tsx
import { getAllBusinessesForAdmin } from "@/db/queries/businesses"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const typeLabel: Record<string, string> = {
  supermarket: "Supermercado",
  restaurant: "Restaurante",
  pharmacy: "Farmacia",
  gas_station: "Gasolinera",
  store: "Tienda",
  other: "Otro",
}

export default async function BusinessesPage() {
  const businesses = await getAllBusinessesForAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
            Pymes
          </h1>
          <p className="text-[17px] text-[#7a7a7a] tracking-[-0.374px]">
            Gestiona los negocios registrados
          </p>
        </div>
        <Button asChild className="rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white">
          <Link href="/dashboard/pymes/nueva">
            <Plus className="h-4 w-4 mr-2" />
            Nueva pyme
          </Link>
        </Button>
      </div>
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0]">
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Nombre</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Tipo</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Descuento</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Estado</th>
                <th className="text-right p-4 text-sm font-semibold text-[#1d1d1f]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((b) => (
                <tr key={b.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {b.logo ? (
                        <img src={b.logo} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-[#f5f5f7] flex items-center justify-center">
                          <span className="text-xs text-[#7a7a7a]">{b.name.charAt(0)}</span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-[#1d1d1f]">{b.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="rounded-full text-xs">
                      {typeLabel[b.type] || b.type}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-[#1d1d1f]">{b.discountPercentage}%</td>
                  <td className="p-4">
                    <Badge
                      className={`rounded-full text-xs ${
                        b.active
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {b.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" asChild className="rounded-full text-xs">
                      <Link href={`/dashboard/pymes/${b.id}`}>Editar</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create new business form page**

```tsx
// src/app/(dashboard)/pymes/nueva/page.tsx
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
```

```tsx
// src/app/(dashboard)/pymes/nueva/business-form.tsx
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
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    formData.set("type", type)
    await action(formData)
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
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
          <Select value={type} onValueChange={setType}>
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
      <div className="space-y-2">
        <Label htmlFor="description">Descripcion</Label>
        <Input
          id="description"
          name="description"
          defaultValue={defaultValues?.description}
          className="rounded-full"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            defaultValue={defaultValues?.whatsapp}
            className="rounded-full"
          />
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
```

---

### Task 11: Dashboard - Product & Membership Management

- [ ] **Step 1: Create products management page**

```tsx
// src/app/(dashboard)/productos/page.tsx - Simplified view with business selector
import { getAllBusinessesForAdmin } from "@/db/queries/businesses"
import { getAvailableProducts } from "@/db/queries/products"
import { ProductManager } from "./product-manager"

export default async function ProductsPage() {
  const businesses = await getAllBusinessesForAdmin()

  return (
    <div>
      <h1 className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-8">
        Productos
      </h1>
      <ProductManager businesses={businesses} />
    </div>
  )
}
```

```tsx
// src/app/(dashboard)/productos/product-manager.tsx
"use client"

import { useState, useEffect } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"

type Business = {
  id: string
  name: string
  type: string
}

type Product = {
  id: string
  name: string
  price: number
  available: boolean
  categoryId: string | null
  category: { id: string; name: string } | null
}

export function ProductManager({ businesses }: { businesses: Business[] }) {
  const [selectedBusiness, setSelectedBusiness] = useState<string>("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedBusiness) return
    setLoading(true)
    fetch(`/api/products?businessId=${selectedBusiness}`)
      .then((r) => r.json())
      .then((data) => setProducts(data))
      .finally(() => setLoading(false))
  }, [selectedBusiness])

  return (
    <div>
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 mb-6">
        <Label className="mb-2 block text-sm">Seleccionar pyme</Label>
        <Select value={selectedBusiness} onValueChange={setSelectedBusiness}>
          <SelectTrigger className="rounded-full max-w-xs">
            <SelectValue placeholder="Elegir pyme..." />
          </SelectTrigger>
          <SelectContent>
            {businesses.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {loading && <p className="text-sm text-[#7a7a7a]">Cargando productos...</p>}
      {products.length > 0 && (
        <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 border-b border-[#f0f0f0] last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-[#1d1d1f]">{p.name}</p>
                {p.category && (
                  <p className="text-xs text-[#0066cc]">{p.category.name}</p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-[#1d1d1f]">{formatPrice(p.price)}</span>
                <Badge
                  className={`rounded-full text-xs ${
                    p.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {p.available ? "Disponible" : "Agotado"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Create memberships page**

```tsx
// src/app/(dashboard)/membresias/page.tsx
import { getAllUsersForAdmin, updateUserMembership } from "@/db/queries/users"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { revalidatePath } from "next/cache"

export default async function MembershipsPage() {
  const users = await getAllUsersForAdmin()

  return (
    <div>
      <h1 className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px] mb-2">
        Membresias
      </h1>
      <p className="text-[17px] text-[#7a7a7a] mb-8 tracking-[-0.374px]">
        Gestiona las membresias de los usuarios
      </p>
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0]">
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Usuario</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Email</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Estado</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Tipo</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Vence</th>
                <th className="text-right p-4 text-sm font-semibold text-[#1d1d1f]">Accion</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="p-4 text-sm text-[#1d1d1f]">{user.name}</td>
                  <td className="p-4 text-sm text-[#7a7a7a]">{user.email}</td>
                  <td className="p-4">
                    <Badge
                      className={`rounded-full text-xs ${
                        user.membershipStatus === "active"
                          ? "bg-green-100 text-green-700"
                          : user.membershipStatus === "expired"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {user.membershipStatus === "active"
                        ? "Activa"
                        : user.membershipStatus === "expired"
                        ? "Vencida"
                        : user.membershipStatus === "cancelled"
                        ? "Cancelada"
                        : "Pendiente"}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-[#1d1d1f] capitalize">
                    {user.membershipType}
                  </td>
                  <td className="p-4 text-sm text-[#7a7a7a]">
                    {user.membershipExpiresAt
                      ? new Date(user.membershipExpiresAt).toLocaleDateString("es-CO")
                      : "-"}
                  </td>
                  <td className="p-4 text-right">
                    <form
                      action={async () => {
                        "use server"
                        const newStatus =
                          user.membershipStatus === "active" ? "cancelled" : "active"
                        await updateUserMembership(user.id, {
                          membershipStatus: newStatus,
                          membershipExpiresAt:
                            newStatus === "active"
                              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                              : undefined,
                        })
                        revalidatePath("/dashboard/membresias")
                      }}
                    >
                      <Button
                        type="submit"
                        variant="outline"
                        size="sm"
                        className="rounded-full text-xs"
                      >
                        {user.membershipStatus === "active"
                          ? "Desactivar"
                          : "Activar (30 dias)"}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create API route for products**

```tsx
// src/app/api/products/route.ts
import { NextResponse } from "next/server"
import { getAvailableProducts } from "@/db/queries/products"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const businessId = searchParams.get("businessId")

  if (!businessId) {
    return NextResponse.json({ error: "businessId required" }, { status: 400 })
  }

  const products = await getAvailableProducts(businessId)
  return NextResponse.json(products)
}
```

- [ ] **Step 4: Build check**

```bash
pnpm build
```

---

### Task 12: Promotions Management

**Files:**
- Create: `src/app/(dashboard)/promociones/page.tsx`

- [ ] **Step 1: Create promotions page**

```tsx
// src/app/(dashboard)/promociones/page.tsx
import { getAllPromotionsForAdmin, togglePromotionActive } from "@/db/queries/promotions"
import { getAllBusinessesForAdmin } from "@/db/queries/businesses"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { createPromotion } from "@/db/queries/promotions"

export default async function PromotionsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const [promotions, businesses] = await Promise.all([
    getAllPromotionsForAdmin(),
    getAllBusinessesForAdmin(),
  ])

  const typeLabels: Record<string, string> = {
    discount: "Descuento",
    offer: "Oferta",
    highlight: "Destacado",
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[34px] font-semibold text-[#1d1d1f] tracking-[-0.374px]">
            Promociones
          </h1>
          <p className="text-[17px] text-[#7a7a7a] tracking-[-0.374px]">
            Gestiona las promociones y ofertas
          </p>
        </div>
      </div>

      {/* Create Promotion Form */}
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 mb-6">
        <h2 className="text-[21px] font-semibold text-[#1d1d1f] mb-4 tracking-[0.231px]">
          Nueva promocion
        </h2>
        <form
          action={async (formData: FormData) => {
            "use server"
            await createPromotion({
              title: formData.get("title") as string,
              description: formData.get("description") as string,
              type: formData.get("type") as string,
              discountValue: parseFloat(formData.get("discountValue") as string) || undefined,
              businessId: formData.get("businessId") as string,
              featured: formData.get("featured") === "on",
              startsAt: formData.get("startsAt")
                ? new Date(formData.get("startsAt") as string)
                : undefined,
              endsAt: formData.get("endsAt")
                ? new Date(formData.get("endsAt") as string)
                : undefined,
              createdBy: session?.user.id,
            })
            revalidatePath("/dashboard/promociones")
          }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="space-y-2">
            <Label htmlFor="title">Titulo *</Label>
            <Input id="title" name="title" required className="rounded-full" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select name="type" defaultValue="offer">
              <SelectTrigger className="rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="discount">Descuento</SelectItem>
                <SelectItem value="offer">Oferta</SelectItem>
                <SelectItem value="highlight">Destacado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessId">Pyme *</Label>
            <Select name="businessId" required>
              <SelectTrigger className="rounded-full">
                <SelectValue placeholder="Elegir pyme" />
              </SelectTrigger>
              <SelectContent>
                {businesses.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discountValue">% Descuento</Label>
            <Input
              id="discountValue"
              name="discountValue"
              type="number"
              min="0"
              max="100"
              className="rounded-full"
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Descripcion</Label>
            <Input id="description" name="description" className="rounded-full" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" name="featured" />
            <Label htmlFor="featured" className="text-sm">Destacar en inicio</Label>
          </div>
          <div className="col-span-2">
            <Button type="submit" className="rounded-full bg-[#0066cc] hover:bg-[#0071e3] text-white">
              Crear promocion
            </Button>
          </div>
        </form>
      </div>

      {/* Promotions List */}
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e0e0e0]">
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Titulo</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Tipo</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Pyme</th>
                <th className="text-left p-4 text-sm font-semibold text-[#1d1d1f]">Estado</th>
                <th className="text-right p-4 text-sm font-semibold text-[#1d1d1f]">Accion</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((p) => (
                <tr key={p.id} className="border-b border-[#f0f0f0] last:border-0">
                  <td className="p-4">
                    <span className="text-sm font-medium text-[#1d1d1f]">{p.title}</span>
                    {p.featured && (
                      <Badge className="ml-2 rounded-full text-xs bg-[#0066cc] hover:bg-[#0066cc] text-white">
                        Destacado
                      </Badge>
                    )}
                  </td>
                  <td className="p-4 text-sm text-[#1d1d1f]">
                    {typeLabels[p.type]}
                    {p.discountValue ? ` (${p.discountValue}%)` : ""}
                  </td>
                  <td className="p-4 text-sm text-[#7a7a7a]">
                    {p.business?.name || "-"}
                  </td>
                  <td className="p-4">
                    <Badge
                      className={`rounded-full text-xs ${
                        p.active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.active ? "Activa" : "Inactiva"}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <form
                      action={async () => {
                        "use server"
                        await togglePromotionActive(p.id, !p.active)
                        revalidatePath("/dashboard/promociones")
                      }}
                    >
                      <Button type="submit" variant="outline" size="sm" className="rounded-full text-xs">
                        {p.active ? "Desactivar" : "Activar"}
                      </Button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Build check**

```bash
pnpm build
```

---

### Task 13: Delete Root Page Redirect & Final Polish

- [ ] **Step 1: Create a redirect at root app/page.tsx**

```tsx
// src/app/page.tsx
import { redirect } from "next/navigation"

export default function RootPage() {
  redirect("/")
}
```

Note: Delete `src/app/page.tsx` if the file was auto-generated (create-next-app puts page.tsx at root).

Actually, with route groups, the root `app/page.tsx` should NOT exist since `(public)/page.tsx` handles `/`. Delete it.

```bash
Remove-Item src/app/page.tsx -ErrorAction SilentlyContinue
```

- [ ] **Step 2: Final build check**

```bash
pnpm build
```

Expected: Clean build, no errors.

---

### Task 14: Add app metadata & favicon placeholder

- [ ] **Step 1: Update metadata icon reference**

Already done in root layout.tsx - no changes needed.

- [ ] **Step 2: Create placeholder favicon note**

The app will use the default Next.js favicon. In production, add a proper favicon.ico to `public/`.

---

## Post-MVP Tasks (Future)

These are documented but NOT part of this plan:
- Email notifications via Resend for membership activation
- QR code for membership validation
- Image upload system (likely uploadthing or S3)
- Pyme dashboard (when pymes want self-management)
- Payment integration for memberships
- Analytics dashboard with charts
- Premium membership tier with delivery benefits
