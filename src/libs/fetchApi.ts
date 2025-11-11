import { getSession, signOut } from 'next-auth/react'

async function callRefreshToken(refreshToken: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  })

  if (!response.ok) throw new Error('Failed to refresh token')

  return await response.json()
}

export async function fetchApi(input: RequestInfo, init?: RequestInit) {
  const session = await getSession()
  let token = session?.accessToken
  let refreshToken = session?.refreshToken

  let response = await fetch(input, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json'
    }
  })

  // Handle 401 Unauthorized
  if (response.status === 401) {
    // If we have a refresh token, try to refresh
    if (refreshToken) {
      try {
        const refreshed = await callRefreshToken(refreshToken)

        token = refreshed.accessToken
        refreshToken = refreshed.refreshToken

        // Retry the request with new token
        response = await fetch(input, {
          ...init,
          headers: {
            ...(init?.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            'Content-Type': 'application/json'
          }
        })

        // If still 401 after refresh, sign out
        if (response.status === 401) {
          await signOut({ callbackUrl: '/login', redirect: true })
          throw new Error('Authentication failed after token refresh')
        }
      } catch (err) {
        // Refresh token failed or expired, sign out
        await signOut({ callbackUrl: '/login', redirect: true })
        throw new Error('Token refresh failed. Please log in again.')
      }
    } else {
      // No refresh token available, sign out immediately
      await signOut({ callbackUrl: '/login', redirect: true })
      throw new Error('No valid session. Please log in again.')
    }
  }

  return response
}
