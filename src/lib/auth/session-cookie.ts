type CookieLike = {
  name: string
  value?: string
}

const SESSION_COOKIE_NAMES = [
  "__Secure-mipymes.session_token",
  "Secure-mipymes.session_token",
  "mipymes.session_token",
  "mipymes_session_token",
]

export function getSessionTokenFromCookies(cookies: CookieLike[]) {
  return cookies.find((cookie) => SESSION_COOKIE_NAMES.includes(cookie.name))?.value
}

export { SESSION_COOKIE_NAMES }
