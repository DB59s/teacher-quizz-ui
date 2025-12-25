import { getSession, signOut } from 'next-auth/react'

export async function fetchApi(input: RequestInfo, init?: RequestInit) {
  const session = await getSession()
  const token = session?.accessToken

  const response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json'
    }
  })

  // Handle 401 Unauthorized - sign out immediately
  if (response.status === 401) {
    await signOut({ callbackUrl: '/login', redirect: true })
    throw new Error('Session expired. Please log in again.')
  }

  return response
}
