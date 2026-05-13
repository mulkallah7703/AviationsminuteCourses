/**
 * Resolves the API base URL for fetch calls.
 *
 * | Environment | VITE_API_URL | Result |
 * |-------------|--------------|--------|
 * | Vercel prod (same project) | unset | '' → same-origin `/api/*` |
 * | Vercel prod (separate API) | `https://api.example.com` | external host |
 * | Local dev (Vite) | unset | '' → Vite proxy forwards `/api` → Express :4000 |
 */
export function getApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return ''
}

export function joinApiUrl(path) {
  if (path.startsWith('http')) return path
  const base = getApiBaseUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${normalized}` : normalized
}

export const API_REQUEST_TIMEOUT_MS = 12_000
export const API_MAX_RETRIES = 3
