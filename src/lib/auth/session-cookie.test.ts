import test from "node:test"
import assert from "node:assert/strict"
import { getSessionTokenFromCookies } from "@/lib/auth/session-cookie"

test("returns undefined when no supported session cookie is present", () => {
  const sessionToken = getSessionTokenFromCookies([
    { name: "other_cookie", value: "123" },
  ])

  assert.equal(sessionToken, undefined)
})

test("prefers the production secure better-auth cookie name", () => {
  const sessionToken = getSessionTokenFromCookies([
    { name: "other_cookie", value: "123" },
    { name: "__Secure-mipymes.session_token", value: "secure-token" },
    { name: "mipymes_session_token", value: "legacy-token" },
  ])

  assert.equal(sessionToken, "secure-token")
})

test("accepts the legacy underscore session cookie name", () => {
  const sessionToken = getSessionTokenFromCookies([
    { name: "mipymes_session_token", value: "legacy-token" },
  ])

  assert.equal(sessionToken, "legacy-token")
})
