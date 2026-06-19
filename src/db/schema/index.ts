import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  real,
  pgEnum,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("role", ["admin", "editor", "viewer"])

export const membershipStatusEnum = pgEnum("membership_status", [
  "active",
  "expired",
  "cancelled",
  "pending",
])

export const businessTypeEnum = pgEnum("business_type", [
  "supermarket",
  "restaurant",
  "pharmacy",
  "gas_station",
  "store",
  "other",
])

export const promotionTypeEnum = pgEnum("promotion_type", [
  "discount",
  "offer",
  "highlight",
])

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  phone: text("phone"),
  provincia: text("provincia").default("camaguey"),
  membershipStatus: membershipStatusEnum("membership_status").default("pending").notNull(),
  membershipExpiresAt: timestamp("membership_expires_at", { withTimezone: true }),
  membershipType: text("membership_type").default("basic"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const businessesTable = pgTable("businesses", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  type: businessTypeEnum("type").notNull().default("other"),
  provincia: text("provincia").default("camaguey").notNull(),
  address: text("address"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  logo: text("logo"),
  coverImage: text("cover_image"),
  discountPercentage: real("discount_percentage").default(0).notNull(),
  premiumDiscountPercentage: real("premium_discount_percentage"),
  priorityEnabled: boolean("priority_enabled").default(true).notNull(),
  deliveryEnabled: boolean("delivery_enabled").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  metadata: jsonb("metadata"),
  updatedBy: text("updated_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const categoriesTable = pgTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  businessId: text("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  order: integer("order").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: real("price").notNull(),
  image: text("image"),
  available: boolean("available").default(true),
  discountable: boolean("discountable").default(true),
  businessId: text("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => categoriesTable.id, {
    onDelete: "set null",
  }),
  updatedBy: text("updated_by").references(() => usersTable.id),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const promotionsTable = pgTable("promotions", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  type: promotionTypeEnum("type").notNull().default("offer"),
  discountValue: real("discount_value"),
  image: text("image"),
  businessId: text("business_id")
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  productId: text("product_id").references(() => productsTable.id, {
    onDelete: "set null",
  }),
  startsAt: timestamp("starts_at", { withTimezone: true }),
  endsAt: timestamp("ends_at", { withTimezone: true }),
  active: boolean("active").default(true).notNull(),
  featured: boolean("featured").default(false),
  createdBy: text("created_by").references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

export const auditLogTable = pgTable("audit_logs", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  changes: jsonb("changes"),
  performedBy: text("performed_by")
    .notNull()
    .references(() => usersTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})
