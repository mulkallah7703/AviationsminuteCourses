/** Deterministic hash for stable dashboard derivations (API-ready: replace with server payload). */
export function stableHash(str) {
  const s = String(str ?? '')
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  return h >>> 0
}

/** Returns float in [0, 1) derived from seed + salt (deterministic). */
export function seededUnit(seed, salt) {
  const x = Math.imul((seed ^ salt) >>> 0, 2654435761) >>> 0
  return x / 0xffffffff
}

export function pickSeeded(seed, salt, list) {
  if (!list?.length) return null
  const i = Math.floor(seededUnit(seed, salt) * list.length) % list.length
  return list[i]
}
