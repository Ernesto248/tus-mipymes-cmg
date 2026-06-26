import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { db } from "@/db"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://socioplus.leonardsolutions.dev"
      : "http://localhost:3000"),
  database: drizzleAdapter(db(), {
    provider: "pg",
    schema: {
      user: schema.usersTable,
      session: schema.sessionsTable,
      account: schema.accountsTable,
      verification: schema.verificationsTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      provincia: { type: "string", required: false, defaultValue: "camaguey" },
      role: { type: "string", required: false, defaultValue: "member" },
    },
  },
  socialProviders: {},
  trustedOrigins: [
    "https://socioplus.leonardsolutions.dev",
    "http://localhost:3000",
  ],
  advanced: {
    cookiePrefix: "mipymes",
    cookies: {
      sessionCookie: {
        name: "mipymes.session_token",
        attributes: {
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
          secure: process.env.NODE_ENV === "production",
        },
      },
    },
  },
  plugins: [nextCookies()],
})
