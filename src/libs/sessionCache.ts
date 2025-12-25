import { getSession as nextAuthGetSession } from 'next-auth/react'

let cachedSession: any = null
let cacheTime: number = 0
const CACHE_TTL = 30000 // 30 seconds

export async function getCachedSession() {
  const now = Date.now()

  // Return cached session if still valid
  if (cachedSession && now - cacheTime < CACHE_TTL) {
    return cachedSession
  }

  // Fetch new session
  cachedSession = await nextAuthGetSession()
  cacheTime = now

  return cachedSession
}

// Clear cache when session changes (e.g., logout)
export function clearSessionCache() {
  cachedSession = null
  cacheTime = 0
}
