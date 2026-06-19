import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

let _db: ReturnType<typeof createDb> | null = null

function withRetry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T> {
  return fn().catch(async (err) => {
    if (retries <= 1) throw err
    await new Promise((r) => setTimeout(r, delay))
    return withRetry(fn, retries - 1, delay * 2)
  })
}

neonConfig.fetchFunction = (url: string, options: any) => {
  return withRetry(
    () => fetch(url, options),
    5,
    500,
  ) as Promise<Response>
}

function createDb() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not set")
  return drizzle(neon(url), { schema })
}

export function db() {
  if (!_db) _db = createDb()
  return _db
}

export type DbClient = ReturnType<typeof createDb>
